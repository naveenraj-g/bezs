"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  GeneBoundsType,
  GeneDetailsFromSearchType,
} from "@/modules/telemedicine/types/dna-analysis-types";
import { getNucleotideColorClass } from "@/modules/telemedicine/utils/dna-analysis-utils";
import { Loader2 } from "lucide-react";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const currentRangeSize = useMemo(() => {
    const start = parseInt(startPosition);
    const end = parseInt(endPosition);
    return isNaN(start) || isNaN(end) || end < start ? 0 : end - start + 1;
  }, [startPosition, endPosition]);

  useEffect(() => {
    if (!geneBounds) return;

    const minBound = Math.min(geneBounds.min, geneBounds.max);
    const maxBound = Math.max(geneBounds.min, geneBounds.max);
    const totalSize = maxBound - minBound;

    const startNum = parseInt(startPosition);
    const endNum = parseInt(endPosition);

    if (isNaN(startNum) || isNaN(endNum) || totalSize <= 0) {
      setSliderValues({ start: 0, end: 100 });
      return;
    }

    const startPercent = ((startNum - minBound) / totalSize) * 100;
    const endPercent = ((endNum - minBound) / totalSize) * 100;

    setSliderValues({
      start: Math.max(0, Math.min(startPercent, 100)),
      end: Math.max(0, Math.min(endPercent, 100)),
    });
  }, [endPosition, geneBounds, startPosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingStart && !isDraggingEnd && !isDraggingRange) return;
      if (!sliderRef.current || !geneBounds) return;

      const sliderRect = sliderRef.current.getBoundingClientRect();
      const relativeX = e.clientX - sliderRect.left;
      const sliderWidth = sliderRect.width;
      let newPercent = (relativeX / sliderWidth) * 100;
      newPercent = Math.max(0, Math.min(newPercent, 100));

      const minBound = Math.min(geneBounds.min, geneBounds.max);
      const maxBound = Math.max(geneBounds.min, geneBounds.max);
      const geneSize = maxBound - minBound;

      const newPosition = Math.round(minBound + (geneSize * newPercent) / 100);
      const currentStartNum = parseInt(startPosition);
      const currentEndNum = parseInt(endPosition);

      if (isDraggingStart) {
        if (!isNaN(currentEndNum)) {
          if (currentEndNum - newPosition + 1 > maxViewRange) {
            onStartPositionChange(String(currentEndNum - maxViewRange + 1));
          } else if (newPosition < currentEndNum) {
            onStartPositionChange(String(newPosition));
          }
        }
      } else if (isDraggingEnd) {
        if (!isNaN(currentStartNum)) {
          if (newPosition - currentStartNum + 1 > maxViewRange) {
            onEndPositionChange(String(currentStartNum + maxViewRange - 1));
          } else if (newPosition > currentStartNum) {
            onEndPositionChange(String(newPosition));
          }
        }
      } else if (isDraggingRange) {
        if (!dragStartX.current) return;
        const pixelsPerBase = sliderWidth / geneSize;
        const dragDeltaPixels = relativeX - dragStartX.current.x;
        const dragDeltaBases = Math.round(dragDeltaPixels / pixelsPerBase);

        let newStart = dragStartX.current.startPos + dragDeltaBases;
        let newEnd = dragStartX.current.endPos + dragDeltaBases;
        const rangeSize =
          dragStartX.current.endPos - dragStartX.current.startPos;

        if (newStart < minBound) {
          newStart = minBound;
          newEnd = minBound + rangeSize;
        }
        if (newEnd > maxBound) {
          newEnd = maxBound;
          newStart = maxBound - rangeSize;
        }

        onStartPositionChange(String(newStart));
        onEndPositionChange(String(newEnd));
      }
    };

    const handleMouseUp = () => {
      if (
        (isDraggingStart || isDraggingEnd || isDraggingRange) &&
        startPosition &&
        endPosition
      ) {
        onSequenceLoadRequest();
      }
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
      setIsDraggingRange(false);
      dragStartX.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    endPosition,
    geneBounds,
    isDraggingEnd,
    isDraggingRange,
    isDraggingStart,
    maxViewRange,
    onEndPositionChange,
    onSequenceLoadRequest,
    onStartPositionChange,
    startPosition,
  ]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: "start" | "end") => {
      e.preventDefault();
      if (handle === "start") setIsDraggingStart(true);
      else setIsDraggingEnd(true);
    },
    []
  );

  const handleRangeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (!sliderRef.current) return;

      const startNum = parseInt(startPosition);
      const endNum = parseInt(endPosition);

      if (isNaN(startNum) || isNaN(endNum)) return;

      setIsDraggingRange(true);
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const relativeX = e.clientX - sliderRect.left;
      dragStartX.current = {
        x: relativeX,
        startPos: startNum,
        endPos: endNum,
      };
    },
    [startPosition, endPosition]
  );

  const formattedSequence = useMemo(() => {
    if (!sequenceData || !sequenceRange) return null;

    const start = sequenceRange.start;
    const BASES_PER_LINE = 150;
    const lines: JSX.Element[] = [];

    for (let i = 0; i < sequenceData.length; i += BASES_PER_LINE) {
      const lineStartPos = start + i;
      const chunk = sequenceData.substring(i, i + BASES_PER_LINE);
      const colorizedChars: JSX.Element[] = [];

      for (let j = 0; j < chunk.length; j++) {
        const nucleotide = chunk[j] || "";
        const nucleotidePosition = lineStartPos + j;
        const color = getNucleotideColorClass(nucleotide);
        colorizedChars.push(
          <span
            key={j}
            className={`${color} group relative cursor-pointer`}
            onClick={() => onSequenceClick(nucleotidePosition, nucleotide)}
            onMouseEnter={(e) => {
              setHoverPosition(nucleotidePosition);
              setMousePosition({ x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => {
              setHoverPosition(null);
              setMousePosition(null);
            }}
          >
            {nucleotide}
          </span>
        );
      }

      lines.push(
        <div key={i} className="flex">
          <div className="mr-2 w-20 text-right text-gray-500 select-none">
            {lineStartPos.toLocaleString()}
          </div>
          <div className="flex-1 tracking-wide">{colorizedChars}</div>
        </div>
      );
    }

    return lines;
  }, [onSequenceClick, sequenceData, sequenceRange]);

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
                <div
                  ref={sliderRef}
                  className="relative h-6 w-full cursor-pointer"
                >
                  {/* Track background */}
                  <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-zinc-200/60"></div>

                  {/* Selected Range */}
                  <div
                    className="absolute top-1/2 h-2 -translate-y-1/2 cursor-grab rounded-full bg-zinc-600 active:cursor-grabbing"
                    style={{
                      left: `${sliderValues.start}%`,
                      width: `${sliderValues.end - sliderValues.start}%`,
                    }}
                    onMouseDown={handleRangeMouseDown}
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

              {/* Position controls */}
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-300">
                    Start:
                  </span>
                  <Input
                    type="text"
                    value={startPosition}
                    onChange={(e) => onStartPositionChange(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="h-7 w-full"
                  />
                </div>
                <Button
                  size="sm"
                  disabled={isLoading}
                  onClick={onSequenceLoadRequest}
                  className="h-7"
                >
                  {isLoading ? "Loading..." : "Load Sequence"}
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-300">
                    End:
                  </span>
                  <Input
                    type="text"
                    value={endPosition}
                    onChange={(e) => onEndPositionChange(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="h-7 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-300">
            {geneDetail?.genomicinfo?.[0]?.strand === "+"
              ? "Forward strand (5' -> 3')"
              : geneDetail?.genomicinfo?.[0]?.strand === "-"
                ? "Reverse strand (3' <- 5')"
                : "Strand information not available"}
          </span>
          <span className="text-zinc-500 dark:text-zinc-300">
            Maximum window size: {maxViewRange.toLocaleString()} bp
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-2 w-full rounded-md p-3 bg-[#f7f7f7] dark:bg-zinc-700/80">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : sequenceData ? (
            <div className="h-64 overflow-auto">
              <pre className="font-mono text-xs leading-relaxed">
                {formattedSequence}
              </pre>
            </div>
          ) : (
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-300">
              {error ? "Error loading sequence." : "No sequence data loaded."}
            </p>
          )}
        </div>

        {hoverPosition !== null && mousePosition !== null && (
          <div
            className="pointer-events-none fixed z-50 rounded bg-[#3c4d3d] px-2 py-2 text-xs text-white shadow-md"
            style={{
              top: mousePosition.y - 30,
              left: mousePosition.x,
              transform: "translateX(-50%) translateY(-25%)",
            }}
          >
            Position: {hoverPosition.toLocaleString()}
          </div>
        )}

        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-red-600"></div>
            <span className="text-xs text-zinc-500 dark:text-zinc-300">A</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            <span className="text-xs text-zinc-500 dark:text-zinc-300">T</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-600"></div>
            <span className="text-xs text-zinc-500 dark:text-zinc-300">G</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-amber-600"></div>
            <span className="text-xs text-zinc-500 dark:text-zinc-300">C</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
