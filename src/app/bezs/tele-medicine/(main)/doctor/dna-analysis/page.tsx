import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { DnaAnalysis } from "@/modules/telemedicine/ui/dna-analysis/dna-analysis";
import { redirect } from "next/navigation";
import React from "react";

const DnaAnalysisPage = async () => {
  const session = await getServerSession();

  if (!session) redirect("/");

  return (
    <>
      <DnaAnalysis />
    </>
  );
};

export default DnaAnalysisPage;
