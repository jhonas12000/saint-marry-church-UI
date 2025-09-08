// Parse "YYYY-MM-DD" as a LOCAL date (not UTC)
export function localDateFromYMD(ymd: string): Date {
  if (!ymd) return new Date(NaN);
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1); // local midnight
}

// Format "YYYY-MM-DD" for display using local timezone
export function formatYMDForDisplay(ymd: string): string {
  const dt = localDateFromYMD(ymd);
  return Number.isNaN(dt.getTime()) ? "" : dt.toLocaleDateString();
}

// Today as local "YYYY-MM-DD" (avoids UTC shift)
export function todayLocalYMD(): string {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
