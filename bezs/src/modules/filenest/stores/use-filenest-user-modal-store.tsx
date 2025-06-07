import { create } from "zustand";

export type ModalType = "previewFile" | "deleteFile" | "editFile";

type FileDataType = {
  id: string | number;
  fileId: string | number;
  fileName: string;
  fileSize: string;
  fileType: string;
};

interface FileNestAdminStore {
  type: ModalType | null;
  isOpen: boolean;
  id?: number | string;
  fileData?: FileDataType | null;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    id?: number | string;
    fileData?: FileDataType | null;
  }) => void;
  onClose: () => void;
}

export const useFileNestUserModal = create<FileNestAdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  onOpen: ({ type, id = "", fileData = null }) =>
    set({
      isOpen: true,
      type,
      id,
      fileData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      id: "",
      fileData: null,
    }),
}));
