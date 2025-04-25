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
import {
  authClient,
  useSession,
} from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { addRole } from "../serveractions/auth-actions";

const createOrganizationFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  description: z.string(),
});

type CreateOrganizationFormSchemaType = z.infer<
  typeof createOrganizationFormSchema
>;

export const CreateRoleModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "addRole";

  const form = useForm<CreateOrganizationFormSchemaType>({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function handleCreateUser(values: CreateOrganizationFormSchemaType) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    const { name, description } = values;

    try {
      await addRole({ name, description });
      toast("Role added successfully.");
      form.reset();
    } catch (err) {
      toast("Error!", {
        description: (err as Error).message,
      });
    }

    incrementTriggerRefetch();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-8 ">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl text-center">
            Create Organization
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateUser)}
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
