"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppType } from "@prisma/client";

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
import { addApp } from "../serveractions/admin-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createAppFormSchema = z.object({
  name: z.string().min(3, { message: "name must be atleast 3 characters." }),
  slug: z
    .string()
    .min(3, { message: "slug is required." })
    .refine((val) => val === val.toLowerCase(), {
      message: "Slug must be in lowercase.",
    }),
  description: z
    .string()
    .min(5, "Description must have atleast 5 characters")
    .max(150, "Description must have atmost 150 characters"),
  type: z.nativeEnum(AppType),
});

type CreateAppFormSchemaType = z.infer<typeof createAppFormSchema>;

export const CreateAppModal = () => {
  const session = useSession();
  const closeModal = useAdminModal((state) => state.onClose);
  const modalType = useAdminModal((state) => state.type);
  const isOpen = useAdminModal((state) => state.isOpen);
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "addApp";

  const types = Object.values(AppType);

  const form = useForm<CreateAppFormSchemaType>({
    resolver: zodResolver(createAppFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      type: "platform",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function handleCreateUser(values: CreateAppFormSchemaType) {
    if (session.data?.user.role !== "admin") {
      return;
    }

    // const { name, slug, description, type } = values;

    try {
      await addApp({ ...values });
      toast("App created successfully.");
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
            Create App
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
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="..." {...field} />
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
                  name="type"
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
                          {types.map((type, i) => (
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
                        Create <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      "Create"
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
