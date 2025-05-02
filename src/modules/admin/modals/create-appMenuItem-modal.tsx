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
import { useEffect } from "react";
import { addAppMenuItem } from "../serveractions/admin-actions";

const createAppMenuItemSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  slug: z
    .string()
    .min(3, { message: "slug is required." })
    .refine((val) => val === val.toLowerCase(), {
      message: "Slug must be in lowercase.",
    }),
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

type CreateAppMenuItemFormSchemaType = z.infer<typeof createAppMenuItemSchema>;

export const CreateAppMenuItemModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const appId = useAdminModal((state) => state.appId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "addAppMenuItem";

  const form = useForm<CreateAppMenuItemFormSchemaType>({
    resolver: zodResolver(createAppMenuItemSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      description: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    form.reset({
      name: "",
      slug: "",
      description: "",
      icon: "",
    });
  }, [form]);

  async function handleCreateMenuItem(values: CreateAppMenuItemFormSchemaType) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    if (!appId) return;

    try {
      await addAppMenuItem({ ...values, appId });
      toast("Menu Item created successfully.");
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
            Create App MenuItem
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateMenuItem)}
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
                        <Input placeholder="...." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (Lowercase)</FormLabel>
                      <FormControl>
                        <Input placeholder="my-org" {...field} />
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
                      <FormLabel>Menu Icon</FormLabel>
                      <FormControl>
                        <Input placeholder="icon name" {...field} />
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
