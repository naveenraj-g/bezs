import axios from "axios";
import {
  AnalysisResultType,
  ClinvarVariantType,
  GeneBoundsType,
  GeneDetailsFromSearchType,
  GeneFromSearchType,
} from "../types/dna-analysis-types";
import { NEXT_PUBLIC_ANALYZE_SINGLE_VARIANT_BASE_URL } from "@/lib/constants/env";

export async function searchGenes(query: string, genome: string) {
  const url = "https://clinicaltables.nlm.nih.gov/api/ncbi_genes/v3/search";
  const params = new URLSearchParams({
    terms: query,
    df: "chromosome,Symbol,description,map_location,type_of_gene",
    ef: "chromosome,Symbol,description,map_location,type_of_gene,GenomicInfo,GeneID",
  });

  const res = await axios.get(url, {
    params: {
      ...Object.fromEntries(params),
    },
  });

  if (res.status !== 200) {
    throw new Error("NCBI API Error");
  }

  const data = res.data;
  const results: GeneFromSearchType[] = [];

  if (data[0] > 0) {
    const fieldMap = data[2];
    const geneIds = fieldMap.GeneID || [];
    for (let i = 0; i < Math.min(10, data[0]); ++i) {
      if (i < data[3].length) {
        try {
          const display = data[3][i];
          let chrom = display[0];
          if (chrom && !chrom.startsWith("chr")) {
            chrom = `chr${chrom}`;
          }
          results.push({
            symbol: display[2],
            name: display[3],
            chrom,
            description: display[3],
            gene_id: geneIds[i] || "",
          });
        } catch {
          continue;
        }
      }
    }
  }

  return { query, genome, results };
}

export async function fetchGeneDetails(geneId: string): Promise<{
  geneDetails: GeneDetailsFromSearchType | null;
  geneBound: GeneBoundsType | null;
  initialRange: { start: number; end: number } | null;
}> {
  try {
    const detailUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${geneId}&retmode=json`;
    const detailsResponse = await fetch(detailUrl);

    if (!detailsResponse.ok) {
      return { geneDetails: null, geneBound: null, initialRange: null };
    }

    const detailData = await detailsResponse.json();

    if (detailData.result && detailData.result[geneId]) {
      const detail = detailData.result[geneId];

      if (detail.genomicinfo && detail.genomicinfo.length > 0) {
        const info = detail.genomicinfo[0];

        const minPos = Math.min(info.chrstart, info.chrstop);
        const maxPos = Math.max(info.chrstart, info.chrstop);
        const bounds = { min: minPos, max: maxPos };

        const geneSize = maxPos - minPos;
        const seqStart = minPos;
        const seqEnd = geneSize > 10000 ? minPos + 10000 : maxPos;
        const range = { start: seqStart, end: seqEnd };

        return { geneDetails: detail, geneBound: bounds, initialRange: range };
      }
    }
    return { geneDetails: null, geneBound: null, initialRange: null };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { geneDetails: null, geneBound: null, initialRange: null };
  }
}

export async function fetchGeneSequence(
  chrom: string,
  start: number,
  end: number,
  genomeId: string
): Promise<{
  sequence: string;
  actualRange: { start: number; end: number };
  error?: string;
}> {
  try {
    const chromosome = chrom.startsWith("chr") ? chrom : `chr${chrom}`;

    const apiStart = start - 1;
    const apiEnd = end;

    const apiUrl = `https://api.genome.ucsc.edu/getData/sequence?genome=${genomeId};chrom=${chromosome};start=${apiStart};end=${apiEnd}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const actualRange = { start, end };

    if (data.error || !data.dna) {
      return { sequence: "", actualRange, error: data.error };
    }

    const sequence = data.dna.toUpperCase();

    return { sequence, actualRange };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return {
      sequence: "",
      actualRange: { start, end },
      error: "Internal errror in fetch gene sequence.",
    };
  }
}

export async function fetchClinvarVariants(
  chrom: string,
  geneBound: GeneBoundsType,
  genomeId: string
): Promise<ClinvarVariantType[]> {
  const chromFormatted = chrom.replace(/^chr/i, "");

  const minBound = Math.min(geneBound.min, geneBound.max);
  const maxBound = Math.max(geneBound.min, geneBound.max);

  const positionField = genomeId === "hg19" ? "chrpos37" : "chrpos38";
  const searchTerm = `${chromFormatted}[chromosome] AND ${minBound}:${maxBound}[${positionField}]`;

  const searchUrl =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
  const searchParams = new URLSearchParams({
    db: "clinvar",
    term: searchTerm,
    retmode: "json",
    retmax: "20",
  });

  const searchResponse = await fetch(`${searchUrl}?${searchParams.toString()}`);

  if (!searchResponse.ok) {
    throw new Error("ClinVar search failed: " + searchResponse.statusText);
  }

  const searchData = await searchResponse.json();

  if (
    !searchData.esearchresult ||
    !searchData.esearchresult.idlist ||
    searchData.esearchresult.idlist.length === 0
  ) {
    return [];
  }

  const variantIds = searchData.esearchresult.idlist;

  const summaryUrl =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";
  const summaryParams = new URLSearchParams({
    db: "clinvar",
    id: variantIds.join(","),
    retmode: "json",
  });

  const summaryResponse = await fetch(
    `${summaryUrl}?${summaryParams.toString()}`
  );

  if (!summaryResponse.ok) {
    throw new Error(
      "Failed to fetch variant details: " + summaryResponse.statusText
    );
  }

  const summaryData = await summaryResponse.json();
  const variants: ClinvarVariantType[] = [];

  if (summaryData.result && summaryData.result.uids) {
    for (const id of summaryData.result.uids) {
      const variant = summaryData.result[id];
      variants.push({
        clinvar_id: id,
        title: variant.title,
        variation_type: (variant.obj_type || "Unknown")
          .split(" ")
          .map(
            (word: string) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),
        classification:
          variant.germline_classification.description || "Unknown",
        gene_sort: variant.gene_sort || "",
        chromosome: chromFormatted,
        location: variant.location_sort
          ? parseInt(variant.location_sort).toLocaleString()
          : "Unknown",
      });
    }
  }

  return variants;
}

export async function analyzeVariantWithAPI({
  alternative,
  chromosome,
  genomeId,
  position,
}: {
  position: number;
  alternative: string;
  genomeId: string;
  chromosome: string;
}): Promise<AnalysisResultType> {
  const queryParams = new URLSearchParams({
    variant_position: position.toString(),
    alternative: alternative,
    genome: genomeId,
    chromosome: chromosome,
  });

  const url = `${NEXT_PUBLIC_ANALYZE_SINGLE_VARIANT_BASE_URL}?${queryParams.toString()}`;

  const response = await fetch(url, { method: "POST" });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to analyze variant " + errorText);
  }

  return await response.json();
}
