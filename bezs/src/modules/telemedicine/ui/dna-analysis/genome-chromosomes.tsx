import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/shared/hooks/useFetch";
import {
  ChromosomeFromSearchType,
  GeneFromSearchType,
} from "../../types/dna-analysis-types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { searchGenes } from "../../api-fetch/genome-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDNAanalysisStore } from "../../stores/use-dna-analysis-store";

type ModeType = "browse" | "search";

export const GenomeChromosomes = () => {
  const selectedGenome = useDNAanalysisStore((state) => state.selectedGenome);
  const selectedChromosome = useDNAanalysisStore(
    (state) => state.selectedChromosome
  );
  const setValue = useDNAanalysisStore((state) => state.setValue);
  const setSelectedGene = useDNAanalysisStore((state) => state.setSelectedGene);

  const {
    data: chromosomeData,
    error: chromosomeDataError,
    loading: chromosomeDataLoading,
    refetch,
  } = useFetch<{ chromosomes: Record<string, number> }>({
    url: "https://api.genome.ucsc.edu/list/chromosomes",
    method: "GET",
    params: { genome: selectedGenome },
    immediate: !!selectedGenome,
  });

  const [chromosomesDT, setChromosomeDT] = useState<ChromosomeFromSearchType[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeneFromSearchType[]>([]);
  const [mode, setMode] = useState<ModeType>("search");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGenome) {
      refetch({ refetchParams: { genome: selectedGenome } });
    }
  }, [selectedGenome, refetch]);

  useEffect(() => {
    const chromosomesData = chromosomeData?.chromosomes;
    if (!chromosomesData) return;

    const chromosomes: ChromosomeFromSearchType[] = [];

    for (const chromId in chromosomesData) {
      if (
        chromId.includes("_") ||
        chromId.includes("Un") ||
        chromId.includes("random")
      )
        continue;

      chromosomes.push({
        name: chromId,
        size: chromosomesData[chromId],
      });
    }

    chromosomes.sort((a, b) => {
      const anum = a.name.replace("chr", "");
      const bnum = b.name.replace("chr", "");

      const isNumA = /^\d+$/.test(anum);
      const isNumB = /^\d+$/.test(bnum);

      if (isNumA && isNumB) return Number(anum) - Number(bnum);
      if (isNumA) return -1;
      if (isNumB) return 1;

      return anum.localeCompare(bnum);
    });

    setChromosomeDT(chromosomes);
    setValue({ selectedChromosome: chromosomes[0].name });
  }, [chromosomeData, setValue]);

  const performGeneSearch = async (
    query: string,
    genome: string,
    filterFn?: (gene: GeneFromSearchType) => boolean
  ) => {
    try {
      setIsLoading(true);
      const data = await searchGenes(query, genome);
      const results = filterFn ? data.results.filter(filterFn) : data.results;
      setSearchResults(results);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to search genes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChromosome || mode !== "browse") return;
    performGeneSearch(
      selectedChromosome,
      selectedGenome,
      (gene: GeneFromSearchType) => gene.chrom === selectedChromosome
    );
  }, [selectedGenome, selectedChromosome, mode]);

  useEffect(() => {
    if (selectedGenome) {
      setSearchResults([]);
      setSelectedGene({ selectedGene: null });
    }
  }, [selectedGenome, setSelectedGene]);

  const switchMode = (newMode: ModeType) => {
    if (newMode === mode) return;

    setSearchResults([]);
    setSelectedGene({ selectedGene: null });
    setError(null);

    if (newMode === "browse" && selectedChromosome) {
      performGeneSearch(
        selectedChromosome,
        selectedGenome,
        (gene: GeneFromSearchType) => gene.chrom === selectedChromosome
      );
    }

    setMode(newMode);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    // Perform gene search
    performGeneSearch(searchQuery, selectedGenome);
  };

  const loadBRCAA1Example = () => {
    setMode("search");
    setSearchQuery("BRCA1");
    performGeneSearch("BRCA1", selectedGenome);
  };

  return (
    <Card className="mb-6 py-0 block">
      <CardHeader className="pt-3 pb-3 block">
        <CardTitle className="flex items-center gap-2 text-sm font-normal text-zinc-500 dark:text-zinc-300">
          Browse
          {chromosomeDataLoading && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Loader2 className="animate-spin w-4 h-4" /> Loading...
            </p>
          )}
          {chromosomeDataError && (
            <p className="text-xs text-red-500">Error: {chromosomeDataError}</p>
          )}
        </CardTitle>
        <CardContent className="px-0 mt-2">
          <Tabs
            value={mode}
            onValueChange={(value) => switchMode(value as ModeType)}
          >
            <TabsList>
              <TabsTrigger value="search" className="cursor-pointer">
                Search Genes
              </TabsTrigger>
              <TabsTrigger value="browse" className="cursor-pointer">
                Browse Chromosomes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-2">
              <div className="space-y-4">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <div className="relative flex-1">
                    <Input
                      className="pr-10"
                      type="text"
                      placeholder="Enter gene symbol or name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      className="absolute top-0 right-0 h-full cursor-pointer rounded-l-none"
                      disabled={chromosomeDataLoading || !searchQuery.trim()}
                      size="icon"
                    >
                      <Search />
                      <span className="sr-only">Search</span>
                    </Button>
                  </div>
                </form>
                <Button
                  size="sm"
                  variant="link"
                  className="h-auto p-0 text-primary hover:text-primary/80 decoration-primary"
                  onClick={loadBRCAA1Example}
                >
                  Try BRCA1 example
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="browse" className="mt-2">
              <div className="max-h-[150px] overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  {chromosomesDT.map((chrom) => (
                    <Button
                      key={chrom.name}
                      variant="outline"
                      size="sm"
                      className={`${selectedChromosome === chrom.name ? "bg-secondary dark:bg-[#fff] dark:text-black" : undefined}`}
                      onClick={() =>
                        setValue({ selectedChromosome: chrom.name })
                      }
                      disabled={chromosomeDataLoading}
                    >
                      {chrom.name}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="flex justify-center mt-4">
              <div>
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-2 rounded-md border border-red-200 bg-red-50 text-red-500">
              {error || "An error occurred."}
            </div>
          )}

          {searchResults.length > 0 && !isLoading && (
            <div className="mt-6">
              <div className="mb-2">
                <h4 className="text-sm font-normal text-zinc-500 dark:text-zinc-300">
                  {mode === "search" ? (
                    <>
                      Search Results:{" "}
                      <span className="text-black dark:text-white">
                        {searchResults.length} genes
                      </span>
                    </>
                  ) : (
                    <>
                      Genes on {selectedChromosome}:{" "}
                      <span className="text-black dark:text-white">
                        {searchResults.length} found
                      </span>
                    </>
                  )}
                </h4>
              </div>

              <div className="overflow-hidden border rounded-md border-muted">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/80">
                      <TableHead className="text-xs">Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((gene, index) => (
                      <TableRow
                        key={`${gene.symbol}-${index}`}
                        className="cursor-pointer border-b"
                        onClick={() => setSelectedGene({ selectedGene: gene })}
                      >
                        <TableCell className="py-2 font-medium">
                          {gene.symbol}
                        </TableCell>
                        <TableCell className="py-2 font-medium">
                          {gene.name}
                        </TableCell>
                        <TableCell className="py-2 font-medium">
                          {gene.chrom}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!isLoading && !error && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-36 text-gray-400">
              <Search className="mb-4 h-10 w-10 text-gray-400" />
              <p className="text-sm leading-relaxed">
                {mode === "search"
                  ? "Enter a gene or symbol and click search"
                  : selectedChromosome
                    ? "No genes found on this chromosome"
                    : "Select a chromosome to view genes"}
              </p>
            </div>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
