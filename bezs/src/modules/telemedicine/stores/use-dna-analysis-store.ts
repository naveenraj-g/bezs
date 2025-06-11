import { create } from "zustand";

interface DNAanalysisStore {
  selectedGenome: string;
  selectedChromosome: string;
  setValue: (props: {
    selectedGenome?: string;
    selectedChromosome?: string;
  }) => void;
  resetValue: () => void;
}

export const useDNAanalysisStore = create<DNAanalysisStore>((set) => ({
  selectedGenome: "hg38",
  selectedChromosome: "",
  setValue: ({ selectedGenome, selectedChromosome }) =>
    set((state) => ({
      selectedGenome: selectedGenome ?? state.selectedGenome,
      selectedChromosome: selectedChromosome ?? state.selectedChromosome,
    })),
  resetValue: () => set({ selectedGenome: "", selectedChromosome: "" }),
}));
