const SYSTEM_PROMPT = `You are the Elite AI Sales Representative for Anve Tech, a premium modern digital solutions and web development studio.
Assist clients professionally and concisely. Guide them to the contact form or anvetechnologies@gmail.com for project quotes. Core services include custom websites, e-commerce platforms, billing systems, frontend solutions, and digital portfolios. Never invent locations or phone numbers.`;

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(503).json({ error: 'Chat service is not configured' });
  }

  const messages = request.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return response.status(400).json({ error: 'Invalid conversation' });
  }

  const contents = messages
    .filter((message) => ['user', 'ai'].includes(message?.role) && typeof message.text === 'string')
    .map((message) => ({
      role: message.role === 'ai' ? 'model' : 'user',
      parts: [{ text: message.text.slice(0, 4000) }],
    }));

  if (!contents.length || contents.at(-1).role !== 'user') {
    return response.status(400).json({ error: 'Invalid conversation' });
  }

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 250, temperature: 0.7 },
      }),
    });

    if (!geminiResponse.ok) {
      return response.status(502).json({ error: 'Chat provider request failed' });
    }

    const data = await geminiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return response.status(502).json({ error: 'Chat provider returned no response' });
    return response.status(200).json({ text });
  } catch {
    return response.status(502).json({ error: 'Chat provider is unavailable' });
  }
}
