"use client";

import { Button } from "@/components/ui/button";
import {
  fetchGeneDetails,
  fetchGeneSequence as apiFetchGeneSequence,
} from "@/modules/telemedicine/api-fetch/genome-api";
import { useDNAanalysisStore } from "@/modules/telemedicine/stores/use-dna-analysis-store";
import {
  GeneBoundsType,
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
  const [geneBounds, setGeneBounds] = useState<GeneBoundsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startPosition, setStartPosition] = useState<string>("");
  const [endPosition, setEndPosition] = useState<string>("");
  const [isLoadingSequence, setIsLoadingSequence] = useState(false);

  const [actualRange, setActualRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const fetchGeneSequence = useCallback(
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
          await fetchGeneSequence(fetchedRange.start, fetchedRange.end);
        }
      } catch {
        setError("Failed to load gene information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [gene, genomeId]);

  const handleLoadSequence = useCallback(() => {
    const start = parseInt(startPosition);
    const end = parseInt(endPosition);
    let validationError: string | null = null;

    if (isNaN(start) || isNaN(end)) {
      validationError = "Please enter valid start and end position";
    } else if (start > end) {
      validationError = "Start position must be less than end position";
    } else if (geneBounds) {
      const minBound = Math.min(geneBounds.min, geneBounds.max);
      const maxBound = Math.max(geneBounds.min, geneBounds.max);

      if (start < minBound) {
        validationError = `Start position (${start.toLocaleString()}) is below the minimum value (${minBound.toLocaleString()})`;
      } else if (end > maxBound) {
        validationError = `End position (${end.toLocaleString()}) exceeds the maximum value (${maxBound.toLocaleString()})`;
      }

      if (end - start > 10000) {
        validationError = `Selected range exceeds maximum view range of 10,000 bp.`;
      }
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    fetchGeneSequence(start, end);
  }, [endPosition, fetchGeneSequence, geneBounds, startPosition]);

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
        onSequenceLoadRequest={handleLoadSequence}
        onSequenceClick={() => {}}
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
