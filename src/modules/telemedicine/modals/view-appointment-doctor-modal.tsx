"use client";

import { useTelemedicineDoctorModal } from "../stores/use-telemedicine-doctor-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalAppointmentDetails } from "../ui/doctor/modal-appointment-details";

export const ViewAppointmentDoctorModal = () => {
  const closeModal = useTelemedicineDoctorModal((state) => state.onClose);
  const appointmentData = useTelemedicineDoctorModal(
    (state) => state.appointmentData
  );
  const modalType = useTelemedicineDoctorModal((state) => state.type);
  const isOpen = useTelemedicineDoctorModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "viewAppointment";

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        {appointmentData ? (
          <ModalAppointmentDetails
            appointmentData={appointmentData}
            needAppointmentTitle={false}
          />
        ) : (
          <p>Details for this appointment are not yet available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
