export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 KB';

  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    // Return with 1 decimal place for MB
    return `${mb.toFixed(1)} MB`;
  }

  const kb = bytes / 1024;
  // Return with 0 decimal places for KB
  return `${Math.round(kb)} KB`;
}

export function formatPercent(original: number, compressed: number): number {
  if (original === 0) return 0;
  if (compressed >= original) return 0;

  const saved = original - compressed;
  return Math.round((saved / original) * 100);
}
