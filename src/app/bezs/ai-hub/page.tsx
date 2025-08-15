import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import Link from "next/link";

const AiHubHomePage = async () => {
  const session = await getServerSession();

  return (
    <div className="h-[calc(100vh-53px)]">
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Welcome to <br />
              <span className="text-blue-700 text-5xl md:text-6xl">AI Hub</span>
            </h1>
          </div>

          <div className="text-center max-w-xl flex flex-col items-center justify-center">
            <p className="mb-8">
              Welcome to the AiHub page! Here you can chat with multiple ai
              models.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {session?.user?.role === "application-admin" && (
                <Link
                  href="/bezs/ai-hub/admin"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Go To Admin
                </Link>
              )}
              {session?.user?.role === "aihub-user" && (
                <Link
                  href="/bezs/ai-hub/ask-ai"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Open App
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiHubHomePage;
