export const FACTOR_WEIGHTS: Record<string, number> = {
  novelty: 0.38,
  development: 0.12,
  disclosure: 0.18,
  revenue: 0.14,
  reputation: 0.06,
  competitor: 0.12,
};

export function factorWeightPercent(id: string): number {
  return Math.round((FACTOR_WEIGHTS[id] ?? 0) * 100);
}
