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
