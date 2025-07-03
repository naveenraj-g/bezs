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
    <div className="h-[calc(100vh-141px)] overflow-y-auto">
      <StoreInitializerProvider />
      <Topbar />
      <div className="h-[calc(100vh-189px)]">{children}</div>
    </div>
  );
};

export default AiHubAskAiLayout;
