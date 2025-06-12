"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GeneBoundsType,
  GeneDetailsFromSearchType,
} from "@/modules/telemedicine/types/dna-analysis-types";
import { useCallback, useMemo, useRef, useState } from "react";

type GeneSequencePropsType = {
  geneBounds: GeneBoundsType | null;
  geneDetail: GeneDetailsFromSearchType | null;
  startPosition: string;
  endPosition: string;
  onStartPositionChange: (value: string) => void;
  onEndPositionChange: (value: string) => void;
  sequenceData: string;
  sequenceRange: { start: number; end: number } | null;
  isLoading: boolean;
  error: string | null;
  onSequenceLoadRequest: () => void;
  onSequenceClick: (position: number, nucleotide: string) => void;
  maxViewRange: number;
};

export function GeneSequence({
  geneBounds,
  geneDetail,
  startPosition,
  endPosition,
  onStartPositionChange,
  onEndPositionChange,
  sequenceData,
  sequenceRange,
  isLoading,
  error,
  onSequenceLoadRequest,
  onSequenceClick,
  maxViewRange,
}: GeneSequencePropsType) {
  const [sliderValues, setSliderValues] = useState({ start: 0, end: 100 });
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isDraggingRange, setIsDraggingRange] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<{
    x: number;
    startPos: number;
    endPos: number;
  } | null>(null);

  const currentRangeSize = useMemo(() => {
    const start = parseInt(startPosition);
    const end = parseInt(endPosition);

    return isNaN(start) || isNaN(end) || end < start ? 0 : end - start;
  }, [startPosition, endPosition]);
  // 6:20
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: "start" | "end") => {
      e.preventDefault();
      if (handle === "start") setIsDraggingStart(true);
      else setIsDraggingEnd(true);
    },
    []
  );

  return (
    <Card className="mb-6 py-0 block">
      <CardHeader className="pt-3 pb-3 gap-0">
        <CardTitle className="text-sm font-normal text-zinc-500 dark:text-zinc-300">
          Gene Sequence
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {geneBounds && (
          <div className="mb-4 flex flex-col">
            <div className="mb-2 flex flex-col items-center justify-between text-xs sm:flex-row">
              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300">
                <p className="sm:hidden">From:</p>
                <p>
                  {Math.min(geneBounds.min, geneBounds.max).toLocaleString()}
                </p>
              </span>
              <span className="text-zinc-500 dark:text-zinc-300">
                Selected: {parseInt(startPosition || "0").toLocaleString()} -{" "}
                {parseInt(endPosition || "0").toLocaleString()} (
                {currentRangeSize.toLocaleString()} bp)
              </span>
              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300">
                <p className="sm:hidden">To:</p>
                <p>
                  {Math.max(geneBounds.min, geneBounds.max).toLocaleString()}
                </p>
              </span>
            </div>

            {/* Slider component */}
            <div className="space-y-4">
              <div className="relative">
                <div className="relative h-6 w-full cursor-pointer">
                  {/* Track background */}
                  <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-zinc-200/60"></div>

                  {/* Selected Range */}
                  <div
                    className="absolute top-1/2 h-2 -translate-y-1/2 cursor-grab rounded-full bg-zinc-600 active:cursor-grabbing"
                    style={{
                      left: `${sliderValues.start}%`,
                      width: `${sliderValues.end - sliderValues.start}%`,
                    }}
                  ></div>

                  {/* Start handle */}
                  <div
                    className="absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-zinc-600 bg-white shadow active:cursor-grabbing"
                    style={{ left: `${sliderValues.start}%` }}
                    onMouseDown={(e) => handleMouseDown(e, "start")}
                  >
                    <div className="h-2.5 w-1 rounded-full bg-zinc-600"></div>
                  </div>

                  {/* End handle */}
                  <div
                    className="absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-zinc-600 bg-white shadow active:cursor-grabbing"
                    style={{ left: `${sliderValues.end}%` }}
                    onMouseDown={(e) => handleMouseDown(e, "end")}
                  >
                    <div className="h-2.5 w-1 rounded-full bg-zinc-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
