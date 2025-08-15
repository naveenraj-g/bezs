import { z, ZodObject } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { RunnableLambda } from "@langchain/core/runnables";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { ModelIcon } from "../ui/icons/model-icon";
import { CalculatorIcon, GlobeIcon } from "@phosphor-icons/react";
import { TPreferences } from "./use-preferences";
import axios from "axios";

const calculatorTool = () => {
  const calculatorSchema = z.object({
    operation: z
      .enum(["add", "subtract", "multiply", "divide"])
      .describe("The type of operation to execute."),
    number1: z.number().describe("The first number to operate on."),
    number2: z.number().describe("The second number to operate on."),
  });

  return new DynamicStructuredTool({
    name: "calculator",
    description: "Can perform mathematical operations.",
    schema: calculatorSchema,
    func: async ({ operation, number1, number2 }) => {
      if (operation === "add") {
        return `${number1 + number2}`;
      } else if (operation === "subtract") {
        return `${number1 - number2}`;
      } else if (operation === "multiply") {
        return `${number1 * number2}`;
      } else if (operation === "divide") {
        return `${number1 / number2}`;
      } else {
        throw new Error("Invalid operation.");
      }
    },
  });
};

const webSearchTool = (preferences: TPreferences) => {
  const webSearchSchema = z.object({
    input: z.string(),
  });

  return new DynamicStructuredTool({
    name: "web_search",
    description:
      "A search engine optimized for comprehensive, accurate and trusted results. Useful for when you need to answer questions about events. INput should be a search query.",
    schema: webSearchSchema,
    func: async ({ input }, runManager) => {
      const url = "https://www.googleapis.com/customsearch/v1";
      const params = {
        key: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY,
        cx: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID,
        q: input,
      };

      try {
        const response = await axios.get(url, { params });

        if (response.status !== 200) {
          runManager?.handleToolError("Error performing Google Search");
          throw new Error("Invalid response");
        }

        const googleSearchresult = response.data?.items?.map((item: any) => ({
          title: item.title,
          snippet: item.snippet,
          url: item.link,
        }));

        const searchInfo = googleSearchresult
          ?.map(
            (r: any, index: number) =>
              `${index + 1}. Title: """${r.title}""" \n URL: """${r.url}"""\n snippet: """${r.snippet}"""`
          )
          ?.join("\n\n");

        const searchPrompt = `Information : \n\n ${searchInfo} \n\n Based on snippet please answer the given question with proper citations. Must Remove XML tags if any. Question: ${input}`;

        return searchPrompt;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        return "Error performing Google Search";
      }
    },
  });
};

export type TToolKey = "calculator" | "web_search";
export type IconSize = "sm" | "md" | "lg";

export type TTool = {
  key: TToolKey;
  name: string;
  loadingMessage?: string;
  resultMessage?: string;
  tool: (args?: any) => DynamicStructuredTool<ZodObject<any>>;
  icon: (size: IconSize) => React.ReactNode;
  smallIcon: () => React.ReactNode;
};

export const useTools = () => {
  const tools: TTool[] = [
    {
      key: "calculator",
      tool: calculatorTool,
      name: "Calculator",
      loadingMessage: "Calculating...",
      resultMessage: "Calculated Result",
      icon: (size: IconSize) => <ModelIcon type="calculator" size={size} />,
      smallIcon: () => <CalculatorIcon size={16} weight="bold" />,
    },
    {
      key: "web_search",
      tool: webSearchTool,
      name: "Google Search",
      loadingMessage: "Searching on web...",
      resultMessage: "Results from Google Search",
      icon: (size: IconSize) => <ModelIcon type="websearch" size={size} />,
      smallIcon: () => <GlobeIcon size={16} weight="bold" />,
    },
  ];

  const calTool = calculatorTool();
  const searchTool = new TavilySearchResults({
    maxResults: 5,
    apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
  });

  const toolCalling = (selectedModel: any) =>
    new RunnableLambda({
      func: async (output: AIMessage) => {
        console.log("output", output);

        const tool = output?.tool_calls?.[0];

        console.log(tool);

        if (tool?.name === "calculator") {
          const result = await calTool.invoke({
            name: tool.name,
            args: tool.args,
          });
          return new AIMessage(result);
        }

        if (tool?.name === "tavily_search_results_json") {
          const result = await searchTool.invoke(tool.args.input);
          const parsedResults = JSON.parse(result);

          console.log(parsedResults);

          const searchPrompt = [
            new SystemMessage(
              `Based on past conversation here are result from the internet. ${parsedResults?.map((r: any, index: number) => `${index + 1}. Title: """${r.title}""" \n URL: """${r.url}""" \n description: """${r.description}"""`)}. Please summarize this findings with citation link  to their source`
            ),
          ];

          return selectedModel.stream(searchPrompt);
        }

        return output;
      },
    });

  const getToolByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key === key)?.tool;
  };

  const getToolInfoByKey = (key: TToolKey) => {
    return tools.find((tool) => tool.key === key);
  };

  return {
    calculatorTool,
    webSearchTool,
    tools,
    getToolByKey,
    getToolInfoByKey,
  };
};
