import { ScrollArea } from "@/components/ui/scroll-area";

const TeleMedicineLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollArea className="h-[calc(100vh-53px)] overflow-y-auto">
      {children}
    </ScrollArea>
  );
};

export default TeleMedicineLayout;
