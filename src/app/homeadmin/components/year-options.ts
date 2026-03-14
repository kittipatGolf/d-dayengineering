export function getRecentYears(totalYears = 5): number[] {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: totalYears }, (_, index) => currentYear - index);
}
