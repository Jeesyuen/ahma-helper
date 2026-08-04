const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

const SUPPORTED_LANGUAGES = {
  cantonese: '廣東話 (Cantonese)',
  mandarin: '中文 (Mandarin)',
  malay: 'Bahasa Malaysia',
  english: 'English',
}

export async function extractDocumentData(base64Image, mimeType = 'image/jpeg') {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are a document assistant helping elderly Malaysian patients understand medical documents.

Extract ONLY the key information from this document. Return a JSON object with these exact fields:
{
  "date": "the appointment or document date, or null",
  "time": "the time in readable format like 10:00 AM, or null",
  "location": "the full hospital, clinic, or location name, or null",
  "department": "the medical department or ward, or null",
  "doctor": "the doctor name if mentioned, or null",
  "action_required": "the main thing the patient needs to do, in one simple sentence, or null",
  "bring_items": ["list", "of", "items", "to", "bring"] or [],
  "contact_number": "phone number if mentioned, or null",
  "document_type": "appointment letter / prescription / discharge summary / bill / other",
  "urgency": "urgent / normal / for_info"
}

Rules:
- Return ONLY the JSON object, no other text
- If a field is not found, use null
- Keep values short and factual
- Do not invent or assume any information
- For bring_items, include IC, appointment card, past medical records if mentioned`,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to extract document data')
  }

  const data = await response.json()
  const text = data.content[0].text.trim()
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('Could not read document. Please try a clearer photo.')
  }
}

export async function generateSummary(extractedData, language = 'cantonese') {
  const languageInstructions = {
    cantonese: `Write in simple Traditional Chinese suitable for a Cantonese speaker. 
Use common Cantonese vocabulary. Avoid formal Mandarin terms where possible.
Example of appropriate style: 你要去醫院睇醫生。記得帶身份證同埋預約卡。`,
    mandarin: `Write in simple Simplified Chinese at primary school level.
Use short sentences. Maximum 5 sentences.`,
    malay: `Write in simple Bahasa Malaysia at primary school level (darjah 4-5).
Use everyday words, avoid technical medical terms.
Short sentences only.`,
    english: `Write in simple English at primary school level.
Short sentences. No medical jargon.`,
  }

  const instruction = languageInstructions[language] || languageInstructions.cantonese

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are helping an elderly Malaysian person understand a medical document.
          
Document information:
${JSON.stringify(extractedData, null, 2)}

${instruction}

Write a summary that tells them:
1. What this document is about (one sentence)
2. The most important action they need to take
3. When and where to go (if applicable)
4. What to bring (if applicable)
5. Who to call if they have questions (if applicable)

Keep it warm, clear, and reassuring. Maximum 6 sentences total.
Do NOT include any JSON or formatting — plain text only.`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to generate summary')
  }

  const data = await response.json()
  return data.content[0].text.trim()
}