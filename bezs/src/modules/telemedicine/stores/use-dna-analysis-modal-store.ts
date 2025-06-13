import { create } from "zustand";
import { ClinvarVariantType } from "../types/dna-analysis-types";

export type ModalType = "variantComparison";

interface TelemedicineAdminStore {
  type: ModalType | null;
  isOpen: boolean;
  comparisonVariantData: ClinvarVariantType | null;
  trigger: number;
  incrementTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    comparisonVariantData?: ClinvarVariantType;
  }) => void;
  onClose: () => void;
}

export const useDNAanalysisModal = create<TelemedicineAdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  comparisonVariantData: null,
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  onOpen: ({ type, comparisonVariantData = null }) =>
    set({
      isOpen: true,
      type,
      comparisonVariantData,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      comparisonVariantData: null,
    }),
}));
