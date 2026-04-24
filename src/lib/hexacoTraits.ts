// Maps HEXACO dimension codes (H/E/X/A/C/O) to human-readable Indonesian phrases.
// Used to enrich AI prompts without leaking technical labels.

const hexacoLabels: Record<string, string> = {
  H: "jujur dan rendah hati",
  E: "peka secara emosional",
  X: "energik dan mudah bergaul",
  A: "sabar dan mudah bekerja sama",
  C: "teliti dan disiplin",
  O: "penasaran dan terbuka terhadap ide baru",
};

// Accepts either H/E/X/A/C/O keys or full names (honesty, emotionality, ...).
const FULL_TO_SHORT: Record<string, string> = {
  honesty: "H",
  emotionality: "E",
  extraversion: "X",
  agreeableness: "A",
  conscientiousness: "C",
  openness: "O",
};

export function buildTopHexacoTraits(hexaco: Record<string, number>): string[] {
  return Object.entries(hexaco)
    .map(([k, v]) => [FULL_TO_SHORT[k] ?? k, v] as [string, number])
    .filter(([k, score]) => hexacoLabels[k] !== undefined && score >= 3.5)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([dim]) => hexacoLabels[dim]);
}
