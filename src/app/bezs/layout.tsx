import AppNavbar from "@/components/sidebar/ui/app-navbar";
import AppSettingsSidebar from "@/components/sidebar/ui/app-settings-sidebar";
import AppSidebar from "@/components/sidebar/ui/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const AppListingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <SidebarProvider
        style={{
          "--sidebar-width": "0rem",
          "--sidebar-width-mobile": "0rem",
        }}
        className="h-screen flex"
      >
        <AppSidebar />
        <AppSettingsSidebar />
        <ScrollArea className="h-screen w-full">
          <main className="w-full py-4 px-6">
            <AppNavbar session={session} />
            {children}
          </main>
        </ScrollArea>
      </SidebarProvider>
    </>
  );
};

export default AppListingLayout;
