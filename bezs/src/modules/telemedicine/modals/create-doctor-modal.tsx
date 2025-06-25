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
import {
  createAIDoctorFormSchema,
  createDoctorFormSchema,
} from "../schemas/create-doctor-form-schema";
import { CustomInput } from "../../../shared/ui/custom-input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createAIDoctor,
  createDoctor,
  getAllUsersWithTelemedicineDoctorRole,
} from "../serveractions/admin/doctorActions";
import { useEffect, useState } from "react";
import { UserWithDoctorRoleDataType } from "../types/data-types";
import { Loader2, TriangleAlert } from "lucide-react";
import { adminRole } from "../utils/roles";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CreateDoctorFormSchemaType = z.infer<typeof createDoctorFormSchema>;
type TCreateAIDoctorFormSchema = z.infer<typeof createAIDoctorFormSchema>;

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

  const HumanDoctorForm = useForm<CreateDoctorFormSchemaType>({
    resolver: zodResolver(createDoctorFormSchema),
    defaultValues: {
      userId: "",
      license_number: "",
      specialization: "",
      phone: "",
      address: "",
    },
  });

  const AIDoctorForm = useForm<TCreateAIDoctorFormSchema>({
    resolver: zodResolver(createAIDoctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      description: "",
      agentPrompt: "",
      voiceId: "",
      img: "",
    },
  });

  const {
    formState: { isSubmitting: isHumanDOctorFormSubmitting },
  } = HumanDoctorForm;

  const {
    formState: { isSubmitting: isAIDoctorFormSubmitting },
  } = AIDoctorForm;

  async function onHumanDoctorSubmit(values: CreateDoctorFormSchemaType) {
    if (session?.data?.user?.role !== adminRole) {
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

  async function onAIDoctorSubmit(values: TCreateAIDoctorFormSchema) {
    if (session?.data?.user?.role !== adminRole) {
      toast("unauthorized.");
      return;
    }

    try {
      await createAIDoctor(values);
      toast.success("AI Doctor created successfully!");
      router.refresh();
      handleCloseModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong!", {
        richColors: true,
      });
    }
  }

  function handleCloseModal() {
    HumanDoctorForm.reset();
    AIDoctorForm.reset();
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
        <Tabs>
          <TabsList defaultValue="human-doctor">
            <TabsTrigger
              value="human-doctor"
              className="cursor-pointer"
              onClick={() => AIDoctorForm.reset()}
            >
              Human Doctor
            </TabsTrigger>
            <TabsTrigger
              value="ai-doctor"
              className="cursor-pointer"
              onClick={() => HumanDoctorForm.reset()}
            >
              AI Doctor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="human-doctor">
            <div className="mt-4">
              <Form {...HumanDoctorForm}>
                <form
                  onSubmit={HumanDoctorForm.handleSubmit(onHumanDoctorSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <CustomInput
                      type="select"
                      name="userId"
                      label="User"
                      placeholder={
                        userData.length === 0
                          ? "No user to select"
                          : "Pick a user"
                      }
                      control={HumanDoctorForm.control}
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
                      control={HumanDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                    <CustomInput
                      type="input"
                      name="specialization"
                      label="Specialization"
                      placeholder="Enter specialization"
                      control={HumanDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                    <CustomInput
                      type="input"
                      name="phone"
                      label="Phone"
                      placeholder="Enter phone number"
                      control={HumanDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                    <CustomInput
                      type="textarea"
                      name="address"
                      label="Address"
                      placeholder="Enter address"
                      control={HumanDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isHumanDOctorFormSubmitting || Boolean(error)}
                  >
                    {isHumanDOctorFormSubmitting ? (
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
          </TabsContent>
          <TabsContent value="ai-doctor">
            <div className="mt-4">
              <Form {...AIDoctorForm}>
                <form
                  onSubmit={AIDoctorForm.handleSubmit(onAIDoctorSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <CustomInput
                      type="input"
                      name="name"
                      label="Name"
                      placeholder="Enter a name"
                      control={AIDoctorForm.control}
                      className="w-full"
                      disable={
                        isLoading ||
                        Boolean(error) ||
                        Boolean(userData.length === 0)
                      }
                    />
                    <CustomInput
                      type="input"
                      name="specialization"
                      label="Specialization"
                      placeholder="Enter specialization"
                      control={AIDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                    <CustomInput
                      type="textarea"
                      name="description"
                      label="Description"
                      placeholder="AI Doctor description"
                      control={AIDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                    <CustomInput
                      type="textarea"
                      name="agentPrompt"
                      label="Agent Prompt"
                      placeholder="AI Doctor prompt"
                      control={AIDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                    <CustomInput
                      type="input"
                      name="voiceId"
                      label="Voice Id"
                      placeholder="Enter agent voice id"
                      control={AIDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                    <CustomInput
                      type="input"
                      name="img"
                      label="Image Path"
                      placeholder="Enter image path"
                      control={AIDoctorForm.control}
                      disable={isLoading || Boolean(error)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isAIDoctorFormSubmitting || Boolean(error)}
                  >
                    {isAIDoctorFormSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="animate-spin">⌛</span>
                        Creating...
                      </div>
                    ) : (
                      "Create AI Doctor"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
