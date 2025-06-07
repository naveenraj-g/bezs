export function capitalizeString(word: string) {
  return word
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  // return (
  //   String(word).charAt(0).toUpperCase() + String(word).slice(1).toLowerCase()
  // );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

export function getMimeTypeFilter(
  type: "documents" | "images" | "videos" | "audios" | "others" | undefined
) {
  switch (type) {
    case "documents":
      return {
        OR: [
          { fileType: { startsWith: "application/" } },
          { fileType: { startsWith: "text/" } },
        ],
      };
    case "images":
      return { fileType: { startsWith: "image/" } };
    case "audios":
      return { fileType: { startsWith: "audio/" } };
    case "videos":
      return { fileType: { startsWith: "video/" } };
    case "others":
      return {
        NOT: {
          OR: [
            { fileType: { startsWith: "application/" } },
            { fileType: { startsWith: "text/" } },
            { fileType: { startsWith: "image/" } },
            { fileType: { startsWith: "video/" } },
          ],
        },
      };
    default:
      return {};
  }
}
