"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { analyzeVariantWithAPI } from "@/modules/telemedicine/api-fetch/genome-api";
import {
  AnalysisResultType,
  ClinvarVariantType,
  GeneBoundsType,
  GeneFromSearchType,
  VariantAnalysisHandleType,
} from "@/modules/telemedicine/types/dna-analysis-types";
import {
  getClassificationColorClasses,
  getNucleotideColorClass,
} from "@/modules/telemedicine/utils/dna-analysis-utils";
import { Loader2, Zap } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type VariantAnalysisPropsType = {
  gene: GeneFromSearchType;
  genomeId: string;
  chromosome: string;
  clinvarVariants: Array<ClinvarVariantType>;
  referenceSequence: string | null;
  sequencePosition: number | null;
  geneBounds: GeneBoundsType | null;
};

export const VariantAnalysis = forwardRef<
  VariantAnalysisHandleType,
  VariantAnalysisPropsType
>(
  (
    {
      chromosome,
      clinvarVariants = [],
      gene,
      geneBounds,
      genomeId,
      referenceSequence,
      sequencePosition,
    }: VariantAnalysisPropsType,
    ref
  ) => {
    const [variantPosition, setVariantPosition] = useState<string>(
      geneBounds?.min.toString() || ""
    );
    const [variantReference, setVariantReference] = useState("");
    const [variantAlternative, setVariantAlternative] = useState("");
    const [variantResult, setVariantResult] =
      useState<AnalysisResultType | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [variantError, setVariantError] = useState<string | null>(null);

    const alternativeInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusAlternativeInput: () => {
        if (alternativeInputRef.current) {
          alternativeInputRef.current.focus();
        }
      },
    }));

    useEffect(() => {
      if (sequencePosition && referenceSequence) {
        setVariantPosition(String(sequencePosition));
        setVariantReference(referenceSequence);
      }
    }, [sequencePosition, referenceSequence]);

    const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVariantPosition(e.target.value);
      setVariantReference("");
    };

    const handleVariantSubmit = async (pos: string, alt: string) => {
      const position = parseInt(pos);
      if (isNaN(position)) {
        setVariantError("Please enter a valid position number");
        return;
      }

      const validNucleotides = /^[ATGC]$/;
      if (!validNucleotides.test(alt)) {
        setVariantError("Nucleotids must be A, C, G or T");
        return;
      }

      setIsAnalyzing(true);
      setVariantError(null);
      try {
        const data = await analyzeVariantWithAPI({
          position,
          alternative: alt,
          genomeId,
          chromosome,
        });
        setVariantResult(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setVariantError("Failed to analyze variant");
      } finally {
        setIsAnalyzing(false);
      }
    };

    return (
      <Card className="mb-6 py-0 block">
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-normal text-zinc-500 dark:text-zinc-300">
            Variant Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-300">
            Predict the impact of genetic variants using the Evo2 deep learning
            model.
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-300">
                Position
              </label>
              <Input
                value={variantPosition}
                onChange={handlePositionChange}
                className="h-8 w-32 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-300">
                Alternative (variant)
              </label>
              <Input
                ref={alternativeInputRef}
                value={variantAlternative}
                onChange={(e) =>
                  setVariantAlternative(e.target.value.toUpperCase())
                }
                className="h-8 w-32 text-xs"
                placeholder="e.g., T"
                maxLength={1}
              />
            </div>
            {variantReference && (
              <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-300">
                <span>Substitution</span>
                <span
                  className={`font-medium ${getNucleotideColorClass(variantReference)}`}
                >
                  {variantReference}
                </span>
                <span>→</span>
                <span
                  className={`font-medium ${getNucleotideColorClass(variantAlternative)}`}
                >
                  {variantAlternative ? variantAlternative : "?"}
                </span>
              </div>
            )}
            <Button
              size="sm"
              className="h-8 text-xs"
              disabled={isAnalyzing || !variantAlternative || !variantPosition}
              onClick={() =>
                handleVariantSubmit(
                  variantPosition.replaceAll(",", ""),
                  variantAlternative
                )
              }
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="animate-spin" /> Analyzing...
                </span>
              ) : (
                "Analyze variant"
              )}
            </Button>
          </div>

          {variantPosition &&
            clinvarVariants
              .filter(
                (variant) =>
                  variant.variation_type
                    .toLowerCase()
                    .includes("single nucleotide") &&
                  parseInt(variant?.location?.replaceAll(",", "")) ===
                    parseInt(variantPosition.replaceAll(",", ""))
              )
              .map((matchedVariant) => {
                const refAltMatch = matchedVariant.title.match(/(\w)>(\w)/);

                let ref = null;
                let alt = null;

                if (refAltMatch && refAltMatch.length === 3) {
                  ref = refAltMatch[1];
                  alt = refAltMatch[2];
                }

                if (!ref || !alt) return null;

                return (
                  <div
                    key={matchedVariant.clinvar_id}
                    className="mt-4 p-4 rounded-md border"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
                        Known Variant Detected
                      </h4>
                      <span className="text-xs text-zinc-500 dark:text-zinc-300">
                        Position: {matchedVariant.location}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-300">
                          Variant Details
                        </div>
                        <div className="text-sm">{matchedVariant.title}</div>
                        <div className="mt-2 text-sm">
                          {gene.symbol} {variantPosition}{" "}
                          <span className="font-mono">
                            <span className={getNucleotideColorClass(ref)}>
                              {ref}
                            </span>
                            <span>{">"}</span>
                            <span className={getNucleotideColorClass(alt)}>
                              {alt}
                            </span>
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-300">
                          ClinVar classification
                          <span
                            className={`ml-1 rounded-sm px-2 py-0.5 ${getClassificationColorClasses(matchedVariant.classification)}`}
                          >
                            {matchedVariant.classification || "unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button
                          size="sm"
                          className="h-8 text-xs"
                          disabled={isAnalyzing}
                          onClick={() => {
                            setVariantAlternative(alt);
                            handleVariantSubmit(
                              variantPosition.replaceAll(",", ""),
                              alt
                            );
                          }}
                        >
                          {isAnalyzing ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="animate-spin" /> Analyzing...
                            </span>
                          ) : (
                            <>
                              <Zap className="mr-1 inline-block h-3 w-3" />
                              Analyze this variant
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })[0]}
          {variantError && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-xs text-red-600">
              {variantError}
            </div>
          )}
          {variantResult && (
            <div className="mt-6 rounded-md border p-4">
              <h4 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-300">
                Analysis Result
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-300">
                      Variant
                    </div>
                    <div className="text-sm">
                      {gene?.symbol} {variantResult.position}{" "}
                      <span className="font-mono">
                        {variantResult.reference}
                        {">"}
                        {variantResult.alternative}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-300">
                      Delta likelihood score
                    </div>
                    <div className="text-sm">
                      {variantResult.delta_score.toFixed(6)}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-300">
                      Negative score indicate loss of function
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-300">
                    Prediction
                  </div>
                  <div
                    className={`inline-block rounded-lg px-3 py-1 text-xs ${getClassificationColorClasses(variantResult.prediction)}`}
                  >
                    {variantResult.prediction}
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-300">
                      Confidence
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted/80 dark:bg-[#252525]">
                      <div
                        className={`h-2 rounded-full ${variantResult.prediction.includes("pathogenic") ? "bg-red-600" : "bg-green-600"}`}
                        style={{
                          width: `${Math.min(100, variantResult.classification_confidence * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-300">
                      {Math.round(
                        variantResult.classification_confidence * 100
                      )}
                      %
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
);

VariantAnalysis.displayName = "VariantAnalysis";
