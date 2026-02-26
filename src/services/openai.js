import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through a backend
})

// Helper function to generate content with Groq
async function generateWithGroq(systemPrompt, userPrompt, temperature = 0.7) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: temperature,
    max_completion_tokens: 2048
  })

  return completion.choices[0].message.content
}

// ============================================
// WORD CONTENT GENERATION
// ============================================

export async function generateWordContent(word) {
  try {
    const systemPrompt = 'You are a helpful vocabulary tutor. Generate clear, accurate definitions and practical examples. Return ONLY valid JSON without any markdown formatting or code blocks.'

    const userPrompt = `Generate content for the word "${word}". Return a JSON object with:
{
  "meaning": "clear, concise definition",
  "examples": ["example 1", "example 2", "example 3"]
}

Each example should be a complete sentence using the word naturally.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.7)

    // Remove markdown code blocks if present
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanContent)

    return {
      word,
      meaning: parsed.meaning,
      examples: parsed.examples || []
    }
  } catch (error) {
    console.error('Error generating word content:', error)
    throw new Error('Failed to generate word content. Please try again.')
  }
}

// ============================================
// IDIOM CONTENT GENERATION
// ============================================

export async function generateIdiomContent(idiom) {
  try {
    const systemPrompt = 'You are a helpful vocabulary tutor specializing in idioms and phrases. Return ONLY valid JSON without any markdown formatting or code blocks.'

    const userPrompt = `Generate content for the idiom "${idiom}". Return a JSON object with:
{
  "meaning": "what the idiom means",
  "origin": "brief history or origin (1-2 sentences)",
  "examples": ["example 1", "example 2", "example 3"]
}

Each example should show the idiom used in a natural context.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.7)
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanContent)

    return {
      idiom,
      meaning: parsed.meaning,
      origin: parsed.origin || '',
      examples: parsed.examples || []
    }
  } catch (error) {
    console.error('Error generating idiom content:', error)
    throw new Error('Failed to generate idiom content. Please try again.')
  }
}

// ============================================
// ENHANCEMENT FEATURES
// ============================================

export async function generateMoreExamples(text, existingExamples, isIdiom = false) {
  try {
    const itemType = isIdiom ? 'idiom' : 'word'
    const systemPrompt = 'You are a helpful vocabulary tutor. Generate diverse, practical examples. Return ONLY valid JSON without any markdown formatting.'

    const userPrompt = `Generate 3 new example sentences for the ${itemType} "${text}".

Existing examples (avoid duplicating these):
${existingExamples.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}

Return a JSON object with:
{
  "examples": ["new example 1", "new example 2", "new example 3"]
}

Make the examples diverse in context and difficulty.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.8)
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanContent)

    return parsed.examples || []
  } catch (error) {
    console.error('Error generating more examples:', error)
    throw new Error('Failed to generate examples. Please try again.')
  }
}

export async function simplifyExplanation(text, originalMeaning, isIdiom = false) {
  try {
    const itemType = isIdiom ? 'idiom' : 'word'
    const systemPrompt = 'You are a helpful vocabulary tutor who explains things simply and clearly.'

    const userPrompt = `Explain the ${itemType} "${text}" in simpler terms.

Original explanation: ${originalMeaning}

Provide a simpler, more accessible explanation (2-3 sentences max) that a beginner could understand.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.6)
    return content.trim()
  } catch (error) {
    console.error('Error simplifying explanation:', error)
    throw new Error('Failed to simplify explanation. Please try again.')
  }
}

// ============================================
// FIND BY SITUATION
// ============================================

export async function findBySituation(situationDescription) {
  try {
    const systemPrompt = 'You are a helpful vocabulary assistant. Suggest relevant words and idioms for specific situations. Return ONLY valid JSON without markdown formatting.'

    const userPrompt = `For the situation: "${situationDescription}"

Suggest 5 relevant words and 3 relevant idioms. Return a JSON object with:
{
  "words": [
    {"word": "word1", "reason": "why it fits this situation"},
    {"word": "word2", "reason": "why it fits"}
  ],
  "idioms": [
    {"idiom": "idiom1", "reason": "why it fits"},
    {"idiom": "idiom2", "reason": "why it fits"}
  ]
}

Be specific and practical.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.7)
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanContent)

    return {
      words: parsed.words || [],
      idioms: parsed.idioms || []
    }
  } catch (error) {
    console.error('Error finding by situation:', error)
    throw new Error('Failed to find suggestions. Please try again.')
  }
}

// ============================================
// QUIZ GENERATION
// ============================================

export async function generateFillInBlank(text, isIdiom = false) {
  try {
    const itemType = isIdiom ? 'idiom' : 'word'
    const systemPrompt = 'You are a quiz generator. Create engaging fill-in-the-blank questions. Return ONLY valid JSON.'

    const userPrompt = `Create a fill-in-the-blank question for the ${itemType} "${text}".

Return a JSON object with:
{
  "sentence": "A sentence with _____ where the ${itemType} should go",
  "options": ["${text}", "distractor1", "distractor2", "distractor3"]
}

The distractors should be plausible alternatives but clearly wrong in context. Make sure "${text}" is one of the options.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.7)
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanContent)

    // Ensure the correct answer is included
    if (!parsed.options.includes(text)) {
      parsed.options[0] = text
    }

    return {
      sentence: parsed.sentence,
      options: parsed.options,
      correctAnswer: text
    }
  } catch (error) {
    console.error('Error generating fill-in-blank:', error)
    throw new Error('Failed to generate quiz question. Please try again.')
  }
}

export async function generateSituationMatch(text, meaning, isIdiom = false) {
  try {
    const itemType = isIdiom ? 'idiom' : 'word'
    const systemPrompt = 'You are a quiz generator. Create situation-based questions. Return ONLY valid JSON.'

    const userPrompt = `The ${itemType} "${text}" means: ${meaning}

Create a situation where this ${itemType} would be used, and provide options.

Return a JSON object with:
{
  "situation": "A realistic scenario description",
  "options": ["${text}", "distractor1", "distractor2", "distractor3"]
}

The situation should clearly fit "${text}" best. Distractors should be related but not as fitting.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.7)
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanContent)

    // Ensure the correct answer is included
    if (!parsed.options.includes(text)) {
      parsed.options[0] = text
    }

    return {
      situation: parsed.situation,
      options: parsed.options,
      correctAnswer: text
    }
  } catch (error) {
    console.error('Error generating situation match:', error)
    throw new Error('Failed to generate quiz question. Please try again.')
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function getRandomDistractors(correctAnswer, count = 3, type = 'word') {
  try {
    const systemPrompt = 'Generate plausible but incorrect alternatives for quiz questions. Return ONLY valid JSON.'

    const userPrompt = `Generate ${count} distractor ${type}s similar to "${correctAnswer}" but different.

Return a JSON object with:
{
  "distractors": ["distractor1", "distractor2", "distractor3"]
}

Distractors should be plausible but clearly different.`

    const content = await generateWithGroq(systemPrompt, userPrompt, 0.8)
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleanContent)

    return parsed.distractors || []
  } catch (error) {
    console.error('Error generating distractors:', error)
    return [] // Return empty array as fallback
  }
}
