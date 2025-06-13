"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  GeneBoundsType,
  GeneDetailsFromSearchType,
} from "@/modules/telemedicine/types/dna-analysis-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
                  />
                </div>
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
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
// 6:44
