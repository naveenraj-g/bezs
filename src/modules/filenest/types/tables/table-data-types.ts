import { CloudStorageType } from "../../../../../prisma/generated/filenest";

export type CredentialDataType = {
  name: string;
  id: string;
  type: CloudStorageType;
  bucketName: string;
  region: string;
  clientId: string;
  clientSecret: string;
  maxFileSize: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface AdminCredentialsTableDataType {
  data: CredentialDataType[];
  total: number;
}
