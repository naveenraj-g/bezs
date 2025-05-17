export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    // timeZoneName: "short", // "UTC"
  };

  return date.toLocaleString("en-US", options);
}

export function calculateAge(dob: Date): string {
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (months === 0 && today.getDate() < dob.getDate()) {
    years--;
    months = 11;
  }

  if (years === 0) {
    return `${months} months old`;
  }

  let ageString = `${years} years`;

  if (months > 0) {
    ageString += ` ${months} months`;
  }

  return ageString + " old";
}

export function generateRandomColor(): string {
  let hexColor = "";
  do {
    const randomInt = Math.floor(Math.random() * 16777216);

    hexColor = `#${randomInt.toString(16).padStart(6, "0")}`;
  } while (
    hexColor.toLowerCase() === "#ffffff" ||
    hexColor.toLowerCase() === "#000000"
  ); // Ensure it’s not white or black
  return hexColor;
}
