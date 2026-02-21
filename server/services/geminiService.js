import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const callGemini = async (text, activeFilters = []) => {
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const focusAreas = activeFilters.length
    ? activeFilters.join(', ')
    : 'fear_mongering, urgency_pressure, exaggeration, authority_misuse, polarization, emotional_manipulation';

  const prompt = `
You are a professional psychological manipulation analyst.
Examine the following text and detect manipulation patterns.
Focus areas: ${focusAreas}

Return ONLY a raw JSON object — no markdown fences, no preamble:
{
  "aiScore": <integer 0-100>,
  "detectedBiases": [
    {
      "category": "<one of the focus areas>",
      "phrase": "<verbatim phrase from input text>",
      "explanation": "<clear 1-2 sentence reason>",
      "severity": "<low|medium|high>"
    }
  ],
  "overallSummary": "<2-3 sentence neutral analysis>",
  "dominantTechnique": "<most prominent technique name or none>",
  "intentAssessment": "<persuasive|informative|neutral|alarming|misleading>"
}

Rules:
- Only flag genuine manipulation. Clean content gets score 0-15 and empty array.
- Max 8 items in detectedBiases.
- All phrases must exist verbatim in the input.

Input text:
"${text.replace(/"/g, "'")}"
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim()
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(raw);
    return {
      aiScore:          Math.min(Math.max(Number(parsed.aiScore) || 0, 0), 100),
      detectedBiases:   Array.isArray(parsed.detectedBiases) ? parsed.detectedBiases : [],
      overallSummary:   parsed.overallSummary   || 'Analysis complete.',
      dominantTechnique:parsed.dominantTechnique || 'none',
      intentAssessment: parsed.intentAssessment  || 'neutral',
    };
  } catch (err) {
    console.error('[Gemini] Error:', err.message);
    throw new Error('AI analysis failed. Please retry.');
  }
};
