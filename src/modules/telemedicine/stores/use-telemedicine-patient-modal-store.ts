import { create } from "zustand";
import { AppointmentTableDataType } from "../types/data-types";

export type ModalType =
  | "bookAppointment"
  | "viewAppointment"
  | "viewAppointmentReport";

interface TelemedicinePatientStore {
  type: ModalType | null;
  isOpen: boolean;
  appointmentData?: AppointmentTableDataType | null;
  appointmentId?: number | string;
  mainUserId?: string;
  appointmentReport?: any;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    appointmentId?: number | string;
    mainUserId?: string;
    appointmentReport?: any;
    appointmentData?: AppointmentTableDataType | null;
  }) => void;
  onClose: () => void;
}

export const useTelemedicinePatientModal = create<TelemedicinePatientStore>(
  (set) => ({
    type: null,
    isOpen: false,
    trigger: 0,
    incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
    onOpen: ({
      type,
      appointmentId = "",
      mainUserId = "",
      appointmentReport = null,
      appointmentData = null,
    }) =>
      set({
        isOpen: true,
        type,
        appointmentId,
        mainUserId,
        appointmentReport,
        appointmentData,
      }),
    onClose: () =>
      set({
        type: null,
        isOpen: false,
        appointmentId: "",
        mainUserId: "",
        appointmentReport: null,
        appointmentData: null,
      }),
  })
);
