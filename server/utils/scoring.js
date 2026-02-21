export const blendScores = (aiScore, ruleScore) =>
  Math.min(Math.max(Math.round(aiScore * 0.65 + ruleScore * 0.35), 0), 100);

export const scoreToRisk = (score) => {
  if (score <= 20) return 'Low';
  if (score <= 45) return 'Moderate';
  if (score <= 70) return 'High';
  return 'Critical';
};

export const combineBiasLists = (fromAI, fromRules) => {
  const combined = [...fromAI];
  for (const r of fromRules) {
    if (!combined.find(b => b.category === r.category) && r.topTerms.length) {
      combined.push({
        category:    r.category,
        phrase:      r.topTerms[0],
        explanation: `Rule engine matched ${r.hitCount} instance(s) of ${r.category.replaceAll('_', ' ')} language.`,
        severity:    r.hitCount >= 3 ? 'high' : r.hitCount >= 2 ? 'medium' : 'low',
      });
    }
  }
  return combined;
};
