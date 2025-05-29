import { CloudStorageType } from "../../../../../prisma/generated/filenest";

export type CredentialDataType = {
  name: string;
  id: string;
  organizationId: string;
  type: CloudStorageType;
  organizationName: string;
  bucketName: string;
  region: string;
  accessKey: string;
  secureAccessKey: string;
  maxFileSize: bigint;
  createdAt: Date;
  updatedAt: Date;
};

export interface AdminCredentialsTableDataType {
  data: CredentialDataType[];
  total: number;
}
