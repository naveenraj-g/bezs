/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from "react";
import {
  editAppMenuItem,
  getAppMenuItem,
} from "../serveractions/admin-actions";

const editAppMenuItemFormSchema = z.object({
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

type EditAppMenuItemFormSchemaType = z.infer<typeof editAppMenuItemFormSchema>;

export const EditAppMenuItemModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const appMenuItemId = useAdminModal((state) => state.appMenuItemId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isModalOpen = isOpen && modalType === "editAppMenuItem";

  const form = useForm<EditAppMenuItemFormSchemaType>({
    resolver: zodResolver(editAppMenuItemFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!appMenuItemId || !isModalOpen) return;
    (async () => {
      try {
        setIsLoading(true);
        const appMenuItemData = await getAppMenuItem({ appMenuItemId });

        form.reset({
          name: appMenuItemData?.name || "",
          slug: appMenuItemData?.slug || "",
          description: appMenuItemData?.description || "",
          icon: appMenuItemData?.icon || "",
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
  }, [isModalOpen, appMenuItemId, form]);

  // console.log(userDetails);

  const {
    formState: { isSubmitting },
  } = form;

  async function handleEditAppMenuItem(values: EditAppMenuItemFormSchemaType) {
    if (session?.data?.user.role !== "admin") {
      return;
    }

    try {
      await editAppMenuItem({ ...values, appMenuItemId });
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
            Edit App
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditAppMenuItem)}
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
