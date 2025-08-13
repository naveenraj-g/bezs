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
import { AdminCreateModelSettingsSchema } from "../../schema/admin-schemas";
import { CustomInput } from "@/shared/ui/custom-input";
import { useServerAction } from "zsa-react";
import { editModelSettings } from "../../serveractions/admin-server-actions";
import { Slider } from "@/components/ui/slider";
import { useEffect } from "react";

type CreateModelSettingsFormSchemaType = z.infer<
  typeof AdminCreateModelSettingsSchema
>;

export const AdminEditModelSettingsModal = () => {
  const session = useSession();

  const closeModal = useAiHubAdminModal((state) => state.onClose);
  const modalType = useAiHubAdminModal((state) => state.type);
  const isOpen = useAiHubAdminModal((state) => state.isOpen);
  const triggerRefetch = useAiHubAdminModal((state) => state.incrementTrigger);
  const modelSettingsData = useAiHubAdminModal(
    (state) => state.modelSettingsData
  );
  const modelsForSettingsMap = useAiHubAdminModal(
    (state) => state.modelsForSettingsMap
  );

  const isModalOpen = isOpen && modalType === "editModelSettings";

  const modelForm = useForm<CreateModelSettingsFormSchemaType>({
    resolver: zodResolver(AdminCreateModelSettingsSchema),
    defaultValues: {
      modelId: "",
      defaultPrompt: "You are a helpful assistant.",
      maxToken: 1000,
      temperature: 0.5,
      topP: 1,
      topK: 10,
    },
  });

  const {
    formState: { isSubmitting },
  } = modelForm;

  useEffect(() => {
    if (isModalOpen && modelSettingsData) {
      modelForm.reset({
        modelId: modelSettingsData?.modelId,
        defaultPrompt: modelSettingsData?.defaultPrompt,
        maxToken: modelSettingsData.maxToken,
        temperature: modelSettingsData.temperature,
        topP: modelSettingsData.topP,
        topK: modelSettingsData.topK,
      });
    }
  }, [isModalOpen, modelForm, modelSettingsData]);

  const { execute } = useServerAction(editModelSettings, {
    onSuccess() {
      toast.success("Model Settings Edited.", {
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

  async function onAiModelSubmit(values: CreateModelSettingsFormSchemaType) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    if (!modelSettingsData) {
      toast("Invalid data.");
      return;
    }

    const data = {
      id: modelSettingsData?.id,
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

  const selectModel = modelsForSettingsMap?.map((model) => ({
    label: `${model.displayName} (${model.modelName})`,
    value: model.id,
  }));

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="h-[648px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Edit Model Settings
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...modelForm}>
            <form
              onSubmit={modelForm.handleSubmit(onAiModelSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4 mt-2">
                <CustomInput
                  type="select"
                  name="modelId"
                  label="Default Prompt"
                  placeholder="Select a model"
                  control={modelForm.control}
                  className="w-full"
                  selectList={selectModel}
                />
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
                            <p className="text-xl font-medium">{field.value}</p>
                            <Slider
                              className="my-2"
                              step={0.1}
                              min={0.1}
                              max={1}
                              value={[field.value]}
                              onValueChange={(val) => field.onChange(val[0])}
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
                              Higher values like 0.8 will make the output more
                              random, while lower values like 0.2 will make it
                              more focus and deterministic.
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
                            <p className="text-xl font-medium">{field.value}</p>
                            <Slider
                              className="my-2"
                              step={0.01}
                              min={0}
                              max={1}
                              value={[field.value]}
                              onValueChange={(val) => field.onChange(val[0])}
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
                              called nucleus sampling, where the model considers
                              the results of the tokens with top_p probability
                              mass. so 0.1 means only the tokens comprising the
                              top 10% probability mass re considered.
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
                            <p className="text-xl font-medium">{field.value}</p>
                            <Slider
                              className="my-2"
                              step={1}
                              min={0}
                              max={100}
                              value={[field.value]}
                              onValueChange={(val) => field.onChange(val[0])}
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
                              called nucleus sampling, where the model considers
                              the results of the tokens with top_k probability
                              mass. so 0.1 means only the tokens comprising the
                              top 10% probability mass re considered.
                            </p>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Editing...
                  </div>
                ) : (
                  "Edit Model Settings"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
