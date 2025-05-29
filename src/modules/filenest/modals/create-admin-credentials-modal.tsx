"use client";

import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomInput } from "@/shared/ui/custom-input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFileNestAdminModal } from "../stores/use-filenest-admin-modal-store";
import { useEffect, useState } from "react";
import { getAllOrganizations } from "@/shared/server-actions/getAllOrganizations";

type OrgDataType = {
  name: string;
  id: string;
  createdAt: Date;
};

export const CreateAdminCredentialsModal = () => {
  const session = useSession();

  const closeModal = useFileNestAdminModal((state) => state.onClose);
  const modalType = useFileNestAdminModal((state) => state.type);
  const isOpen = useFileNestAdminModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "createCredentials";

  const [allOrgData, setAllOrgData] = useState<OrgDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        try {
          setError(null);
          setIsLoading(true);
          const orgData = await getAllOrganizations();
          setAllOrgData(orgData);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          setIsLoading(false);
          setError("Failed to get data.");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [isModalOpen]);

  return <p>{allOrgData[0]?.name}</p>;
};
