import {
  CloudStorageType,
  AppStorageSetting,
} from "../../../../../prisma/generated/filenest";

export type CredentialDataType = {
  name: string;
  id: string;
  type: CloudStorageType;
  bucketName: string;
  region: string;
  clientId: string;
  clientSecret: string;
  maxFileSize: bigint;
  createdAt: Date;
  updatedAt: Date;
};

export interface AdminCredentialsTableDataType {
  data: CredentialDataType[];
  total: number;
}

export type SettingsDataType = AppStorageSetting & {
  credential: { id: string; name: string; bucketName: string };
};

export interface AdminSettingsTableDataType {
  data: SettingsDataType[];
  total: number;
}
