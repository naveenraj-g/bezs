"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "../../hooks/use-preferences";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>("");
  const { getApiKey, setApiKey } = usePreferences();

  useEffect(() => {
    getApiKey("gemini").then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, [getApiKey]);

  async function handleAPIKeyINputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setKey(e.target.value);
    await setApiKey("gemini", e.target.value);
  }

  return (
    <div className="px-4 flex flex-col items-start gap-2">
      <p className="text-md font-medium pb-2">Google Gemini Settings</p>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500 dark:text-zinc-300/90">
          Google Gemini API Key
        </p>
      </div>
      <Input
        placeholder="AI_xxxxxxxxxxxxxxxxxxxx"
        autoComplete="off"
        type="password"
        value={key}
        onChange={handleAPIKeyINputChange}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          window.open("https://aistudio.google.com/app/apikey", "_blank")
        }
      >
        Get your API key here <ArrowRight size={16} />
      </Button>
      <Alert variant="success" className="p-2">
        <Info className="h-4 w-4" />
        <AlertTitle>Attention!</AlertTitle>
        <AlertDescription>
          Your API Key is stored locally on your browser and never sent anywhere
        </AlertDescription>
      </Alert>
    </div>
  );
};
