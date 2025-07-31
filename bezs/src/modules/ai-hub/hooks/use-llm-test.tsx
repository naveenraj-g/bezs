import { useState } from "react";
import { useModelList } from "./use-model-list";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const useLLMTest = () => {
  const { createInstance } = useModelList();

  const [isTestRunning, setIsTestRunning] = useState(false);

  const textLLM = async (selectedModel: string) => {
    try {
      if (!selectedModel) {
        return false;
      }

      const model = createInstance(selectedModel);

      const data = (await model).invoke("This is a test Message");

      if ((await data).content) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleTestModelClick = async (selectedModel: string) => {
    setIsTestRunning(true);
    const succeed = await textLLM(selectedModel);
    if (succeed) {
      toast.success("Test Succeed", {
        description: "Model is working as expected.",
        richColors: true,
      });
    } else {
      toast.error("Test Failed.", {
        description: "Something wrong with model, Try later.",
        richColors: true,
      });
    }
    setIsTestRunning(false);
  };

  const renderTestButton = (selectedModel: string) => {
    return (
      <Button
        size="sm"
        onClick={async () => await handleTestModelClick(selectedModel)}
      >
        {isTestRunning ? "Running" : "Run Test"}
      </Button>
    );
  };

  return renderTestButton;
};
