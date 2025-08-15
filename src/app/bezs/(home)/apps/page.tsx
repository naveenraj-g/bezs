import AppsList from "@/modules/bezs/ui/apps-list";

const HomeApps = () => {
  return (
    <div className="max-w-[1000px] mx-auto p-4 pb-8 space-y-10 h-full">
      <h1 className="text-center text-xl font-semibold">List of all Apps</h1>
      <AppsList />
    </div>
  );
};

export default HomeApps;
