import { useRouter } from "next/navigation";
import { SettingsContainer } from "./settings-container";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { toast } from "sonner";
import { useChatContext } from "../../context/chat/context";

export const Data = () => {
  const router = useRouter();
  const onClose = useSettingsStore((state) => state.dismiss);

  const { clearChatSessions } = useChatContext();

  const clearAllData = async () => {
    await clearChatSessions();
    toast("Data Cleared.", {
      description: "All chat data has been cleared.",
    });
    router.push(`/bezs/ai-hub/ask-ai`);
    onClose();
  };

  return (
    <SettingsContainer title="Manage your Data">
      <div className="flex flex-row items-end justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Clear all chat data
        </p>
      </div>
      <Button variant="destructive" size="sm" onClick={clearAllData}>
        Clear All Data
      </Button>
    </SettingsContainer>
  );
};
