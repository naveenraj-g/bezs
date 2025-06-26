"use client";

import Vapi from "@vapi-ai/web";
import { Circle, Loader2, PhoneCall, PhoneOff } from "lucide-react";
import { TAppointmentData } from "../../types/online-consult-types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getconsultationReport } from "../../serveractions/appointment/ai-doctor/ai-doctor-server-actions";
import { useRouter } from "next/navigation";
// 2:40
type TMessage = {
  role: string;
  text: string;
};

export const AiDoctorConsult = ({
  appointmentData,
}: {
  appointmentData: TAppointmentData | null;
}) => {
  const router = useRouter();

  const [callStarted, setcallStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  const startCall = () => {
    if (
      !appointmentData?.doctor.voiceId ||
      !appointmentData?.doctor.agentPrompt
    ) {
      toast.error("Missing doctor voice or prompt");
      setIsConnecting(false);
      return;
    }

    setMessages([]);
    setIsConnecting(true);

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const vapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hello, Thank you for connecting, Can you please tell your ful name and age",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: appointmentData?.doctor.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: appointmentData?.doctor.agentPrompt,
          },
        ],
      },
    };

    // @ts-expect-error
    vapi.start(vapiAgentConfig);

    vapi.on("call-start", () => {
      setcallStarted(true);
      setIsConnecting(false);
    });
    vapi.on("call-end", () => {
      setcallStarted(false);
      setIsConnecting(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;

        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Final Transcript
          setMessages((prevState) => [
            ...prevState,
            { role: role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });
    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });
    vapi.on("error", (error) => {
      console.log(JSON.stringify(error));
      toast.error("Error", {
        description: JSON.stringify(error),
        richColors: true,
      });
    });
  };

  const endCall = async () => {
    if (vapiInstance) {
      setLoading(true);
      vapiInstance.stop();

      vapiInstance.off("call-start", () => {});
      vapiInstance.off("call-end", () => {});
      vapiInstance.off("message", () => {});

      setcallStarted(false);
      setVapiInstance(null);

      await generateReport();
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      await getconsultationReport({ messages, appointmentData });
      toast("Consult Finished!", {
        description: "You can see yout report in appointments table.",
      });
      router.push("/bezs/tele-medicine/patient/appointments");
    } catch (e) {
      toast.error("Error!", {
        description: (e as Error).message,
        richColors: true,
      });
    }
  };

  return (
    <div className="p-8 border rounded-2xl bg-secondary/10">
      <div className="flex items-center justify-between gap-2">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`}
          />{" "}
          {callStarted ? "Connected" : "Not Connected"}
        </h2>
        {/* <h2 className="font-bold text-xl text-gray-400 dark:text-gray-300/90">
          00:00
        </h2> */}
      </div>

      <div className="flex items-center flex-col mt-10">
        <Image
          src={appointmentData?.doctor.img || ""}
          alt={appointmentData?.doctor.specialization || ""}
          width={120}
          height={120}
          className="h-[100px] w-[100px] object-cover rounded-full"
        />
        <h2 className="mt-2 text-lg capitalize">
          {appointmentData?.doctor.name}
        </h2>
        <p className="text-sm">({appointmentData?.doctor.specialization})</p>
        <p className="text-sm text-gray-400">AI Doctor Voice Agent</p>

        <div className="mt-10 max-h-[300px] overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <h2 className="text-gray-500 dark:text-gray-200/80" key={index}>
              <span className="font-semibold text-gray-700 dark:text-white capitalize">
                {msg.role === "assistant"
                  ? appointmentData?.doctor.name + " (AI Doctor)"
                  : appointmentData?.patient.name + " (You)"}
              </span>
              : {msg.text}
            </h2>
          ))}
          {liveTranscript && (
            <h2 className="text-lg">
              <span className="font-semibold text-gray-700 dark:text-white capitalize">
                {currentRole === "assistant"
                  ? appointmentData?.doctor.name + " (AI Doctor)"
                  : appointmentData?.patient.name + " (You)"}
              </span>{" "}
              : {liveTranscript}
            </h2>
          )}
          <div ref={messageEndRef} />
        </div>

        {!callStarted ? (
          <Button
            className="mt-10"
            size="sm"
            onClick={startCall}
            disabled={isConnecting || loading}
          >
            {isConnecting ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Connecting...
              </>
            ) : (
              <>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating
                    report...
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" /> Start Call{" "}
                  </>
                )}
              </>
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="destructive"
            className="mt-10"
            onClick={endCall || loading}
          >
            <PhoneOff /> Disconnect
          </Button>
        )}
      </div>
    </div>
  );
};
