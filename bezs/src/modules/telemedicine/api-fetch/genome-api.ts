import axios from "axios";
import { GeneFromSearchType } from "../types/dna-analysis-types";

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
    const geneIds = fieldMap.GeneId || [];
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
