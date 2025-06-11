"use client";

import { GenomeAssembly } from "./genome-assembly";
import { GenomeChromosomes } from "./genome-chromosomes";

export const DnaAnalysis = () => {
  return (
    <>
      <div className="space-y-8 mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">DNA Analysis</h1>
          {/* <p className="text-sm">Manage Appointments.</p> */}
        </div>
      </div>

      <main>
        <GenomeAssembly />
        <GenomeChromosomes />
      </main>
    </>
  );
};
