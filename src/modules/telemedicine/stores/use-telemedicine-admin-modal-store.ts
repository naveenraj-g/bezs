import { create } from "zustand";

export type ModalType = "createDoctor" | "editDoctor";

interface TelemedicineAdminStore {
  type: ModalType | null;
  isOpen: boolean;
  appointmentId?: number | string;
  doctorId?: string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    appointmentId?: number | string;
    doctorId?: string;
  }) => void;
  onClose: () => void;
}

export const useTelemedicineAdminModal = create<TelemedicineAdminStore>(
  (set) => ({
    type: null,
    isOpen: false,
    trigger: 0,
    incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
    onOpen: ({ type, appointmentId = "", doctorId = "" }) =>
      set({
        isOpen: true,
        type,
        appointmentId,
        doctorId,
      }),
    onClose: () =>
      set({
        type: null,
        isOpen: false,
        appointmentId: "",
        doctorId: "",
      }),
  })
);
