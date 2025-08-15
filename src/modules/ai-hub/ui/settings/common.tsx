import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useModelSettings } from "../../hooks/use-model-settings";
import { SettingsContainer } from "./settings-container";
import {
  usePreferences,
  defaultPreferences,
} from "../../hooks/use-preferences";

export const CommonSettings = () => {
  const { setPreferences } = usePreferences();

  const { formik } = useModelSettings({});

  return (
    <SettingsContainer title="Default Settings">
      <div className="flex flex-col items-start gap-6 h-full overflow-y-auto no-scrollbar">
        {/* <p className="text-base font-medium">Default Settings</p> */}
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row flex-wrap gap-2 items-end justify-between w-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-300">
              System Default Prompt
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreferences({
                  systemPrompt: defaultPreferences.systemPrompt,
                });
                formik.setFieldValue(
                  "systemPrompt",
                  defaultPreferences.systemPrompt
                );
              }}
            >
              Reset to default
            </Button>
          </div>
          <Textarea
            name="systemPrompt"
            value={formik.values.systemPrompt}
            autoComplete="off"
            onChange={(e) => {
              setPreferences({ systemPrompt: e.target.value });
              formik.setFieldValue("systemPrompt", e.target.value);
            }}
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row flex-wrap gap-2 items-end justify-between w-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-300">
              Message Limit
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreferences({
                  messageLimit: defaultPreferences.messageLimit,
                });
                formik.setFieldValue(
                  "messageLimit",
                  defaultPreferences.messageLimit
                );
              }}
            >
              Reset to default
            </Button>
          </div>

          <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
            <div className="flex flex-row w-full justify-between items-center">
              <p className="text-sm">Use all previous messages</p>
              <Switch
                checked={formik.values.messageLimit === "all"}
                onCheckedChange={(checked) => {
                  setPreferences({ messageLimit: checked ? "all" : 4 });
                  formik.setFieldValue("messageLimit", checked ? "all" : 4);
                }}
              />
            </div>
            {formik.values.messageLimit !== "all" && (
              <>
                <p className="text-xs text-zinc-500 dark:text-zinc-300">
                  Message Limit
                </p>
                <Input
                  name="messageLimit"
                  type="number"
                  value={formik.values.messageLimit}
                  autoComplete="off"
                  onChange={(e) => {
                    setPreferences({
                      messageLimit: Number(e.target.value),
                    });
                    formik.setFieldValue(
                      "messageLimit",
                      Number(e.target.value)
                    );
                  }}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row items-end justify-between flex-wrap gap-2 w-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-300">
              Max Tokens
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreferences({
                  maxTokens: defaultPreferences.maxTokens,
                });
                formik.setFieldValue("maxTokens", defaultPreferences.maxTokens);
              }}
            >
              Reset to default
            </Button>
          </div>
          <Input
            name="maxTokens"
            type="number"
            value={formik.values.maxTokens}
            autoComplete="off"
            onChange={(e) => {
              setPreferences({ maxTokens: Number(e.target.value) });
              formik.setFieldValue("maxTokens", Number(e.target.value));
            }}
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row items-end justify-between flex-wrap gap-2 w-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-300">
              Temperature
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreferences({
                  temperature: defaultPreferences.temperature,
                });
                formik.setFieldValue(
                  "temperature",
                  defaultPreferences.temperature
                );
              }}
            >
              Reset to default
            </Button>
          </div>
          <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
            <p className="text-xl font-medium">{formik.values.temperature}</p>
            <Slider
              className="my-2"
              value={[Number(formik.values.temperature)]}
              step={0.1}
              min={0.1}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ temperature: value?.[0] });
                formik.setFieldValue("temperature", value?.[0]);
              }}
            />
            <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
              <p className="text-xs text-zinc-500 dark:text-zinc-300">
                Precise
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">
                Neutral
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">
                Creative
              </p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-300">
              Higher values like 0.8 will make the output more random, while
              lower values like 0.2 will make it more focus and deterministic.
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row items-end justify-between flex-wrap gap-2 w-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-300">TopP</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreferences({
                  topP: defaultPreferences.topP,
                });
                formik.setFieldValue("topP", defaultPreferences.topP);
              }}
            >
              Reset to default
            </Button>
          </div>
          <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
            <p className="text-xl font-medium">{formik.values.topP}</p>
            <Slider
              className="my-2"
              value={[Number(formik.values.topP)]}
              step={0.01}
              name="topP"
              min={0}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ topP: value?.[0] });
                formik.setFieldValue("topP", value?.[0]);
              }}
            />
            <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
              <p className="text-xs text-zinc-500 dark:text-zinc-300">
                Precise
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">
                Creative
              </p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-300">
              An alternative to sampling with temperature, called nucleus
              sampling, where the model considers the results of the tokens with
              top_p probability mass. so 0.1 means only the tokens comprising
              the top 10% probability mass re considered.
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-row items-end justify-between flex-wrap gap-2 w-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-300">TopK</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreferences({
                  topK: defaultPreferences.topK,
                });
                formik.setFieldValue("topK", defaultPreferences.topK);
              }}
            >
              Reset to default
            </Button>
          </div>
          <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
            <p className="text-xl font-medium">{formik.values.topK}</p>
            <Slider
              className="my-2"
              value={[Number(formik.values.topK)]}
              step={1}
              name="topK"
              min={0}
              max={100}
              onValueChange={(value: number[]) => {
                setPreferences({ topK: value?.[0] });
                formik.setFieldValue("topK", value?.[0]);
              }}
            />
            <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
              <p className="text-xs text-zinc-500 dark:text-zinc-300">
                Precise
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">
                Creative
              </p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-300">
              An alternative to sampling with temperature, called nucleus
              sampling, where the model considers the results of the tokens with
              top_k probability mass. so 0.1 means only the tokens comprising
              the top 10% probability mass re considered.
            </p>
          </div>
        </div>
      </div>
    </SettingsContainer>
  );
};
