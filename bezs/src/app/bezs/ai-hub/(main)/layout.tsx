import { CommonSideBar } from "@/components/sidebar/common-sidebar";
import BreadCrumb from "@/components/sidebar/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const AiHubMainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return (
    <>
      <div className="h-[calc(100vh-53px)] relative overflow-hidden">
        <SidebarProvider
          className="min-h-full"
          style={{
            "--sidebar-width": "12.5rem",
            "--sidebar-width-mobile": "12.5rem",
          }}
        >
          <CommonSideBar label="MENUS" />
          <main className="h-[calc(100vh-53px)] overflow-y-auto w-full p-4 space-y-6">
            <div className="flex items-center">
              <SidebarTrigger className="cursor-pointer" />
              <BreadCrumb />
            </div>
            <>{children}</>
          </main>
        </SidebarProvider>
      </div>
    </>
  );
};

export default AiHubMainLayout;
