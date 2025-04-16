import { ScrollArea } from "@/components/ui/scroll-area";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-[calc(100vh-132px)] overflow-y-auto w-full">
        {children}
      </div>
    </>
  );
};

export default AdminLayout;
