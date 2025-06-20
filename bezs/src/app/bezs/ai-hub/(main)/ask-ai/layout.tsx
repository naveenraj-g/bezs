import { StoreInitializerProvider } from "@/modules/ai-hub/providers/store-initializer-provider";
import { Topbar } from "@/modules/ai-hub/ui/topbar";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const AiHubAskAiLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <StoreInitializerProvider />
      <Topbar />
      {children}
    </div>
  );
};

export default AiHubAskAiLayout;
