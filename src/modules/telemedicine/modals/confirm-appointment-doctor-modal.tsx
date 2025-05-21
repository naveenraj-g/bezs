import { useSession } from "@/modules/auth/services/better-auth/auth-client";
import { useRouter } from "next/navigation";
import { useTelemedicineDoctorModal } from "../stores/use-telemedicine-doctor-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { confirmPatientAppointment } from "../serveractions/doctor/appointment-actions";

export const ConfirmAppointmentDoctorModal = () => {
  const session = useSession();
  const router = useRouter();

  const closeModal = useTelemedicineDoctorModal((state) => state.onClose);
  const appointmentId =
    useTelemedicineDoctorModal((state) => state.appointmentId) || "";
  const modalType = useTelemedicineDoctorModal((state) => state.type);
  const isOpen = useTelemedicineDoctorModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "confirmAppointment";

  async function handleConfirmAppointment() {
    if (!session) {
      return;
    }

    try {
      await confirmPatientAppointment(appointmentId);
      toast("Appointment Confirmed.");
      router.refresh();
      handleCloseModal();
    } catch (err) {
      toast("Error", {
        description: (err as Error)?.message,
      });
    }
  }

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Appointment</DialogTitle>
          <DialogDescription>
            Are you sure to confirm this appointment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-4">
            <Button size="sm" onClick={handleConfirmAppointment}>
              Confirm
            </Button>
            <Button size="sm" onClick={() => handleCloseModal()}>
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
