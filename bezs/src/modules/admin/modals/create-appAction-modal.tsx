"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppActionType } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminModal } from "../stores/use-admin-modal-store";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { addAppAction } from "../serveractions/admin-actions";

const createAppActionSchema = z.object({
  actionName: z
    .string()
    .min(3, { message: "action must be atleast 3 characters." }),
  actionType: z.nativeEnum(AppActionType),
  description: z
    .string()
    .min(10, { message: "description must be alteast 10 characters long." })
    .max(150, { message: "description must be alteast 150 characters long." }),
  icon: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || undefined),
});

type CreateAppActionFormSchemaType = z.infer<typeof createAppActionSchema>;

export const CreateAppActionModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const appId = useAdminModal((state) => state.appId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "addAppAction";

  const actionTypes = Object.values(AppActionType);

  const form = useForm<CreateAppActionFormSchemaType>({
    resolver: zodResolver(createAppActionSchema),
    defaultValues: {
      actionName: "",
      actionType: "button",
      description: "",
      icon: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function handleCreateAction(values: CreateAppActionFormSchemaType) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    if (!appId) return;

    try {
      await addAppAction({ ...values, appId });
      toast("Action created successfully.");
      form.reset();
      incrementTriggerRefetch();
      closeModal();
    } catch (err) {
      toast("Error!", {
        description: (err as Error).message,
      });
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8 ">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl text-center">
            Create App Action
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateAction)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="actionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Name</FormLabel>
                      <FormControl>
                        <Input placeholder="...." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="...." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Icon</FormLabel>
                      <FormControl>
                        <Input placeholder="icon name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {actionTypes.map((type, i) => (
                            <SelectItem value={type} key={i}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-x-4">
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        Submit <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
          </div>
          <DialogFooter className="space-x-2"></DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
