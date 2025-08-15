"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAiHubAdminModal } from "../../stores/use-ai-hub-admin-modal-store";
import { AdminCreateAiModelSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { AiModelType } from "../../../../../prisma/generated/ai-hub";
import { useServerAction } from "zsa-react";
import { editModel } from "../../serveractions/admin-server-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useEffect } from "react";

type EditModelFormSchemaType = z.infer<typeof AdminCreateAiModelSchema>;

export const AdminEditAiModelModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);
  const modelData = useAiHubAdminModal((state) => state.modelData);

  const isModalOpen = isOpen && modalType === "editModel";

  const modelForm = useForm<EditModelFormSchemaType>({
    resolver: zodResolver(AdminCreateAiModelSchema),
    defaultValues: {
      displayName: modelData?.displayName || "",
      modelName: modelData?.modelName || "",
      modelUrl: modelData?.modelUrl || "",
      secretKey: modelData?.secretKey || "",
      tokens: modelData?.tokens || "",
      type: modelData?.type || "PRE_AVAILABLE",
      defaultPrompt: modelData?.defaultPrompt || "You are a helpful assistant.",
      maxToken: modelData?.maxToken || 1000,
      temperature: modelData?.temperature || 0.5,
      topP: modelData?.topP || 1,
      topK: modelData?.topK || 10,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      modelForm.reset({
        displayName: modelData?.displayName || "",
        modelName: modelData?.modelName || "",
        modelUrl: modelData?.modelUrl || "",
        secretKey: modelData?.secretKey || "",
        tokens: modelData?.tokens || "",
        type: modelData?.type || "PRE_AVAILABLE",
        defaultPrompt:
          modelData?.defaultPrompt || "You are a helpful assistant.",
        maxToken: modelData?.maxToken || 1000,
        temperature: modelData?.temperature || 0.5,
        topP: modelData?.topP || 1,
        topK: modelData?.topK || 10,
      });
    }
  }, [
    isModalOpen,
    modelData?.defaultPrompt,
    modelData?.displayName,
    modelData?.maxToken,
    modelData?.modelName,
    modelData?.modelUrl,
    modelData?.secretKey,
    modelData?.temperature,
    modelData?.tokens,
    modelData?.topK,
    modelData?.topP,
    modelData?.type,
    modelForm,
  ]);

  const {
    formState: { isSubmitting },
  } = modelForm;

  const { execute } = useServerAction(editModel, {
    onSuccess() {
      toast.success("Model created successfully.", {
        richColors: true,
      });
    },
    onError(args) {
      toast.error("Error", {
        description: args.err.message,
        richColors: true,
      });
    },
  });

  async function onAiModelSubmit(values: EditModelFormSchemaType) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    if (!modelData?.id) {
      toast.error("Model ID not found!");
      return;
    }

    const data = {
      id: modelData?.id,
      ...values,
    };

    try {
      await execute(data);
      triggerRefetch();
      handleCloseModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  function handleCloseModal() {
    modelForm.reset();
    closeModal();
  }

  const selectModel = Object.keys(AiModelType).map((modelType) => ({
    label: modelType,
    value: modelType,
  }));

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="h-[648px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Edit AI Model
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...modelForm}>
            <form
              onSubmit={modelForm.handleSubmit(onAiModelSubmit)}
              className="space-y-8"
            >
              <Tabs>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="space-y-4 mt-2">
                    <CustomInput
                      type="input"
                      name="displayName"
                      label="Display Name"
                      placeholder="Enter model display name"
                      control={modelForm.control}
                    />
                    <CustomInput
                      type="input"
                      name="modelName"
                      label="Model Name"
                      placeholder="Enter model name"
                      control={modelForm.control}
                    />
                    <CustomInput
                      type="input"
                      name="modelUrl"
                      label="Model URL"
                      placeholder="Enter model url"
                      control={modelForm.control}
                    />
                    <CustomInput
                      type="input"
                      name="secretKey"
                      label="Secret Key"
                      placeholder="Enter model key"
                      control={modelForm.control}
                    />
                    <CustomInput
                      type="input"
                      name="tokens"
                      label="Tokens"
                      placeholder="Enter model tokens"
                      control={modelForm.control}
                    />
                    <CustomInput
                      type="select"
                      name="type"
                      label="Model Type"
                      placeholder="select model type"
                      defaultValue={modelForm.getFieldState("type")}
                      control={modelForm.control}
                      selectList={selectModel}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="settings">
                  <div className="space-y-4 mt-2">
                    <CustomInput
                      type="textarea"
                      name="defaultPrompt"
                      label="Default Prompt"
                      placeholder="Type system defailt prompts..."
                      control={modelForm.control}
                      className="w-full"
                    />
                    <CustomInput
                      type="input"
                      inputType="number"
                      name="maxToken"
                      label="Max Token"
                      placeholder="max token..."
                      control={modelForm.control}
                      className="w-full"
                    />
                    <div>
                      <FormField
                        control={modelForm.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2 justify-between w-full p-3 bg-gray-200 dark:bg-white/8 rounded-xl">
                                <p className="text-xl font-medium">
                                  {field.value}
                                </p>
                                <Slider
                                  className="my-2"
                                  step={0.1}
                                  min={0.1}
                                  max={1}
                                  value={[field.value]}
                                  onValueChange={(val) =>
                                    field.onChange(val[0])
                                  }
                                />
                                <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
                                  <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                    Precise
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                    Neutral
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                    Creative
                                  </p>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                  Higher values like 0.8 will make the output
                                  more random, while lower values like 0.2 will
                                  make it more focus and deterministic.
                                </p>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={modelForm.control}
                        name="topP"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TopP</FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2 justify-between w-full p-3 bg-gray-200 dark:bg-white/8 rounded-xl">
                                <p className="text-xl font-medium">
                                  {field.value}
                                </p>
                                <Slider
                                  className="my-2"
                                  step={0.01}
                                  min={0}
                                  max={1}
                                  value={[field.value]}
                                  onValueChange={(val) =>
                                    field.onChange(val[0])
                                  }
                                />
                                <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
                                  <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                    Precise
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                    Creative
                                  </p>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                  An alternative to sampling with temperature,
                                  called nucleus sampling, where the model
                                  considers the results of the tokens with top_p
                                  probability mass. so 0.1 means only the tokens
                                  comprising the top 10% probability mass re
                                  considered.
                                </p>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={modelForm.control}
                        name="topK"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TopK</FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2 justify-between w-full p-3 bg-gray-200 dark:bg-white/8 rounded-xl">
                                <p className="text-xl font-medium">
                                  {field.value}
                                </p>
                                <Slider
                                  className="my-2"
                                  step={1}
                                  min={0}
                                  max={100}
                                  value={[field.value]}
                                  onValueChange={(val) =>
                                    field.onChange(val[0])
                                  }
                                />
                                <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
                                  <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                    Precise
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                    Creative
                                  </p>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                                  An alternative to sampling with temperature,
                                  called nucleus sampling, where the model
                                  considers the results of the tokens with top_k
                                  probability mass. so 0.1 means only the tokens
                                  comprising the top 10% probability mass re
                                  considered.
                                </p>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Editing...
                  </div>
                ) : (
                  "Edit Model"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
