import { AdminModalProvider } from "@/modules/admin/providers/admin-modal-provider";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-[calc(100vh-132px)] overflow-y-auto w-full">
        <AdminModalProvider />
        {children}
      </div>
    </>
  );
};

export default AdminLayout;
