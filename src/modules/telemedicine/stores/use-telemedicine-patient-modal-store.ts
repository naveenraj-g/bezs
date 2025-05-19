import { create } from "zustand";

export type ModalType = "bookAppointment" | "viewAppointment";

interface TelemedicinePatientStore {
  type: ModalType | null;
  isOpen: boolean;
  appointmentId?: number | string;
  mainUserId?: string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    appointmentId?: number | string;
    mainUserId?: string;
  }) => void;
  onClose: () => void;
}

export const useTelemedicinePatientModal = create<TelemedicinePatientStore>(
  (set) => ({
    type: null,
    isOpen: false,
    trigger: 0,
    incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
    onOpen: ({ type, appointmentId = "", mainUserId = "" }) =>
      set({
        isOpen: true,
        type,
        appointmentId,
        mainUserId,
      }),
    onClose: () =>
      set({
        type: null,
        isOpen: false,
        appointmentId: "",
        mainUserId: "",
      }),
  })
);
