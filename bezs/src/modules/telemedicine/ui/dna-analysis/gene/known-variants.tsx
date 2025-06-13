"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { analyzeVariantWithAPI } from "@/modules/telemedicine/api-fetch/genome-api";
import { useDNAanalysisModal } from "@/modules/telemedicine/stores/use-dna-analysis-modal-store";
import {
  ClinvarVariantType,
  GeneFromSearchType,
} from "@/modules/telemedicine/types/dna-analysis-types";
import { getClassificationColorClasses } from "@/modules/telemedicine/utils/dna-analysis-utils";
import {
  BarChart2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Zap,
} from "lucide-react";

type KnownVariantsPropsType = {
  refereshVariants: () => void;
  showComparison: (variant: ClinvarVariantType) => void;
  updateClinvarVariant: (id: string, newVariant: ClinvarVariantType) => void;
  clinvarVariant: ClinvarVariantType[];
  isLoadingClinvar: boolean;
  clinvarError: string | null;
  genomeId: string;
  gene: GeneFromSearchType;
};

export function KnownVariants({
  clinvarError,
  clinvarVariant,
  gene,
  genomeId,
  isLoadingClinvar,
  refereshVariants,
  showComparison,
  updateClinvarVariant,
}: KnownVariantsPropsType) {
  const openModal = useDNAanalysisModal((state) => state.onOpen);

  const analyzeVariant = async (variant: ClinvarVariantType) => {
    let variantDetails = null;
    const position = variant.location
      ? parseInt(variant.location.replaceAll(",", ""))
      : null;

    const refAltMatch = variant.title.match(/(\w)>(\w)/);

    if (refAltMatch && refAltMatch.length === 3) {
      variantDetails = {
        position,
        reference: refAltMatch[1],
        alternative: refAltMatch[2],
      };
    }

    if (
      !variantDetails ||
      !variantDetails.position ||
      !variantDetails.reference ||
      !variantDetails.alternative
    ) {
      return;
    }

    updateClinvarVariant(variant.clinvar_id, {
      ...variant,
      isAnalyzing: true,
    });

    try {
      const data = await analyzeVariantWithAPI({
        position: variantDetails.position,
        alternative: variantDetails.alternative,
        genomeId: genomeId,
        chromosome: gene.chrom,
      });

      const updatedVariant: ClinvarVariantType = {
        ...variant,
        isAnalyzing: false,
        evo2Result: data,
      };

      updateClinvarVariant(variant.clinvar_id, updatedVariant);

      showComparison(updatedVariant);
    } catch (err) {
      updateClinvarVariant(variant.clinvar_id, {
        ...variant,
        isAnalyzing: false,
        evo2Error: err instanceof Error ? err.message : "Analysis failed",
      });
    }
  };

  return (
    <Card className="mb-6 py-0 block">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-sm font-normal text-zinc-500 dark:text-zinc-300">
          Know Variants in Gene from ClinVar
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={refereshVariants}
          disabled={isLoadingClinvar}
        >
          <RefreshCw
            className={`!h-3.5 !w-3.5 ${isLoadingClinvar ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        {clinvarError && (
          <div className="mb-4 rounded-md p-3 bg-red-50 text-xs text-red-600">
            {clinvarError}
          </div>
        )}

        {isLoadingClinvar ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin" />
          </div>
        ) : clinvarVariant.length > 0 ? (
          <div className="h-96 max-h-96 overflow-y-auto rounded-md border border-muted">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/80">
                  <TableHead className="text-xs">Variant</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">
                    Clinical Significance
                  </TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinvarVariant.map((variant) => (
                  <TableRow key={variant.clinvar_id}>
                    <TableCell className="py-2">
                      <div className="text-xs font-medium">{variant.title}</div>
                      <div className="text-xs font-medium mt-1 flex items-center gap-1 text-zinc-500 dark:text-zinc-300">
                        <p>Location: {variant.location}</p>
                        <Button
                          size="sm"
                          variant="link"
                          className="h-6 px-0 text-xs text-blue-500"
                          onClick={() =>
                            window.open(
                              `https://www.ncbi.nlm.nih.gov/clinvar/variation/${variant.clinvar_id}`,
                              "_blank"
                            )
                          }
                        >
                          View in ClinVar
                          <ExternalLink className="-ml-1 inline-block !h-2.5 !w-2.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      {variant.variation_type}
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div
                        className={`w-fit rounded-md px-2 py-1 text-center font-normal ${getClassificationColorClasses(variant.classification)}`}
                      >
                        {variant.classification || "Unknown"}
                      </div>
                      {variant.evo2Result && (
                        <div className="mt-2">
                          <div
                            className={`flex w-fit items-center gap-1 rounded-md px-2 py-1 text-center ${getClassificationColorClasses(variant.evo2Result.prediction)}`}
                          >
                            <Shield className="!h-3 !w-3" />
                            <span>Evo2: {variant.evo2Result.prediction}</span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-2 text-xs">
                      <div className="flex flex-col items-end gap-1">
                        {variant.variation_type
                          .toLowerCase()
                          .includes("single nucleotide") ? (
                          !variant.evo2Result ? (
                            <Button
                              size="sm"
                              className="h-7 text-xs px-3"
                              disabled={variant.isAnalyzing}
                              onClick={() => analyzeVariant(variant)}
                            >
                              {variant.isAnalyzing ? (
                                <span className="flex items-center">
                                  <Loader2 className="mr-1 !w-3 !h-3 animate-spin" />{" "}
                                  Analyzing...
                                </span>
                              ) : (
                                <>
                                  <Zap className="mr-0.5 inline-block !h-3 !w-3" />
                                  {"Analyze with Evo2"}
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="h-7 text-xs px-3 border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                              onClick={() => {
                                showComparison(variant);
                                openModal({
                                  type: "variantComparison",
                                  comparisonVariantData: variant,
                                });
                              }}
                            >
                              <BarChart2 className="inline-block !h-3 !w-3" />
                              Compare Results
                            </Button>
                          )
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <Search className="mb-4 h-10 w-10" />
            <p className="text-sm leading-relaxed">
              No ClinVar variants found for this gene.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 7:49
