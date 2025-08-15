"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTelemedicinePatientModal } from "../stores/use-telemedicine-patient-modal-store";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";

export const ViewAppointmentReportPatientModal = () => {
  const closeModal = useTelemedicinePatientModal((state) => state.onClose);
  const appointmentData = useTelemedicinePatientModal(
    (state) => state.appointmentData
  );
  const modalType = useTelemedicinePatientModal((state) => state.type);
  const isOpen = useTelemedicinePatientModal((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "viewAppointmentReport";

  function handleCloseModal() {
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Generated Report
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          {appointmentData ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-bold text-lg">Appointment Info</h2>
                <div className="h-0.5 w-full bg-gray-500 -mt-1"></div>
                <div className="grid grid-cols-2 gap-2">
                  <h2 className="capitalize">
                    <span className="font-bold">Doctor Name:</span>{" "}
                    {appointmentData.doctor.name}{" "}
                    {appointmentData.doctor.doctorType === "AI_DOCTOR" &&
                      "(AI Assistant)"}
                  </h2>
                  <h2>
                    <span className="font-bold">Doctor Specialization:</span>{" "}
                    {appointmentData.doctor.specialization}
                  </h2>
                  <h2>
                    <span className="font-bold">Consulted Date:</span>{" "}
                    {format(appointmentData.appointment_date, "MMM dd, yyy")}
                  </h2>
                  <h2 className="capitalize">
                    <span className="font-bold">Patient Name</span>{" "}
                    {appointmentData.patient.name}
                  </h2>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-bold text-lg">Chief Complaint</h2>
                <div className="h-0.5 w-full bg-gray-500 -mt-1"></div>
                <div>
                  <h2>{appointmentData.report?.chiefComplaint || "Unknown"}</h2>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-bold text-lg">Summary</h2>
                <div className="h-0.5 w-full bg-gray-500 -mt-1"></div>
                <div>
                  <h2 className="capitalize text-justify">
                    {appointmentData.report?.summary || "Unknown"}
                  </h2>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-bold text-lg">Symptoms</h2>
                <div className="h-0.5 w-full bg-gray-500 -mt-1"></div>
                {appointmentData.report.symptoms.length > 0 ? (
                  <ul>
                    {appointmentData.report?.symptoms.map(
                      (symptom: string, index: number) => (
                        <li key={index} className="list-disc ml-4 capitalize">
                          {symptom}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <h2>No Symptoms recorded.</h2>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="font-bold text-lg">Duration & Severity</h2>
                <div className="h-0.5 w-full bg-gray-500 -mt-1"></div>
                <div className="grid grid-cols-2 gap-2">
                  <h2>
                    <span className="font-bold">Duration:</span>{" "}
                    {appointmentData.report?.duration || "Not specified"}
                  </h2>
                  <h2 className="capitalize">
                    <span className="font-bold">Severity</span>{" "}
                    {appointmentData.report?.severity || "Not specified"}
                  </h2>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-bold text-lg">Medications Mentioned</h2>
                <div className="h-0.5 w-full bg-gray-500 -mt-1"></div>
                {appointmentData.report.medicationsMentioned.length > 0 ? (
                  <ul>
                    {appointmentData.report?.medicationsMentioned.map(
                      (medication: string, index: number) => (
                        <li key={index} className="list-disc ml-4 capitalize">
                          {medication}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <h2>No medications recorded.</h2>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="font-bold text-lg">Recommendations</h2>
                <div className="h-0.5 w-full bg-gray-500 -mt-1"></div>
                {appointmentData.report.recommendations.length > 0 ? (
                  <ul>
                    {appointmentData.report?.recommendations.map(
                      (recommendation: string, index: number) => (
                        <li key={index} className="list-disc ml-4 capitalize">
                          {recommendation}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <h2>No recommendations recorded.</h2>
                )}
              </div>

              {appointmentData.doctor.doctorType === "AI_DOCTOR" ? (
                <>
                  <div className="h-0.5 w-full bg-gray-200"></div>
                  <h2 className="text-center flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    This report was generated by an AI Doctor Assistant, only
                    for informational purposes.
                  </h2>
                </>
              ) : null}
            </div>
          ) : (
            <p>Sorry!, Report for this appointment are generated.</p>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
