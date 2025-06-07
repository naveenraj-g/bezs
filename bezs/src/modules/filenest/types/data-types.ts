import { CloudStorageCredential } from "../../../../prisma/generated/filenest";
import { App } from "../../../../prisma/generated/main";

type AllAppsDataType = App & {
  appOrganization: {
    organization: {
      name: string;
      id: string;
      slug: string | null;
    };
    organizationId: string;
  }[];
};

export type allAppsAndCredentialsData = {
  allAppsData: AllAppsDataType[];
  allCredentialsData: CloudStorageCredential[];
};
