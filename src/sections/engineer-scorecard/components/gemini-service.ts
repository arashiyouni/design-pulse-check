import type { PulseScore, Engineer, ScoreAnalysis } from '@/../product/sections/engineer-scorecard/types'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

function buildPrompt(engineer: Engineer, pulseScore: PulseScore): string {
  const pillarSummary = pulseScore.pillars
    .map((p) => {
      const latest = p.sparkline[p.sparkline.length - 1]?.value ?? p.score
      const oldest = p.sparkline[0]?.value ?? p.score
      const delta = latest - oldest
      return `- ${p.pillarName}: ${p.score}/100 (trend: ${p.trend}, ${delta >= 0 ? '+' : ''}${delta} over 6 periods, weight: ${p.weight}%)`
    })
    .join('\n')

  const deliveryMetrics = pulseScore.deliverySubMetrics
    .map((m) => `- ${m.name}: ${m.value} ${m.unit} (score: ${m.score}/100, trend: ${m.trend})`)
    .join('\n')

  const clientData = pulseScore.clientSatisfaction
  const clientSection = `- NPS: ${clientData.nps}/5, CSAT: ${clientData.csat}/5\n- Latest feedback: "${clientData.latestFeedback ?? 'None'}"`

  const teamSection = pulseScore.teamFeedback
    .map((f) => `- ${f.submittedBy} (${f.submittedAt}): status=${f.status}, score=${f.score ?? 'N/A'} — "${f.notes}"`)
    .join('\n')

  const growth = pulseScore.growth
  const growthSection = `- Level: ${growth.currentLevel}\n- Skills: ${growth.skillsDemonstrated.join(', ')}\n- Trajectory: ${growth.growthTrajectory}/5\n- Target: ${growth.targetSkill}\n- Justification: "${growth.justification}"`

  return `You are an engineering performance analyst. Analyze the following engineer scorecard data and provide a structured assessment.

Engineer: ${engineer.name} (${engineer.level} engineer on ${engineer.project})
Period: ${engineer.currentPeriod}
Composite Score: ${pulseScore.compositeScore}/100 (trend: ${pulseScore.trend})

Pillar Scores:
${pillarSummary}

Delivery Sub-Metrics:
${deliveryMetrics}

Client Satisfaction:
${clientSection}

Team Feedback:
${teamSection}

Growth:
${growthSection}

Respond with a JSON object matching this exact structure:
{
  "overallAssessment": "A 2-3 sentence summary of the engineer's performance this period.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasForImprovement": ["area 1", "area 2"],
  "actionItems": [
    { "action": "specific action", "pillar": "pillar name", "priority": "high|medium|low" }
  ]
}

Guidelines:
- Be specific and reference actual data points
- Provide 2-4 strengths and 1-3 areas for improvement
- Provide 2-4 action items with realistic priorities
- Keep the overall assessment concise but insightful`
}

export async function generateScoreAnalysis(
  apiKey: string,
  engineer: Engineer,
  pulseScore: PulseScore,
): Promise<ScoreAnalysis> {
  const prompt = buildPrompt(engineer, pulseScore)

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('No content returned from Gemini API')
  }

  const parsed = JSON.parse(text) as ScoreAnalysis

  // Validate required fields
  if (
    typeof parsed.overallAssessment !== 'string' ||
    !Array.isArray(parsed.strengths) ||
    !Array.isArray(parsed.areasForImprovement) ||
    !Array.isArray(parsed.actionItems)
  ) {
    throw new Error('Invalid response structure from Gemini API')
  }

  return parsed
}
