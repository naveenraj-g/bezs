import AppSettingsSidebar from "@/components/sidebar/ui/app-settings-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider
        style={{
          "--sidebar-width": "0rem",
          "--sidebar-width-mobile": "0rem",
        }}
        className="h-full min-h-full"
      >
        <AppSettingsSidebar />
        <ScrollArea className="w-full px-6 pt-2 pb-6">{children}</ScrollArea>
      </SidebarProvider>
    </>
  );
};

export default SettingsLayout;
