export function capitalizeString(word: string) {
  return word
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  // return (
  //   String(word).charAt(0).toUpperCase() + String(word).slice(1).toLowerCase()
  // );
}
