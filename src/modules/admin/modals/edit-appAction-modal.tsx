/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from "react";
import { editAppAction, getAppAction } from "../serveractions/admin-actions";

const editAppActionFormSchema = z.object({
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

type EditAppActionFormSchemaType = z.infer<typeof editAppActionFormSchema>;

export const EditAppActionModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const appActionId = useAdminModal((state) => state.appActionId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isModalOpen = isOpen && modalType === "editAppAction";

  const actionTypes = Object.values(AppActionType);

  const form = useForm<EditAppActionFormSchemaType>({
    resolver: zodResolver(editAppActionFormSchema),
    defaultValues: {
      actionName: "",
      actionType: "button",
      description: "",
      icon: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!appActionId) return;

      try {
        setIsLoading(true);
        const appActionData = await getAppAction({ appActionId });

        form.reset({
          actionName: appActionData?.actionName || "",
          actionType: appActionData?.actionType || "button",
          description: appActionData?.description || "",
          icon: appActionData?.icon || "",
        });
        setIsLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast("Error", {
          description: "Failed to fetch App data.",
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [appActionId, form]);

  const {
    formState: { isSubmitting },
  } = form;

  async function handleEditAppAction(values: EditAppActionFormSchemaType) {
    if (session?.data?.user.role !== "admin") {
      return;
    }

    try {
      await editAppAction({ ...values, appActionId });
      toast("App MenuItem updated successfully.");
      form.reset();
      incrementTriggerRefetch();
      closeModal();
    } catch (err) {
      toast("Error!", {
        description: (err as Error).message,
      });
    }
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-8 ">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl text-center">
            Edit Action
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditAppAction)}
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
                        value={field.value}
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
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? (
                      <>
                        Update <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      "Update"
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
