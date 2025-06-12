import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GeneBoundsType,
  GeneDetailsFromSearchType,
  GeneFromSearchType,
} from "@/modules/telemedicine/types/dna-analysis-types";
import { ExternalLink } from "lucide-react";

type GeneInformationPropsType = {
  gene: GeneFromSearchType;
  geneDetail: GeneDetailsFromSearchType | null;
  geneBounds: GeneBoundsType | null;
};

export function GeneInformation({
  gene,
  geneDetail,
  geneBounds,
}: GeneInformationPropsType) {
  return (
    <Card className="mb-6 py-0 block">
      <CardHeader className="pt-3 pb-3 gap-0">
        <CardTitle className="text-sm font-normal text-zinc-500 dark:text-zinc-300">
          Gene Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex">
              <span className="w-28 min-w-28 text-xs text-zinc-500 dark:text-zinc-300">
                Symbol:
              </span>
              <span className="text-xs">{gene.symbol}</span>
            </div>
            <div className="flex">
              <span className="w-28 min-w-28 text-xs text-zinc-500 dark:text-zinc-300">
                Name:
              </span>
              <span className="text-xs">{gene.name}</span>
            </div>
            {gene.description && gene.description !== gene.name && (
              <div className="flex">
                <span className="w-28 min-w-28 text-xs text-zinc-500 dark:text-zinc-300">
                  Description:
                </span>
                <span className="text-xs">{gene.description}</span>
              </div>
            )}
            <div className="flex">
              <span className="w-28 min-w-28 text-xs text-zinc-500 dark:text-zinc-300">
                Chromosome:
              </span>
              <span className="text-xs">{gene.chrom}</span>
            </div>
            {geneBounds && (
              <div className="flex">
                <span className="w-28 min-w-28 text-xs text-zinc-500 dark:text-zinc-300">
                  Position:
                </span>
                <span className="text-xs">
                  {Math.min(geneBounds.min, geneBounds.max).toLocaleString()} -{" "}
                  {Math.max(geneBounds.min, geneBounds.max).toLocaleString()} (
                  {Math.abs(
                    geneBounds.max - geneBounds.min + 1
                  ).toLocaleString()}{" "}
                  bp)
                  {geneDetail?.genomicinfo?.[0].strand === "-" &&
                    " reverse strand"}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {gene.gene_id && (
              <div className="flex">
                <span className="w-28 min-w-28 text-xs text-zinc-500 dark:text-zinc-300">
                  Gene ID:
                </span>
                <span className="text-xs">
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/gene/${gene.gene_id}`}
                    target="_blank"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    {gene.gene_id}{" "}
                    <ExternalLink className="mr-1 inline-block h-2.5 w-2.5" />
                  </a>
                </span>
              </div>
            )}
            {geneDetail?.organism && (
              <div className="flex ">
                <span className="w-28 text-xs text-zinc-500 dark:text-zinc-300">
                  Organism:
                </span>
                <span className="text-xs">
                  {geneDetail.organism.scientificname}{" "}
                  {geneDetail.organism.commonname &&
                    ` (${geneDetail.organism.commonname})`}
                </span>
              </div>
            )}
            {geneDetail?.summary && (
              <div className="mt-4">
                <h3 className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-300">
                  Summary:
                </h3>
                <p className="text-xs leading-relaxed text-zinc-500/80 dark:text-zinc-300/80">
                  {geneDetail.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
