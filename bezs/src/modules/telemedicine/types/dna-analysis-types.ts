export interface GenomeAssemblyFormSearchType {
  id: string;
  name: string;
  sourceName: string;
  active: boolean;
}

export interface ChromosomeFromSearchType {
  name: string;
  size: number;
}

export interface GeneFromSearchType {
  symbol: string;
  name: string;
  chrom: string;
  description: string;
  gene_id?: string;
}

export interface GeneDetailsFromSearchType {
  genomicinfo?: {
    chrstart: number;
    chrstop: number;
    strand?: string;
  }[];
  summary: string;
  organism?: {
    scientificname: string;
    commonname: string;
  };
}

export interface GeneBoundsType {
  min: number;
  max: number;
}

export interface ClinvarVariantType {
  clinvar_id: string;
  title: string;
  variation_type: string;
  classification: string;
  gene_sort: string;
  chromosome: string;
  location: string;
  evo2Result?: {
    prediction: string;
    delta_score: number;
    classification_confidence: number;
  };
  isAnalyzing?: boolean;
  evo2Error?: string;
}

export interface AnalysisResultType {
  position: number;
  reference: string;
  alternative: string;
  delta_score: number;
  prediction: string;
  classification_confidence: number;
}

export interface VariantAnalysisHandleType {
  focusAlternativeInput: () => void;
}
