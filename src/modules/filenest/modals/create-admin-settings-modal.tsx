import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { useFileNestAdminModal } from "../stores/use-filenest-admin-modal-store";
import { useServerAction } from "zsa-react";
import {
  createAdminSettings,
  getAllAppsAndCredentialsData,
} from "../serveractions/admin/settings/server-actions";
import { z } from "zod";
import { adminCreateSettingsModalSchema } from "../schema/admin-settings-modal-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StorageType } from "../../../../prisma/generated/filenest";
import { useEffect, useState } from "react";
import { allAppsAndCredentialsData } from "../types/data-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { CustomInput } from "@/shared/ui/custom-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type CreateSettingsFormSchemaType = z.infer<
  typeof adminCreateSettingsModalSchema
>;

export const CreateAdminSettingsModal = () => {
  const session = useSession();

  const closeModal = useFileNestAdminModal((state) => state.onClose);
  const modalType = useFileNestAdminModal((state) => state.type);
  const isOpen = useFileNestAdminModal((state) => state.isOpen);
  const triggerRefetch = useFileNestAdminModal(
    (state) => state.incrementTrigger
  );

  const isModalOpen = isOpen && modalType === "createSettings";

  const [data, setData] = useState<allAppsAndCredentialsData>({
    allAppsData: [],
    allCredentialsData: [],
  });

  const {
    execute: getAllAppsDataExecute,
    isPending: getAllAppsDataPending,
    error: getAllAppsDataError,
    isError: getAllAppsDataisError,
    reset: getAllAppsDataReset,
  } = useServerAction(getAllAppsAndCredentialsData);

  const {
    execute: createAdminSettingsExecute,
    isPending: createAdminSettingsPending,
    reset: createAdminSettingsReset,
  } = useServerAction(createAdminSettings, {
    onSuccess({ data: { message } }) {
      toast.success(message || "Success!");
      triggerRefetch();
      handleCloseModal();
    },
    onError({ err: { message } }) {
      toast.error("Error!", {
        description: message,
      });
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        const [data] = await getAllAppsDataExecute();
        setData((prevState) => {
          return {
            ...prevState,
            allAppsData: data?.appsData || [],
            allCredentialsData: data?.credentialsData || [],
          };
        });
      })();
    }
  }, [isModalOpen, getAllAppsDataExecute]);

  const form = useForm<CreateSettingsFormSchemaType>({
    resolver: zodResolver(adminCreateSettingsModalSchema),
    defaultValues: {
      appId: "",
      basePath: "",
      credentialId: undefined,
      maxFileSize: 0,
      subFolder: "",
      type: StorageType.LOCAL,
    },
  });

  const type = form.watch("type");

  async function onSubmit(values: CreateSettingsFormSchemaType) {
    if (!session) {
      toast("unauthorized.");
      return;
    }

    const appData = data.allAppsData.find((data) => data.id === values.appId);

    const newValues = {
      ...values,
      appName: appData?.name ?? "",
      appSlug: appData?.slug ?? "",
      orgId: appData?.appOrganization[0].organizationId ?? "",
      orgName: appData?.appOrganization[0].organization.name ?? "",
      maxFileSize: values.maxFileSize * 1024 * 1024,
    };

    await createAdminSettingsExecute(newValues);
  }

  function handleCloseModal() {
    form.reset();
    getAllAppsDataReset();
    createAdminSettingsReset();
    setData({
      allAppsData: [],
      allCredentialsData: [],
    });
    closeModal();
  }

  const appSelectList = data.allAppsData.map((appData) => ({
    label: appData.name,
    value: appData.id,
  }));
  const typeSelectList = Object.values(StorageType).map((type) => ({
    label: type,
    value: type,
  }));
  const credentialSelectList = data.allCredentialsData.map(
    (credentialData) => ({
      label: (
        <div>
          {credentialData.name} ({credentialData.bucketName})
        </div>
      ),
      value: credentialData.id,
    })
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            Create Setting
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="xs:flex xs:gap-2 items-start space-y-3 xs:space-y-0">
                  <CustomInput
                    type="select"
                    name="appId"
                    label={
                      <>
                        App Name
                        {getAllAppsDataPending && (
                          <Loader2 className="animate-spin w-3 h-3" />
                        )}
                      </>
                    }
                    placeholder="Select a app"
                    control={form.control}
                    selectList={appSelectList}
                    className="flex-1 w-full"
                    disable={getAllAppsDataPending}
                  />
                  <CustomInput
                    type="select"
                    name="type"
                    label="Storage Type"
                    placeholder="Select a type"
                    control={form.control}
                    selectList={typeSelectList}
                    className="w-full flex-1"
                  />
                </div>
                {type === "CLOUD" && (
                  <>
                    <CustomInput
                      type="select"
                      name="credentialId"
                      label="Credential Name"
                      placeholder={
                        data.allCredentialsData.length
                          ? "Select a credential"
                          : "credential datas not available or create one"
                      }
                      control={form.control}
                      selectList={credentialSelectList}
                      className="w-full flex-1"
                    />
                  </>
                )}
                <CustomInput
                  type="input"
                  name="basePath"
                  label="Base Path"
                  placeholder="Enter base path"
                  control={form.control}
                />
                <CustomInput
                  type="input"
                  name="subFolder"
                  label="Sub Folder"
                  placeholder="Enter sub folder"
                  control={form.control}
                />
                <CustomInput
                  type="input"
                  inputType="number"
                  name="maxFileSize"
                  label="Max File Size (MB)"
                  placeholder="Enter size (500)"
                  control={form.control}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={getAllAppsDataPending}
              >
                {createAdminSettingsPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Setting"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
