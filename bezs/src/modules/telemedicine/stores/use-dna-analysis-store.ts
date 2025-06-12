import { create } from "zustand";
import { GeneFromSearchType } from "../types/dna-analysis-types";

interface DNAanalysisStore {
  selectedGenome: string;
  selectedChromosome: string;
  selectedGene: GeneFromSearchType | null;
  setValue: (props: {
    selectedGenome?: string;
    selectedChromosome?: string;
  }) => void;
  setSelectedGene: (props: { selectedGene: GeneFromSearchType | null }) => void;
  resetValue: () => void;
}

export const useDNAanalysisStore = create<DNAanalysisStore>((set) => ({
  selectedGenome: "hg38",
  selectedChromosome: "",
  selectedGene: null,
  setValue: ({ selectedGenome, selectedChromosome }) =>
    set((state) => ({
      selectedGenome: selectedGenome ?? state.selectedGenome,
      selectedChromosome: selectedChromosome ?? state.selectedChromosome,
    })),
  setSelectedGene: ({ selectedGene = null }) => set({ selectedGene }),
  resetValue: () =>
    set({ selectedGenome: "", selectedChromosome: "", selectedGene: null }),
}));
