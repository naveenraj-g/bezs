"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useDNAanalysisModal } from "../stores/use-dna-analysis-modal-store";
import {
  getClassificationColorClasses,
  getNucleotideColorClass,
} from "../utils/dna-analysis-utils";
import { Check, ExternalLink, Shield } from "lucide-react";

export const VariantComparisonModal = () => {
  const closeModal = useDNAanalysisModal((state) => state.onClose);
  const modalType = useDNAanalysisModal((state) => state.type);
  const isOpen = useDNAanalysisModal((state) => state.isOpen);
  const comparisonVariant =
    useDNAanalysisModal((state) => state.comparisonVariantData) || null;

  const isModalOpen = isOpen && modalType === "variantComparison";

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="mb-2 text-lg">
            Variant Analysis Comparison
          </DialogTitle>
          <DialogDescription className="mb-6 text-md" asChild>
            {comparisonVariant && comparisonVariant.evo2Result && (
              <div className="space-y-6">
                <div className="rounded-md border border-muted bg-muted/80 dark:bg-[#252525] p-4">
                  <h4 className="mb-3 text-sm font-medium">
                    Variant Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="text-xs w-28">Position:</span>
                          <span className="text-xs">
                            {comparisonVariant.location}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-xs w-28">Type:</span>
                          <span className="text-xs">
                            {comparisonVariant.variation_type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="space-y-2">
                        <div className="flex">
                          <span className="text-xs w-28">Variant:</span>
                          <span className="font-mono text-xs">
                            {(() => {
                              const match =
                                comparisonVariant.title.match(/(\w)>(\w)/);
                              if (match && match.length === 3) {
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                const [_, ref, alt] = match;
                                return (
                                  <>
                                    <span
                                      className={getNucleotideColorClass(ref)}
                                    >
                                      {ref}
                                    </span>
                                    <span>{">"}</span>
                                    <span
                                      className={getNucleotideColorClass(alt)}
                                    >
                                      {alt}
                                    </span>
                                  </>
                                );
                              }
                              return comparisonVariant.title;
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs w-28">ClinVar ID</span>
                          <a
                            href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${comparisonVariant.clinvar_id}`}
                            className="text-xs text-blue-500 hover:underline"
                            target="_blank"
                          >
                            {comparisonVariant.clinvar_id}
                          </a>
                          <ExternalLink className="ml-0.5 !h-3 !w-3 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variant results */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">
                    Analysis Comparison
                  </h4>
                  <div className="rounded-md border border-muted bg-muted/20 p-3">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* ClinVar Assesment */}
                      <div className="rounded-md bg-muted/80 dark:bg-[#252525] p-4">
                        <h5 className="mb-2 flex items-center gap-2 text-xs font-medium">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#fff] dark:bg-[#ddd]">
                            <span className="h-3 w-3 rounded-full bg-[#333]"></span>
                          </span>
                          ClinVar Assessment
                        </h5>
                        <div className="mt-2">
                          <div
                            className={`w-fit rounded-md px-2 py-1 text-xs font-normal ${getClassificationColorClasses(comparisonVariant.classification)}`}
                          >
                            {comparisonVariant.classification ||
                              "unknown significance"}
                          </div>
                        </div>
                      </div>

                      {/* Evo2 Prediction */}
                      <div className="rounded-md bg-muted/80 dark:bg-[#252525] p-4">
                        <h5 className="mb-2 flex items-center gap-2 text-xs font-medium">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#fff] dark:bg-[#ddd]">
                            <span className="h-3 w-3 rounded-full bg-[#de8246]"></span>
                          </span>
                          Evo2 Prediction
                        </h5>
                        <div className="mt-2">
                          <div
                            className={`flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-normal ${getClassificationColorClasses(comparisonVariant.evo2Result.prediction)}`}
                          >
                            <Shield className="w-3 h-3" />
                            {comparisonVariant.evo2Result.prediction}
                          </div>
                        </div>
                        {/* Delta score */}
                        <div className="mt-3">
                          <div className="mb-1 text-xs">
                            Delta Likelihood Score:
                          </div>
                          <div className="text-sm font-medium text-black dark:text-white">
                            {comparisonVariant.evo2Result.delta_score.toFixed(
                              6
                            )}
                          </div>
                          <div className="text-xs">
                            {comparisonVariant.evo2Result.delta_score < 0
                              ? "Negative score indicates loss of function"
                              : "Positive score indicates fain/neutral function"}
                          </div>
                        </div>
                        {/* Confidence bar */}
                        <div className="mt-3">
                          <div className="mb-1 text-xs">Confidence:</div>
                          <div className="mt-1 h-2 w-full rounded-full bg-[#e7e7e7] dark:bg-[#c0c0c0]">
                            <div
                              className={`h-2 rounded-full ${comparisonVariant.evo2Result.prediction.includes("pathogenic") ? "bg-red-600" : "bg-green-600"}`}
                              style={{
                                width: `${Math.min(100, comparisonVariant.evo2Result.classification_confidence * 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="mt-1 text-right text-xs">
                            {Math.round(
                              comparisonVariant.evo2Result
                                .classification_confidence * 100
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assesment Agreement */}
                    <div className="mt-4 rounded-md bg-muted/80 dark:bg-[#252525] text-xs p-3 leading-relaxed">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${comparisonVariant.classification.toLowerCase() === comparisonVariant.evo2Result.prediction.toLowerCase() ? "bg-green-100" : "bg-yellow-100"}`}
                        >
                          {comparisonVariant.classification.toLowerCase() ===
                          comparisonVariant.evo2Result.prediction.toLowerCase() ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <span className="flex h-3 w-3 items-center justify-center text-yellow-600">
                              <p>!</p>
                            </span>
                          )}
                        </span>
                        <span className="font-medium">
                          {comparisonVariant.classification.toLowerCase() ===
                          comparisonVariant.evo2Result.prediction.toLowerCase()
                            ? "Evo2 prediction agrees with ClinVar classification"
                            : "Evo2 prediction differs from ClinVar classification"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button className="cursor-pointer" size="sm">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

// 9:05
