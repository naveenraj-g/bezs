"use client";

import { Button } from "@/components/ui/button";
import {
  fetchGeneDetails,
  fetchGeneSequence as apiFetchGeneSequence,
} from "@/modules/telemedicine/api-fetch/genome-api";
import { useDNAanalysisStore } from "@/modules/telemedicine/stores/use-dna-analysis-store";
import {
  GeneBounceType,
  GeneDetailsFromSearchType,
} from "@/modules/telemedicine/types/dna-analysis-types";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GeneInformation } from "./gene-information";
import { GeneSequence } from "./gene-sequence";

type GeneViewerPropsType = {
  onClose: () => void;
};

export default function GeneViewer({ onClose }: GeneViewerPropsType) {
  const gene = useDNAanalysisStore((state) => state.selectedGene)!;
  const genomeId = useDNAanalysisStore((state) => state.selectedGenome);

  const [geneSequence, setGeneSquence] = useState("");
  const [geneDetail, setGeneDetail] =
    useState<GeneDetailsFromSearchType | null>(null);
  const [geneBounds, setGeneBounds] = useState<GeneBounceType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startPosition, setStartPosition] = useState<string>("");
  const [endPosition, setEndPosition] = useState<string>("");
  const [isLoadingSequence, setIsLoadingSequence] = useState(false);

  const [actualRange, setActualRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const fetchGenneSequence = useCallback(
    async (start: number, end: number) => {
      try {
        setIsLoadingSequence(true);
        setError(null);
        const {
          sequence,
          actualRange: fetchedRange,
          error: apiError,
        } = await apiFetchGeneSequence(gene.chrom, start, end, genomeId);

        setGeneSquence(sequence);
        setActualRange(fetchedRange);

        if (apiError) {
          setError(apiError);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load sequence data.");
      } finally {
        setIsLoadingSequence(false);
      }
    },
    [gene.chrom, genomeId]
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      setGeneDetail(null);
      setStartPosition("");
      setEndPosition("");

      if (!gene.gene_id) {
        setError("Gene ID is missing, cannot fet details.");
        setIsLoading(false);
        return;
      }

      try {
        const {
          geneDetails: fetchedDetail,
          geneBound: fetchedGeneBounds,
          initialRange: fetchedRange,
        } = await fetchGeneDetails(gene.gene_id);

        setGeneDetail(fetchedDetail);
        setGeneBounds(fetchedGeneBounds);

        if (fetchedRange) {
          setStartPosition(String(fetchedRange.start));
          setEndPosition(String(fetchedRange.end));

          // Fetch gene sequence
          await fetchGenneSequence(fetchedRange.start, fetchedRange.end);
        }
      } catch {
        setError("Failed to load gene information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [gene, genomeId]);

  return (
    <div className="space-y-6">
      <Button
        size="sm"
        variant="ghost"
        className="text-zinc-500 dark:text-zinc-300"
        onClick={onClose}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to results
      </Button>

      <GeneSequence
        geneBounds={geneBounds}
        geneDetail={geneDetail}
        startPosition={startPosition}
        endPosition={endPosition}
        onStartPositionChange={setStartPosition}
        onEndPositionChange={setEndPosition}
        sequenceData={geneSequence}
        sequenceRange={actualRange}
        isLoading={isLoadingSequence}
        error={error}
        onSequenceLoadRequest={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSequenceClick={function (position: number, nucleotide: string): void {
          throw new Error("Function not implemented.");
        }}
        maxViewRange={10000}
      />
      <GeneInformation
        gene={gene}
        geneDetail={geneDetail}
        geneBounds={geneBounds}
      />
    </div>
  );
}
