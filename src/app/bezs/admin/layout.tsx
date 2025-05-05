import { AdminSideBar } from "@/components/sidebar/admin/admin-sidebar";
import BreadCrumb from "@/components/sidebar/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminModalProvider } from "@/modules/admin/providers/admin-modal-provider";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[calc(100vh-52px)] relative">
      <SidebarProvider
        className="min-h-full"
        style={{
          "--sidebar-width": "12.5rem",
          "--sidebar-width-mobile": "12.5rem",
        }}
      >
        <AdminSideBar />
        <main className="h-[calc(100vh-52px)] overflow-y-auto w-full p-6 space-y-6">
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
