import { encodingForModel } from "js-tiktoken";

export const useTokenCounter = () => {
  const getTokenCount = (message: string) => {
    const enc = encodingForModel("gpt-3.5-turbo");

    if (message) {
      return enc.encode(message).length;
    }

    return undefined;
  };

  const countPricing = (
    token: number,
    type: "input" | "output",
    model?: any
  ) => {
    if (type === "input") {
      return Number((token * (model?.inputPrice || 0)) / 1000000) || 0;
    }

    return Number((token * (model?.outputPrice || 0)) / 1000000) || 0;
  };

  return { getTokenCount, countPricing };
};
