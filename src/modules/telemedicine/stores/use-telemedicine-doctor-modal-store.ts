import { create } from "zustand";
import { DoctorAppointmentTableDataType } from "../types/data-types";

export type ModalType =
  | "confirmAppointment"
  | "rescheduleAppointment"
  | "cancelAppointment"
  | "viewAppointment";

interface TelemedicineDoctorStore {
  type: ModalType | null;
  isOpen: boolean;
  appointmentId?: number | string;
  appointmentData?: DoctorAppointmentTableDataType | null;
  patientId?: string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    appointmentId?: number | string;
    patientId?: string;
    appointmentData?: DoctorAppointmentTableDataType | null;
  }) => void;
  onClose: () => void;
}

export const useTelemedicineDoctorModal = create<TelemedicineDoctorStore>(
  (set) => ({
    type: null,
    isOpen: false,
    trigger: 0,
    incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
    onOpen: ({
      type,
      appointmentId = "",
      patientId = "",
      appointmentData = null,
    }) =>
      set({
        isOpen: true,
        type,
        appointmentId,
        patientId,
        appointmentData,
      }),
    onClose: () =>
      set({
        type: null,
        isOpen: false,
        appointmentId: "",
        patientId: "",
        appointmentData: null,
      }),
  })
);
