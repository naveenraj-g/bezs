"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/shared/hooks/useFetch";
import { GenomeAssemblyFormSearchType } from "../../types/dna-analysis-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useDNAanalysisStore } from "../../stores/use-dna-analysis-store";

export const GenomeAssembly = () => {
  const selectedGenome = useDNAanalysisStore((state) => state.selectedGenome);
  const setValue = useDNAanalysisStore((state) => state.setValue);

  const {
    data: genomeData,
    error: genomeError,
    loading: genomeLoading,
  } = useFetch({
    url: "https://api.genome.ucsc.edu/list/ucscGenomes",
    method: "GET",
  });

  const genomesData = genomeData?.ucscGenomes;

  const structuredGenomes: Record<string, GenomeAssemblyFormSearchType[]> = {};

  if (genomesData) {
    for (const genomeId in genomesData) {
      const genomeInfo = genomesData[genomeId];
      const organism = genomeInfo.organism || "Other";

      if (!structuredGenomes[organism]) structuredGenomes[organism] = [];
      structuredGenomes[organism].push({
        id: genomeId,
        name: genomeInfo.description || genomeId,
        sourceName: genomeInfo.sourceName || genomeId,
        active: !!genomeInfo.active,
      });
    }
  }

  const genomes = structuredGenomes["Human"];
  console.log(selectedGenome);

  const handleGenomeChange = (value: string) => {
    setValue({ selectedGenome: value });
  };

  return (
    <Card className="mb-6 py-0 block">
      <CardHeader className="pt-3 pb-3 gap-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-normal text-zinc-500 dark:text-zinc-300 flex gap-2 items-center">
            Genome Assembly
            {genomeLoading && (
              <span className="flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </span>
            )}
          </CardTitle>
          <div className="text-sm text-zinc-500 dark:text-zinc-300">
            Organism: <span className="font-medium">Human</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Select
          value={!genomesData ? undefined : selectedGenome}
          onValueChange={handleGenomeChange}
          disabled={genomeLoading}
        >
          <SelectTrigger className="w-full" disabled={genomeLoading}>
            <SelectValue placeholder="Select genome assembly"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {genomes?.map((genome) => (
              <SelectItem key={genome.id} value={genome.id}>
                {genome.id} - {genome.name}
                {genome.active ? " (active)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedGenome && !genomeError && !genomeLoading && (
          <p className="mt-2 text-xs text-zinc-500/70 dark:text-zinc-300/70">
            {genomes?.find((genome) => genome.id === selectedGenome)?.name}
          </p>
        )}
        {genomeError && !genomeLoading && !genomesData && (
          <p className="mt-2 text-sm text-red-500">
            Failed to get genomes data
          </p>
        )}
      </CardContent>
    </Card>
  );
};
