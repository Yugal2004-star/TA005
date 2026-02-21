import { callGemini } from '../services/geminiService.js';
import { runBiasEngine } from '../services/biasEngine.js';
import { blendScores, scoreToRisk, combineBiasLists } from '../utils/scoring.js';
import { supabase } from '../config/supabase.js';

export const handleAnalyze = async (req, res, next) => {
  try {
    const { text, filters = [] } = req.body;
    const userId = req.user.id;

    if (!text || text.trim().length < 20)
      return res.status(400).json({ success: false, message: 'Minimum 20 characters required.' });

    if (text.length > 10000)
      return res.status(400).json({ success: false, message: 'Maximum 10,000 characters allowed.' });

    // Run both engines simultaneously
    const [aiResult, ruleResult] = await Promise.all([
      callGemini(text, filters),
      Promise.resolve(runBiasEngine(text, filters)),
    ]);

    const finalScore   = blendScores(aiResult.aiScore, ruleResult.ruleScore);
    const riskLevel    = scoreToRisk(finalScore);
    const mergedBiases = combineBiasLists(aiResult.detectedBiases, ruleResult.ruleMatches);

    const record = {
      user_id:            userId,
      original_text:      text,
      manipulation_score: finalScore,
      risk_level:         riskLevel,
      detected_biases:    mergedBiases,
      category_tally:     ruleResult.categoryTally,
      overall_summary:    aiResult.overallSummary,
      applied_filters:    filters,
      ai_score:           aiResult.aiScore,
      rule_score:         ruleResult.ruleScore,
      flagged_terms:      ruleResult.flaggedTerms,
      word_count:         text.trim().split(/\s+/).length,
      dominant_technique: aiResult.dominantTechnique,
      intent_assessment:  aiResult.intentAssessment,
    };

    const { data, error } = await supabase.from('analyses').insert([record]).select().single();
    if (error) throw new Error(error.message);

    res.json({
      success: true,
      data: {
        id:                 data.id,
        manipulationScore:  finalScore,
        riskLevel,
        detectedBiases:     mergedBiases,
        categoryTally:      ruleResult.categoryTally,
        overallSummary:     aiResult.overallSummary,
        dominantTechnique:  aiResult.dominantTechnique,
        intentAssessment:   aiResult.intentAssessment,
        flaggedTerms:       ruleResult.flaggedTerms,
        aiScore:            aiResult.aiScore,
        ruleScore:          ruleResult.ruleScore,
        wordCount:          record.word_count,
        createdAt:          data.created_at,
      },
    });
  } catch (err) { next(err); }
};
