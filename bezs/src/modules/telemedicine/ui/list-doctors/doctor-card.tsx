import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type Doctor = {
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

type TDoctorCard = {
  doctor?: Doctor;
};

export const DoctorCard = ({ doctor }: TDoctorCard) => {
  return (
    <Card className="block p-0 overflow-hidden">
      <Image
        src={doctor?.img || "/stock-doctor-image.jpeg"}
        alt={doctor?.specialization || ""}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover"
      />
      <div className="px-2 pb-2">
        <h2 className="font-bold text-lg mt-1 capitalize">{doctor?.name}</h2>
        <h2 className="text-xs text-zinc-500 dark:text-zinc-300/90">
          {doctor?.specialization}
        </h2>
        <p className="line-clamp-2 mt-1 text-sm text-zinc-500 dark:text-zinc-300/90">
          {doctor?.description}
        </p>
        <Button size="sm" className="w-full mt-2">
          Start Consultation <ArrowRight />
        </Button>
      </div>
    </Card>
  );
};
