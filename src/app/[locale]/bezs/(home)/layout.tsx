import AppSidebar from "@/components/sidebar/ui/app-sidebar";
import BreadCrumb from "@/components/sidebar/ui/breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";
import HomePageTab from "@/modules/bezs/ui/home-page-tab";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-90px)]">
      <HomePageTab />
      {/* <BreadCrumb /> */}
      <SidebarProvider
        // style={{
        //   "--sidebar-width": "0rem",
        //   "--sidebar-width-mobile": "0rem",
        // }}
        className="h-full min-h-full flex"
      >
        <AppSidebar />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default HomeLayout;
