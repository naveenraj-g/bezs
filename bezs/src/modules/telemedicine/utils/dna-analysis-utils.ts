export function getNucleotideColorClass(nucleotide: string): string {
  switch (nucleotide.toUpperCase()) {
    case "A":
      return "text-red-600";
    case "T":
      return "text-blue-600";
    case "G":
      return "text-green-600";
    case "C":
      return "text-amber-600";
    default:
      return "text-gray-500";
  }
}
