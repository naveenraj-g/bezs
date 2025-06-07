import { AppMenuItemsListTable } from "@/modules/admin/ui/tables/app-menuItems-list-table/app-menuItems-list-table";

// import { AppMenuItemsListTable } from "@/modules/admin/ui/app-menuItems-list-table copy";

const AppMenuItemsPage = async ({
  searchParams,
}: {
  searchParams?: { appId: string };
}) => {
  const appId = (await searchParams)?.appId;

  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Manage Menu Items</h1>
        <p className="text-sm">Manage Menu Items and its functionality.</p>
      </div>
      <AppMenuItemsListTable appId={appId} />
    </div>
  );
};

export default AppMenuItemsPage;
