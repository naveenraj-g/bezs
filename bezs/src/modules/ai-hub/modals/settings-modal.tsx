import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSettingsStore } from "../stores/useSettingsStore";
import { Button } from "@/components/ui/button";

export const SettingsModal = () => {
  const isSettingOpen = useSettingsStore((state) => state.isSettingOpen);
  const onClose = useSettingsStore((state) => state.dismiss);
  const selectedMenu = useSettingsStore((state) => state.selectedMenu);
  const settingMenu = useSettingsStore((state) => state.settingMenu);
  const modelsMenu = useSettingsStore((state) => state.modelsMenu);
  const pluginsMenu = useSettingsStore((state) => state.pluginsMenu);
  const setSelectedMenu = useSettingsStore((state) => state.setSelectedMenu);
  const getAllMenu = useSettingsStore((state) => state.getAllMenu);

  const allMenu = getAllMenu();

  const selectedMenuItem = allMenu.find((menu) => menu.key === selectedMenu);

  function handleModalClose() {
    onClose();
  }
  return (
    <Dialog open={isSettingOpen} onOpenChange={handleModalClose}>
      <DialogContent className="flex flex-row p-0 h-[90vh]">
        <DialogTitle className="!hidden" />
        <div className="flex flex-col p-4">
          <p className="px-2 py-2 text-xs font-semibold">GENERAL</p>
          <div className="flex flex-col gap-1">
            {settingMenu.map((menu) => (
              <Button
                key={menu.key}
                variant={selectedMenu === menu.key ? "secondary" : "ghost"}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start text-zinc-600 dark:text-zinc-300/80 h-7"
                size="sm"
              >
                {menu.icon()} {menu.name}
              </Button>
            ))}
          </div>
          <p className="px-2 py-2 text-xs font-semibold mt-2">MODELS</p>
          <div className="flex flex-col gap-1">
            {modelsMenu.map((menu) => (
              <Button
                key={menu.key}
                variant={selectedMenu === menu.key ? "secondary" : "ghost"}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start text-zinc-600 dark:text-zinc-300/80 h-7"
                size="sm"
              >
                {menu.icon()} {menu.name}
              </Button>
            ))}
          </div>
          <p className="px-2 py-2 text-xs font-semibold mt-2">PLUGINS</p>
          <div className="flex flex-col gap-1">
            {pluginsMenu.map((menu) => (
              <Button
                key={menu.key}
                variant={selectedMenu === menu.key ? "secondary" : "ghost"}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start text-zinc-600 dark:text-zinc-300/80 h-7"
                size="sm"
              >
                {menu.icon()} {menu.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-zinc-100/80 dark:bg-zinc-900 w-full overflow-y-auto no-scrollbar">
          {selectedMenuItem?.component}
        </div>
      </DialogContent>
    </Dialog>
  );
};
