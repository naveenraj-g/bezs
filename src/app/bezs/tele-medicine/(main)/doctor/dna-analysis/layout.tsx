import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { DNAanalysisModalProvider } from "@/modules/telemedicine/providers/dna-analysis-modal-provider";
import { redirect } from "next/navigation";

const DnaAnalysisLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) redirect("/");

  return (
    <>
      <DNAanalysisModalProvider />
      {children}
    </>
  );
};

export default DnaAnalysisLayout;
