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

const createOrganizationFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  slug: z
    .string()
    .min(3, { message: "slug is required." })
    .refine((val) => val === val.toLowerCase(), {
      message: "Slug must be in lowercase.",
    }),
  logoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || undefined),
});

type CreateOrganizationFormSchemaType = z.infer<
  typeof createOrganizationFormSchema
>;

export const CreateOrganizationModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "addOrganization";

  const form = useForm<CreateOrganizationFormSchemaType>({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      logoUrl: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function handleCreateUser(values: CreateOrganizationFormSchemaType) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    const { name, slug, logoUrl } = values;

    await authClient.organization.create(
      {
        name,
        slug,
        logo: logoUrl,
      },
      {
        onSuccess() {
          toast("Organization Created.");
        },
        onError(ctx) {
          toast("Error", {
            description: ctx.error.message,
          });
        },
      }
    );

    incrementTriggerRefetch();
    form.reset();
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
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https/..." {...field} />
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
