"use client";

import { Patient } from "../../../../prisma/generated/telemedicine";
import { User } from "../../../../prisma/generated/main";
import { PatientFormSchema } from "../schemas/patient-form-schema";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CustomInput } from "./custom-input";
import { MARITAL_STATUS, RELATION, GENDER } from "../datas";
import { Form } from "@/components/ui/form";
import {
  createPatientProfile,
  updatePatientProfile,
} from "../serveractions/patient/patient-profile-actions";
import { toast } from "sonner";

interface DataProps {
  data?: Patient;
  type: "create" | "update";
  user?: User;
}

export const PatientProfile = ({ data, type, user }: DataProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userData = {
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  };

  const form = useForm<z.infer<typeof PatientFormSchema>>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      ...userData,
      address: "",
      date_of_birth: new Date(),
      gender: "MALE",
      marital_status: "single",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "mother",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      insurance_number: "",
      insurance_provider: "",
      medical_history: "",
    },
  });

  useEffect(() => {
    if (type === "create") {
      if (userData) {
        form.reset({ ...userData });
      }
    } else if (type === "update") {
      if (data) {
        const formattedDateOfBirth = new Date(data.date_of_birth)
          .toISOString()
          .split("T")[0];

        form.reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          date_of_birth: formattedDateOfBirth,
          gender: data.gender,
          marital_status: data.marital_status as
            | "married"
            | "single"
            | "divorced"
            | "widowed"
            | "separated",
          address: data.address,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_number: data.emergency_contact_number,
          relation: data.relation as
            | "mother"
            | "father"
            | "husband"
            | "wife"
            | "other",
          blood_group: data?.blood_group || "",
          allergies: data?.allergies || "",
          medical_conditions: data?.medical_conditions || "",
          medical_history: data?.medical_history || "",
          insurance_number: data.insurance_number || "",
          insurance_provider: data.insurance_provider || "",
          medical_consent: data.medical_consent,
          privacy_consent: data.privacy_consent,
          service_consent: data.service_consent,
        });
      }
    }
  }, [type, data]);

  const onSubmit = async (values: z.infer<typeof PatientFormSchema>) => {
    try {
      setIsLoading(true);

      if (type === "create") {
        await createPatientProfile(values);
        toast.success("Profile created successfully", {
          richColors: true,
        });
      } else if (type === "update") {
        await updatePatientProfile(values);
        toast.success("Profile updated successfully", {
          richColors: true,
        });
      }
      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message,
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle>Patient Profile</CardTitle>
        <CardDescription>
          Please provide all the information below to help us understand better
          and provide good and quality service to you.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-5"
          >
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <>
              {/* PROFILE IMAGE */}

              {/* <ImageUploader
          
              /> */}

              <CustomInput
                type="input"
                control={form.control}
                name="name"
                placeholder="Doe"
                label="Name"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="email"
                placeholder="john@example.com"
                label="Email Address"
              />
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="select"
                  control={form.control}
                  name="gender"
                  placeholder="Select gender"
                  label="Gender"
                  selectList={GENDER!}
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="date_of_birth"
                  placeholder="01-05-2000"
                  label="Date of Birth"
                  inputType="date"
                />
              </div>
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="phone"
                  placeholder="9225600735"
                  label="Contact Number"
                />
                <CustomInput
                  type="select"
                  control={form.control}
                  name="marital_status"
                  placeholder="Select marital status"
                  label="Marital Status"
                  selectList={MARITAL_STATUS!}
                />
              </div>
              <CustomInput
                type="textarea"
                control={form.control}
                name="address"
                placeholder="1479 Street, Apt 1839-G, NY"
                label="Address"
              />
            </>

            <hr />

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Family Information</h3>
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_name"
                placeholder="Anne Smith"
                label="Emergency contact name"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_number"
                placeholder="675444467"
                label="Emergency contact"
              />
              <CustomInput
                type="select"
                control={form.control}
                name="relation"
                placeholder="Select relation with contact person"
                label="Relation"
                selectList={RELATION}
              />
            </div>

            <hr />

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Medical Information</h3>

              <CustomInput
                type="input"
                control={form.control}
                name="blood_group"
                placeholder="A+"
                label="Blood group"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="allergies"
                placeholder="Milk"
                label="Allergies"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_conditions"
                placeholder="Medical conditions"
                label="Medical conditions"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_history"
                placeholder="Medical history"
                label="Medical history"
              />
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="insurance_provider"
                  placeholder="Insurance provider"
                  label="Insurance provider"
                />{" "}
                <CustomInput
                  type="input"
                  control={form.control}
                  name="insurance_number"
                  placeholder="Insurance number"
                  label="Insurance number"
                />
              </div>
            </div>

            {type !== "update" && (
              <div className="">
                <h3 className="text-lg font-semibold mb-2">Consent</h3>

                <div className="space-y-6">
                  <CustomInput
                    name="privacy_consent"
                    label=" Privacy Policy Agreement"
                    placeholder=" I consent to the collection, storage, and use of my
                    personal and health information as outlined in the Privacy
                    Policy. I understand how my data will be used, who it may
                    be shared with, and my rights regarding access,
                    correction, and deletion of my data."
                    type="checkbox"
                    control={form.control}
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="service_consent"
                    label=" Terms of Service Agreement"
                    placeholder=" I agree to the Terms of Service, including my
                    responsibilities as a user of this healthcare management
                    system, the limitations of liability, and the dispute
                    resolution process. I understand that continued use of
                    this service is contingent upon my adherence to these
                    terms."
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="medical_consent"
                    label="Informed Consent for Medical Treatment"
                    placeholder="I provide informed consent to receive medical treatment
                    and services through this healthcare management system. I
                    acknowledge that I have been informed of the nature,
                    risks, benefits, and alternatives to the proposed
                    treatments and that I have the right to ask questions and
                    receive further information before proceeding."
                  />
                </div>
              </div>
            )}

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full md:w-fit px-6"
            >
              {type === "create" ? "Submit" : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
