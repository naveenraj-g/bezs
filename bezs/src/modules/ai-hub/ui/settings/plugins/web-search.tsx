import { useModelSettings } from "@/modules/ai-hub/hooks/use-model-settings";
import { usePreferences } from "@/modules/ai-hub/hooks/use-preferences";
import axios from "axios";
import { toast } from "sonner";
import { SettingsContainer } from "../settings-container";
import { ArrowRightIcon, InfoIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const WebSearchPlugin = () => {
  const { formik } = useModelSettings({});
  const { setPreferences } = usePreferences();

  const handleRunTest = async () => {
    try {
      const url = "https://www.googleapis.com/customsearch/v1";
      const params = {
        key: formik.values.googleSearchApiKey,
        cx: formik.values.googleSearchEngineId,
        q: "Latest news",
      };

      const response = await axios.get(url, { params });

      if (response.status === 200) {
        toast.success("Test Successful", {
          description: "Google search plugin is working.",
          richColors: true,
        });
      } else {
        throw new Error("Google search plugin is not working.");
      }
    } catch (err) {
      toast.error("Test Failed", {
        description: (err as Error).message,
        richColors: true,
      });
    }
  };

  return (
    <SettingsContainer title="Web search plugin">
      <div className="flex flex-col w-full items-start gap-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center justify-between py-2 w-full gap-2">
            <p className="flex items-center gap-1 text-xs md:text-base text text-zinc-500 dark:text-zinc-300">
              Google Search Engine ID <InfoIcon size={14} weight="regular" />
            </p>
          </div>
          <Input
            name="googleSearchEngineId"
            type="text"
            value={formik.values.googleSearchEngineId}
            autoComplete="off"
            onChange={(e) => {
              const value = e.target.value;
              setPreferences({ googleSearchEngineId: value });
              formik.setFieldValue("googleSearchEngineId", value);
            }}
            placeholder="xyz_xxxxxxxxxxxxxxx"
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex flex-row items-center justify-between py-2 w-full gap-2">
            <p className="flex items-center gap-1 text-xs md:text-base text text-zinc-500 dark:text-zinc-300">
              Google Search Api Key <InfoIcon size={14} weight="regular" />
            </p>
          </div>
          <Input
            name="googleSearchApiKey"
            type="text"
            value={formik.values.googleSearchApiKey}
            autoComplete="off"
            onChange={(e) => {
              const value = e.target.value;
              setPreferences({ googleSearchApiKey: value });
              formik.setFieldValue("googleSearchApiKey", value);
            }}
            placeholder="xyz_xxxxxxxxxxxxxxx"
          />
        </div>

        <Button onClick={handleRunTest} size="sm">
          Run check
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            window.open(
              "https://programmablesearchengine.google.com/controlpanel/create",
              "_blank"
            );
          }}
        >
          Get your API key here <ArrowRightIcon size={16} weight="bold" />
        </Button>
      </div>
    </SettingsContainer>
  );
};
