import { AppActionsListTable } from "@/modules/admin/ui/app-actions-list-table";

const MenuItemsPage = async ({
  searchParams,
}: {
  searchParams?: { appId: string };
}) => {
  const appId = (await searchParams)?.appId;

  return (
    <div className="space-y-8 mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Manage Actions</h1>
        <p className="text-sm">Manage Actions and its functionality.</p>
      </div>
      <AppActionsListTable appId={appId} />
    </div>
  );
};

export default MenuItemsPage;
