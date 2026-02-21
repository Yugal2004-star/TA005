import { manipulationLexicon, categoryKeys } from '../utils/lexicon.js';

export const runBiasEngine = (text, activeFilters = []) => {
  const normalized = text.toLowerCase();
  const catsToScan = activeFilters.length
    ? categoryKeys.filter(k => activeFilters.includes(k))
    : categoryKeys;

  const ruleMatches   = [];
  const categoryTally = {};
  const allFlagged    = new Set();
  let   rawTotal      = 0;

  for (const cat of catsToScan) {
    const { terms, weight } = manipulationLexicon[cat];
    const hits = terms.filter(t => normalized.includes(t.toLowerCase()));

    categoryTally[cat] = hits.length;
    hits.forEach(h => allFlagged.add(h));

    if (hits.length > 0) {
      const contribution = Math.min(hits.length * weight * 5, 28);
      rawTotal += contribution;
      ruleMatches.push({
        category:    cat,
        hitCount:    hits.length,
        topTerms:    hits.slice(0, 5),
        contribution:Math.round(contribution),
      });
    }
  }

  // Ensure every category has a tally (including inactive ones)
  for (const cat of categoryKeys) {
    if (!(cat in categoryTally)) categoryTally[cat] = 0;
  }

  return {
    ruleScore:    Math.min(Math.round(rawTotal), 100),
    ruleMatches,
    categoryTally,
    flaggedTerms: [...allFlagged],
  };
};
