import { create } from "zustand";

export type ModalType =
  | "confirmAppointment"
  | "rescheduleAppointment"
  | "cancelAppointment";

interface TelemedicineDoctorStore {
  type: ModalType | null;
  isOpen: boolean;
  appointmentId?: number | string;
  patientId?: string;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    appointmentId?: number | string;
    patientId?: string;
  }) => void;
  onClose: () => void;
}

export const useTelemedicineDoctorModal = create<TelemedicineDoctorStore>(
  (set) => ({
    type: null,
    isOpen: false,
    trigger: 0,
    incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
    onOpen: ({ type, appointmentId = "", patientId = "" }) =>
      set({
        isOpen: true,
        type,
        appointmentId,
        patientId,
      }),
    onClose: () =>
      set({
        type: null,
        isOpen: false,
        appointmentId: "",
        patientId: "",
      }),
  })
);
