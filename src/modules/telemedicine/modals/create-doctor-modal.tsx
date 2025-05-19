"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTelemedicineAdminModal } from "../stores/use-telemedicine-admin-modal-store";
import { createDoctorFormSchema } from "../schemas/create-doctor-form-schema";
import { CustomInput } from "../ui/custom-input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createDoctor,
  getAllUsersWithTelemedicineDoctorRole,
} from "../serveractions/admin/doctorActions";
import { useEffect, useState } from "react";
import { UserWithDoctorRoleDataType } from "../types/data-types";
import { Loader2, TriangleAlert } from "lucide-react";

type CreateDoctorFormSchemaType = z.infer<typeof createDoctorFormSchema>;

export const CreateDoctorModal = () => {
  const session = useSession();
  const router = useRouter();

  const closeModal = useTelemedicineAdminModal((state) => state.onClose);
  const modalType = useTelemedicineAdminModal((state) => state.type);
  const isOpen = useTelemedicineAdminModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "createDoctor";

  const [userData, setUserData] = useState<UserWithDoctorRoleDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        try {
          setError(null);
          setIsLoading(true);
          const data = await getAllUsersWithTelemedicineDoctorRole();
          setUserData(data);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setIsLoading(false);
          setError("Failed to get data.");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isModalOpen]);

  const form = useForm<CreateDoctorFormSchemaType>({
    resolver: zodResolver(createDoctorFormSchema),
    defaultValues: {
      userId: "",
      license_number: "",
      specialization: "",
      phone: "",
      address: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: CreateDoctorFormSchemaType) {
    if (session?.data?.user?.role !== "telemedicine-admin") {
      toast("unauthorized.");
      return;
    }

    const user = userData.find((data) => data.userId === values.userId);
    const data = {
      name: user?.user.name,
      email: user?.user.email,
      orgId: user?.organizationId,
      role: user?.role.name,
    };
    try {
      await createDoctor(values, data);
      toast.success("Doctor created successfully!");
      router.refresh();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong!");
    }
  }

  function handleCloseModal() {
    form.reset();
    setError(null);
    setIsLoading(false);
    setUserData([]);
    closeModal();
  }

  const selectUserList = userData.map((data) => {
    return {
      label: (
        <>
          <span>{data.user.name}</span>(@{data.user.username})
        </>
      ),
      value: data.userId,
    };
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Create Doctor {isLoading && <Loader2 className="animate-spin" />}
          </DialogTitle>
        </DialogHeader>
        {error && (
          <p className="flex items-center justify-center gap-2">
            <TriangleAlert className="text-rose-500 h-5 w-5" />{" "}
            <span>{error}</span>
          </p>
        )}
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <CustomInput
                  type="select"
                  name="userId"
                  label="User"
                  placeholder={
                    userData.length === 0 ? "No user to select" : "Pick a user"
                  }
                  control={form.control}
                  selectList={selectUserList}
                  className="w-full"
                  disable={
                    isLoading ||
                    Boolean(error) ||
                    Boolean(userData.length === 0)
                  }
                />
                <CustomInput
                  type="input"
                  name="license_number"
                  label="License Number"
                  placeholder="Enter license number"
                  control={form.control}
                  disable={isLoading || Boolean(error)}
                />
                <CustomInput
                  type="input"
                  name="specialization"
                  label="Specialization"
                  placeholder="Enter specialization"
                  control={form.control}
                  disable={isLoading || Boolean(error)}
                />
                <CustomInput
                  type="input"
                  name="phone"
                  label="Phone"
                  placeholder="Enter phone number"
                  control={form.control}
                  disable={isLoading || Boolean(error)}
                />
                <CustomInput
                  type="textarea"
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                  control={form.control}
                  disable={isLoading || Boolean(error)}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || Boolean(error)}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin">⌛</span>
                    Creating...
                  </div>
                ) : (
                  "Create Doctor"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
