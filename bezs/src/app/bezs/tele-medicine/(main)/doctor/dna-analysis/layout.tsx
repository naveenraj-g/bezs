import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const DnaAnalysisLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) redirect("/");

  return <>{children}</>;
};

export default DnaAnalysisLayout;
