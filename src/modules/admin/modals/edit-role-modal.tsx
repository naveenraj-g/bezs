"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useAdminModal } from "../stores/use-admin-modal-store";
import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { editRole, getRole } from "../serveractions/admin-actions";
import { useEffect } from "react";

const editRoleFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  description: z
    .string()
    .min(3, { message: "description must be atleast 3 character long." })
    .max(150, { message: "description must be atleast 150 character long." }),
});

type EditRoleFormSchemaType = z.infer<typeof editRoleFormSchema>;

export const EditRoleModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const roleId = useAdminModal((state) => state.roleId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "editRole";

  const form = useForm<EditRoleFormSchemaType>({
    resolver: zodResolver(editRoleFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isModalOpen && roleId) {
      (async () => {
        try {
          const role = await getRole({ roleId });
          form.setValue("name", role?.name || "");
          form.setValue("description", role?.description || "");
        } catch (err) {
          toast("Error", {
            description: (err as Error)?.message,
          });
        }
      })();
    }
  }, [isModalOpen, roleId, form]);

  const {
    formState: { isSubmitting },
  } = form;

  async function handleEditRole(values: EditRoleFormSchemaType) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    const { name, description } = values;

    try {
      await editRole({ roleId, name, description });
      toast("Role updated successfully.");
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
            Edit Role
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditRole)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="name" {...field} />
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
                        <Input placeholder="..." {...field} />
                      </FormControl>
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
                        update <Loader2 className="animate-spin" />
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
