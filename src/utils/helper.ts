export function capitalizeString(word: string) {
  return (
    String(word).charAt(0).toUpperCase() + String(word).slice(1).toLowerCase()
  );
}
