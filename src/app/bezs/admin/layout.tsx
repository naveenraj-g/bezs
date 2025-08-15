import { CommonSideBar } from "@/components/sidebar/common-sidebar";
import BreadCrumb from "@/components/sidebar/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminModalProvider } from "@/modules/admin/providers/admin-modal-provider";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-53px)] relative overflow-hidden">
      <SidebarProvider
        className="min-h-full"
        style={{
          "--sidebar-width": "12.5rem",
          "--sidebar-width-mobile": "12.5rem",
        }}
      >
        <CommonSideBar label="Admin Management" />
        <main className="h-[calc(100vh-53px)] overflow-y-auto w-full p-6 space-y-6">
          <div className="flex items-center">
            <SidebarTrigger className="cursor-pointer" />
            <BreadCrumb />
          </div>
          <AdminModalProvider />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
