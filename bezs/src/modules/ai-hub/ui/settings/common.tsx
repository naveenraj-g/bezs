// import { Button } from "@/components/ui/button";
// import { useSelectedModelStore } from "../../stores/useSelectedModelStore";
// import { Textarea } from "@/components/ui/textarea";
// import { useFormik } from "formik";
// import { useEffect } from "react";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";

// export const CommonSettings = () => {
//   const modelPreferences = useSelectedModelStore(
//     (state) => state.modelPreferences
//   );
//   const defaultModelPreferences = useSelectedModelStore(
//     (state) => state.defaultModelPreferences
//   );
//   const setModelPreferences = useSelectedModelStore(
//     (state) => state.setModelPreferences
//   );

//   const formik = useFormik({
//     initialValues: {
//       systemPrompt: "",
//       messageLimit: "all",
//       temperature: 0.5,
//       topP: 1,
//       topK: 5,
//       maxTokens: 1000,
//     },
//     onSubmit: (values) => {},
//   });

//   useEffect(() => {
//     formik.setFieldValue(
//       "systemPrompt",
//       modelPreferences.systemPrompt || defaultModelPreferences.systemPrompt
//     );
//     formik.setFieldValue(
//       "messageLimit",
//       modelPreferences.messageLimit || defaultModelPreferences.messageLimit
//     );
//     formik.setFieldValue(
//       "temperature",
//       modelPreferences.temperature || defaultModelPreferences.temperature
//     );
//     formik.setFieldValue(
//       "topP",
//       modelPreferences.topP || defaultModelPreferences.topP
//     );
//     formik.setFieldValue(
//       "topK",
//       modelPreferences.topK || defaultModelPreferences.topK
//     );
//     formik.setFieldValue(
//       "maxTokens",
//       modelPreferences.maxTokens || defaultModelPreferences.maxTokens
//     );
//   }, []);

//   return (
//     <div className="flex flex-col items-start pr-2 pb-4 gap-6 h-full overflow-y-auto no-scrollbar">
//       <p className="text-base font-medium">Default Settings</p>
//       <div className="flex flex-col w-full gap-2">
//         <div className="flex flex-row items-end justify-between w-full">
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">
//             System Default Prompt
//           </p>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => {
//               setModelPreferences({
//                 systemPrompt: defaultModelPreferences.systemPrompt,
//               });
//               formik.setFieldValue(
//                 "systemPrompt",
//                 defaultModelPreferences.systemPrompt
//               );
//             }}
//           >
//             Reset to default
//           </Button>
//         </div>
//         <Textarea
//           name="systemPrompt"
//           value={formik.values.systemPrompt}
//           autoComplete="off"
//           onChange={(e) => {
//             setModelPreferences({ systemPrompt: e.target.value });
//             formik.setFieldValue("systemPrompt", e.target.value);
//           }}
//         />
//       </div>

//       <div className="flex flex-col w-full gap-2">
//         <div className="flex flex-row items-end justify-between w-full">
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">
//             Message Limit
//           </p>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => {
//               setModelPreferences({
//                 messageLimit: defaultModelPreferences.messageLimit,
//               });
//               formik.setFieldValue(
//                 "messageLimit",
//                 defaultModelPreferences.messageLimit
//               );
//             }}
//           >
//             Reset to default
//           </Button>
//         </div>

//         <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
//           <div className="flex flex-row w-full justify-between items-center">
//             <p className="text-sm">Use all previous messages</p>
//             <Switch
//               checked={formik.values.messageLimit === "all"}
//               onCheckedChange={(checked) => {
//                 setModelPreferences({ messageLimit: checked ? "all" : 4 });
//                 formik.setFieldValue("messageLimit", checked ? "all" : 4);
//               }}
//             />
//           </div>
//           {formik.values.messageLimit !== "all" && (
//             <>
//               <p className="text-xs text-zinc-500 dark:text-zinc-300">
//                 Message Limit
//               </p>
//               <Input
//                 name="messageLimit"
//                 type="number"
//                 value={formik.values.messageLimit}
//                 autoComplete="off"
//                 onChange={(e) => {
//                   setModelPreferences({ messageLimit: Number(e.target.value) });
//                   formik.setFieldValue("messageLimit", Number(e.target.value));
//                 }}
//               />
//             </>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col w-full gap-2">
//         <div className="flex flex-row items-end justify-between w-full">
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">Max Tokens</p>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => {
//               setModelPreferences({
//                 maxTokens: defaultModelPreferences.maxTokens,
//               });
//               formik.setFieldValue(
//                 "maxTokens",
//                 defaultModelPreferences.maxTokens
//               );
//             }}
//           >
//             Reset to default
//           </Button>
//         </div>
//         <Input
//           name="maxTokens"
//           type="number"
//           value={formik.values.maxTokens}
//           autoComplete="off"
//           onChange={(e) => {
//             setModelPreferences({ maxTokens: Number(e.target.value) });
//             formik.setFieldValue("maxTokens", Number(e.target.value));
//           }}
//         />
//       </div>

//       <div className="flex flex-col w-full gap-2">
//         <div className="flex flex-row items-end justify-between w-full">
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">
//             Temperature
//           </p>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => {
//               setModelPreferences({
//                 temperature: defaultModelPreferences.temperature,
//               });
//               formik.setFieldValue(
//                 "temperature",
//                 defaultModelPreferences.temperature
//               );
//             }}
//           >
//             Reset to default
//           </Button>
//         </div>
//         <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
//           <p className="text-xl font-medium">{formik.values.temperature}</p>
//           <Slider
//             className="my-2"
//             value={[Number(formik.values.temperature)]}
//             step={0.1}
//             min={0.1}
//             max={1}
//             onValueChange={(value: number[]) => {
//               setModelPreferences({ temperature: value?.[0] });
//               formik.setFieldValue("temperature", value?.[0]);
//             }}
//           />
//           <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
//             <p className="text-xs text-zinc-500 dark:text-zinc-300">Precise</p>
//             <p className="text-xs text-zinc-500 dark:text-zinc-300">Neutral</p>
//             <p className="text-xs text-zinc-500 dark:text-zinc-300">Creative</p>
//           </div>
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">
//             Higher values like 0.8 will make the output more random, while lower
//             values like 0.2 will make it more focus and deterministic.
//           </p>
//         </div>
//       </div>

//       <div className="flex flex-col w-full gap-2">
//         <div className="flex flex-row items-end justify-between w-full">
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">TopP</p>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => {
//               setModelPreferences({
//                 topP: defaultModelPreferences.topP,
//               });
//               formik.setFieldValue("topP", defaultModelPreferences.topP);
//             }}
//           >
//             Reset to default
//           </Button>
//         </div>
//         <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
//           <p className="text-xl font-medium">{formik.values.topP}</p>
//           <Slider
//             className="my-2"
//             value={[Number(formik.values.topP)]}
//             step={0.01}
//             name="topP"
//             min={0}
//             max={1}
//             onValueChange={(value: number[]) => {
//               setModelPreferences({ topP: value?.[0] });
//               formik.setFieldValue("topP", value?.[0]);
//             }}
//           />
//           <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
//             <p className="text-xs text-zinc-500 dark:text-zinc-300">Precise</p>
//             <p className="text-xs text-zinc-500 dark:text-zinc-300">Creative</p>
//           </div>
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">
//             An alternative to sampling with temperature, called nucleus
//             sampling, where the model considers the results of the tokens with
//             top_p probability mass. so 0.1 means only the tokens comprising the
//             top 10% probability mass re considered.
//           </p>
//         </div>
//       </div>

//       <div className="flex flex-col w-full gap-2">
//         <div className="flex flex-row items-end justify-between w-full">
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">TopK</p>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => {
//               setModelPreferences({
//                 topK: defaultModelPreferences.topK,
//               });
//               formik.setFieldValue("topK", defaultModelPreferences.topK);
//             }}
//           >
//             Reset to default
//           </Button>
//         </div>
//         <div className="flex flex-col gap-2 justify-between w-full p-3 bg-white/40 dark:bg-white/8 rounded-xl">
//           <p className="text-xl font-medium">{formik.values.topK}</p>
//           <Slider
//             className="my-2"
//             value={[Number(formik.values.topK)]}
//             step={1}
//             name="topK"
//             min={0}
//             max={100}
//             onValueChange={(value: number[]) => {
//               setModelPreferences({ topK: value?.[0] });
//               formik.setFieldValue("topK", value?.[0]);
//             }}
//           />
//           <div className="flex flex-row gap-2 flex-wrap justify-between w-full">
//             <p className="text-xs text-zinc-500 dark:text-zinc-300">Precise</p>
//             <p className="text-xs text-zinc-500 dark:text-zinc-300">Creative</p>
//           </div>
//           <p className="text-xs text-zinc-500 dark:text-zinc-300">
//             An alternative to sampling with temperature, called nucleus
//             sampling, where the model considers the results of the tokens with
//             top_k probability mass. so 0.1 means only the tokens comprising the
//             top 10% probability mass re considered.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { z } from "zod";

import { useSelectedModelStore } from "../../stores/useSelectedModelStore";
// import { commonSettingsSchema, TCommonSettings } from "./common-settings-schema";

export const commonSettingsSchema = z.object({
  systemPrompt: z.string().optional(),
  messageLimit: z.union([z.literal("all"), z.number()]),
  temperature: z.number().min(0.1).max(1),
  topP: z.number().min(0).max(1),
  topK: z.number().min(0).max(100),
  maxTokens: z.number().min(1),
});

export type TCommonSettings = z.infer<typeof commonSettingsSchema>;

export const CommonSettings = () => {
  const modelPreferences = useSelectedModelStore(
    (state) => state.modelPreferences
  );
  const defaultModelPreferences = useSelectedModelStore(
    (state) => state.defaultModelPreferences
  );
  const setModelPreferences = useSelectedModelStore(
    (state) => state.setModelPreferences
  );

  const form = useForm<TCommonSettings>({
    resolver: zodResolver(commonSettingsSchema),
    defaultValues: {
      systemPrompt: "",
      messageLimit: "all",
      temperature: 0.5,
      topP: 1,
      topK: 5,
      maxTokens: 1000,
    },
  });

  const { register, setValue, watch, getValues } = form;

  useEffect(() => {
    form.reset({
      systemPrompt:
        modelPreferences.systemPrompt ?? defaultModelPreferences.systemPrompt,
      messageLimit:
        modelPreferences.messageLimit ?? defaultModelPreferences.messageLimit,
      temperature:
        modelPreferences.temperature ?? defaultModelPreferences.temperature,
      topP: modelPreferences.topP ?? defaultModelPreferences.topP,
      topK: modelPreferences.topK ?? defaultModelPreferences.topK,
      maxTokens:
        modelPreferences.maxTokens ?? defaultModelPreferences.maxTokens,
    });
  }, []);

  const debouncedUpdate = useMemo(
    () =>
      debounce((key: keyof TCommonSettings, value: any) => {
        setModelPreferences({ [key]: value });
      }, 100),
    []
  );

  const messageLimit = watch("messageLimit");

  return (
    <div className="flex flex-col items-start pr-2 pb-4 gap-6 h-full overflow-y-auto no-scrollbar">
      <p className="text-base font-medium">Default Settings</p>

      {/* System Prompt */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-end">
          <p className="text-xs text-muted-foreground">System Default Prompt</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const val = defaultModelPreferences.systemPrompt;
              setValue("systemPrompt", val);
              setModelPreferences({ systemPrompt: val });
            }}
          >
            Reset to default
          </Button>
        </div>
        <Textarea
          {...register("systemPrompt")}
          onBlur={() =>
            setModelPreferences({ systemPrompt: getValues("systemPrompt") })
          }
        />
      </div>

      {/* Message Limit */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-end">
          <p className="text-xs text-muted-foreground">Message Limit</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const val = defaultModelPreferences.messageLimit;
              setValue("messageLimit", val);
              setModelPreferences({ messageLimit: val });
              form.setValue("messageLimit", val);
            }}
          >
            Reset to default
          </Button>
        </div>
        <div className="bg-white/40 dark:bg-white/8 p-3 rounded-xl">
          <div className="flex justify-between items-center">
            <p className="text-sm">Use all previous messages</p>
            <Switch
              checked={messageLimit === "all"}
              onCheckedChange={(checked) => {
                const val = checked ? "all" : 4;
                setValue("messageLimit", val);
                setModelPreferences({ messageLimit: val });
              }}
            />
          </div>
          {messageLimit !== "all" && (
            <>
              <p className="text-xs text-muted-foreground mt-2">
                Message Limit
              </p>
              <Input
                type="number"
                {...register("messageLimit", { valueAsNumber: true })}
                onBlur={() =>
                  setModelPreferences({
                    messageLimit: Number(getValues("messageLimit")),
                  })
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Max Tokens */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-end">
          <p className="text-xs text-muted-foreground">Max Tokens</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const val = defaultModelPreferences.maxTokens;
              setValue("maxTokens", val);
              setModelPreferences({ maxTokens: val });
            }}
          >
            Reset to default
          </Button>
        </div>
        <Input
          type="number"
          {...register("maxTokens", { valueAsNumber: true })}
          onBlur={() =>
            setModelPreferences({ maxTokens: getValues("maxTokens") })
          }
        />
      </div>

      {/* Temperature */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-end">
          <p className="text-xs text-muted-foreground">Temperature</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const val = defaultModelPreferences.temperature;
              setValue("temperature", val);
              setModelPreferences({ temperature: val });
            }}
          >
            Reset to default
          </Button>
        </div>
        <div className="p-3 bg-white/40 dark:bg-white/8 rounded-xl flex flex-col gap-2">
          <p className="text-xl font-medium">{watch("temperature")}</p>
          <Slider
            value={[watch("temperature")]}
            step={0.1}
            min={0.1}
            max={1}
            onValueChange={(value) => {
              setValue("temperature", value[0]);
              debouncedUpdate("temperature", value[0]);
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <p>Precise</p>
            <p>Neutral</p>
            <p>Creative</p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-300">
            Higher values like 0.8 will make the output more random, while lower
            values like 0.2 will make it more focus and deterministic.
          </p>
        </div>
      </div>

      {/* TopP */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-end">
          <p className="text-xs text-muted-foreground">TopP</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const val = defaultModelPreferences.topP;
              setValue("topP", val);
              setModelPreferences({ topP: val });
            }}
          >
            Reset to default
          </Button>
        </div>
        <div className="p-3 bg-white/40 dark:bg-white/8 rounded-xl flex flex-col gap-2">
          <p className="text-xl font-medium">{watch("topP")}</p>
          <Slider
            value={[watch("topP")]}
            step={0.01}
            min={0}
            max={1}
            onValueChange={(value) => {
              setValue("topP", value[0]);
              debouncedUpdate("topP", value[0]);
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <p>Precise</p>
            <p>Creative</p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-300">
            An alternative to sampling with temperature, called nucleus
            sampling, where the model considers the results of the tokens with
            top_p probability mass. so 0.1 means only the tokens comprising the
            top 10% probability mass re considered.
          </p>
        </div>
      </div>

      {/* TopK */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-end">
          <p className="text-xs text-muted-foreground">TopK</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const val = defaultModelPreferences.topK;
              setValue("topK", val);
              setModelPreferences({ topK: val });
            }}
          >
            Reset to default
          </Button>
        </div>
        <div className="p-3 bg-white/40 dark:bg-white/8 rounded-xl flex flex-col gap-2">
          <p className="text-xl font-medium">{watch("topK")}</p>
          <Slider
            value={[watch("topK")]}
            step={1}
            min={0}
            max={100}
            onValueChange={(value) => {
              setValue("topK", value[0]);
              debouncedUpdate("topK", value[0]);
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <p>Precise</p>
            <p>Creative</p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-300">
            An alternative to sampling with temperature, called nucleus
            sampling, where the model considers the results of the tokens with
            top_k probability mass. so 0.1 means only the tokens comprising the
            top 10% probability mass re considered.
          </p>
        </div>
      </div>
    </div>
  );
};
