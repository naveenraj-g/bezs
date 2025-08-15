import { ScrollArea } from "@/components/ui/scroll-area";

const AppsLayout = ({ children }: { children: React.ReactNode }) => {
  return <ScrollArea className="h-[calc(100vh-132px)]">{children}</ScrollArea>;
};

export default AppsLayout;
