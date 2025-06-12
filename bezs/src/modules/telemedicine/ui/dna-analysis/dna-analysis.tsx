"use client";

import { useDNAanalysisStore } from "../../stores/use-dna-analysis-store";
import GeneViewer from "./gene/gene-viewer";
import { GenomeAssembly } from "./genome-assembly";
import { GenomeChromosomes } from "./genome-chromosomes";

export const DnaAnalysis = () => {
  const selectedGene = useDNAanalysisStore((state) => state.selectedGene);
  const setSelectedGene = useDNAanalysisStore((state) => state.setSelectedGene);

  return (
    <>
      <div className="space-y-8 mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">DNA Analysis</h1>
          {/* <p className="text-sm">Manage Appointments.</p> */}
        </div>
      </div>

      <main>
        {selectedGene ? (
          <>
            <GeneViewer
              onClose={() => setSelectedGene({ selectedGene: null })}
            />
          </>
        ) : (
          <>
            <GenomeAssembly />
            <GenomeChromosomes />
          </>
        )}
      </main>
    </>
  );
};
