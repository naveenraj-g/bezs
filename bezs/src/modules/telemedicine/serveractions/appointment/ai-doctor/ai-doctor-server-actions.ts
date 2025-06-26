"use server";

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { openai } from "../../openAIModel";
import { TAppointmentData } from "@/modules/telemedicine/types/online-consult-types";
import { prismaTeleMedicine } from "@/lib/prisma";

type TDoctor = {
  id: number | string;
  name?: string;
  specialization: string;
  description?: string | null;
  img: string | null;
  agentPrompt?: string;
  voiceId?: string;
  ratings?: {
    rating: number;
  }[];
};

type TProps = {
  notes: string;
  AiDoctorsList: TDoctor | undefined;
};

export const getDoctorSuggestion = async ({ notes, AiDoctorsList }: TProps) => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized!");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        { role: "system", content: JSON.stringify(AiDoctorsList) },
        {
          role: "user",
          content:
            "User Notes/Symptoms:" +
            notes +
            ", Depends on user notes and symptoms, Please suggest suitable list of doctors, return only the doctor id in JSON Only",
        },
      ],
    });

    const rawResponse = completion.choices[0].message;
    const res = rawResponse.content
      ?.trim()
      .replace("```json", "")
      .replace("```", "");
    if (!res) {
      throw new Error("No response content to parse");
    }
    return JSON.parse(res);
  } catch (e) {
    throw new Error(String(e));
  }
};

type TMessage = {
  role: string;
  text: string;
};

const REPORT_GEN_PROMPT = `
You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor info, doctor type is in doctor type it says whether it is AI Doctor or Human Doctor and Conversations between doctor and user, generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
{
 "sessionId": "string",
 "agent": "string",
 "user": "string",
 "timestamp": "ISO Date string",
 "chiefComplaint": "string",
 "summary": "string",
 "symptoms": ["symptom1", "symptom2"],
 "duration": "string",
 "severity": "string",
 "medicationsMentioned": ["med1", "med2"],
 "recommendations": ["rec1", "rec2"],
}
Only include valid fields. Respond with nothing else.
`;

export const getconsultationReport = async ({
  messages,
  appointmentData,
}: {
  messages: TMessage[];
  appointmentData: TAppointmentData | null;
}) => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized!");
  }

  try {
    const userInput =
      "Doctor Info:" +
      JSON.stringify(appointmentData?.doctor) +
      ", Conversation:" +
      JSON.stringify(messages);
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    const rawResponse = completion.choices[0].message;
    const res = rawResponse.content
      ?.trim()
      .replace("```json", "")
      .replace("```", "");
    if (!res) {
      throw new Error("No response content to parse");
    }

    await prismaTeleMedicine.appointment.update({
      where: {
        id: appointmentData?.id,
        patient: {
          userId: session.user.id,
        },
      },
      data: {
        report: JSON.parse(res),
        conversation: messages,
        status: "COMPLETED",
      },
    });

    return JSON.parse(res);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw new Error("An error occured while generating report.");
  }
};
