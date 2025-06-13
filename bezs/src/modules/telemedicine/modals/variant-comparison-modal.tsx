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
import { getNucleotideColorClass } from "../utils/dna-analysis-utils";
import { ExternalLink } from "lucide-react";

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
                <div className="rounded-md border border-muted bg-muted/80 p-4">
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
                  <div className="rounded-md border border-muted bg-muted/80 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* ClinVar Assesment */}
                      <div className="rounded-md bg"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogDescription>
          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button className="cursor-pointer">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

// 8:48
