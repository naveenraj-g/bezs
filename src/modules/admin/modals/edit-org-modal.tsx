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
import {
  authClient,
  useSession,
} from "@/modules/auth/services/better-auth/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const editOrgFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  logoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => val || undefined),
  slug: z.string().refine((val) => val === val.toLowerCase(), {
    message: "Slug must be in lowercase.",
  }),
});

type EditOrgFormSchemaType = z.infer<typeof editOrgFormSchema>;

type orgDetails = {
  name: string | undefined;
  logoUrl: string | null;
  slug?: string;
};

export const EditOrgModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const organizationId = useAdminModal((state) => state.orgId) || "";
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orgDetails, setOrgDetails] = useState<orgDetails>({});

  const isModalOpen = isOpen && modalType === "editOrg";

  const form = useForm<EditOrgFormSchemaType>({
    resolver: zodResolver(editOrgFormSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      slug: "",
    },
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const orgData = await authClient.organization.getFullOrganization(
        {
          query: { organizationId: organizationId },
        },
        {
          onError(ctx) {
            toast("Error!", {
              description: ctx.error.message,
            });
            setIsLoading(false);
          },
        }
      );
      setOrgDetails({
        name: orgData?.data?.name,
        logoUrl: orgData?.data?.logoUrl,
        slug: orgData?.data?.slug,
      });

      form.reset({
        name: orgData?.data?.name,
        logoUrl: orgData?.data?.logoUrl,
        slug: orgData?.data?.slug,
      });
      setIsLoading(false);
    })();
  }, [organizationId, form]);

  const {
    formState: { isSubmitting },
  } = form;

  async function handleUpdateOrg(values: EditOrgFormSchemaType) {
    const { name, slug, logoUrl } = values;

    if (session?.data?.user.role !== "admin") {
      return;
    }

    await authClient.organization.update(
      {
        data: {
          name,
          logo: logoUrl,
          slug: slug,
        },
        organizationId: organizationId,
      },
      {
        onSuccess() {
          toast("Organization updated successfully!");
          incrementTriggerRefetch();
          closeModal();
        },
        onError(ctx) {
          toast("Error!", {
            description: ctx.error.message,
          });
        },
      }
    );
  }

  function handleCloseModal() {
    setOrgDetails({
      name: "",
      logoUrl: "",
      slug: "",
    });
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="p-8 ">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl text-center">
            Edit Organization
          </DialogTitle>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateOrg)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name"
                          {...field}
                          disabled={isLoading}
                        />
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
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@gmail.com"
                          {...field}
                          disabled={isLoading}
                        />
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
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https/..."
                          {...field}
                          disabled={isLoading}
                        />
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
