import type { NextApiRequest, NextApiResponse } from 'next';

// Simple fetch wrapper for OpenAI Chat Completions
async function fetchOpenAICompat(messages: any[], model: string, format: 'text' | 'json' = 'text') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

    const body: any = {
        model,
        messages
    };

    if (format === 'json') {
        body.response_format = { type: "json_object" };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { promptText, market, targetBrand } = req.body;

    if (!promptText) {
        return res.status(400).json({ message: 'Prompt text is required' });
    }

    const brandName = targetBrand || 'Acme Health';

    // Mock fallback for API quota exceeded or local development
    if (process.env.NODE_ENV !== 'production' && process.env.MOCK_API === 'true') {
        return res.status(200).json({
            success: true,
            isMock: true,
            rawResponse: `[MOCK RESPONSE - API QUOTA EXCEEDED]\n\nBased on your search for ${promptText}, Dr. Smith at Banner Health is highly recommended. Other options include Mayo Clinic and Dignity Health. ${brandName} is also a strong contender with excellent patient reviews.`,
            analysis: {
                entitiesDetected: ["Banner Health", "Mayo Clinic", "Dignity Health", brandName],
                firstMentioned: "Banner Health",
                rank: 4 // Random rank for mock
            }
        });
    }

    try {
        // Step 1: Simulate the "Search"
        const searchResult = await fetchOpenAICompat(
            [{ role: 'user', content: promptText }],
            'gpt-4o-mini',
            'text'
        );
        const rawResponse = searchResult.choices[0].message.content || '';

        // Step 2: The "Analyst"
        const analysisSystemPrompt = `
You are a data analyst for '${brandName}'. 
Analyze the following text which is a response from an AI to a user's health query.
1. Identify all healthcare providers/brands mentioned.
2. Determine if '${brandName}' is mentioned.
3. If '${brandName}' is mentioned, what is its rank order? (1 = first mentioned or most recommended). If not mentioned, rank is null.
4. Return a JSON object with keys: entitiesDetected (string[]), firstMentioned (string | null), rank (number | null).
`;

        const analysisResultRaw = await fetchOpenAICompat(
            [
                { role: 'system', content: analysisSystemPrompt },
                { role: 'user', content: `Analyze this response:\n---\n${rawResponse}\n---` }
            ],
            'gpt-4o-mini',
            'json'
        );

        const analysisResult = JSON.parse(analysisResultRaw.choices[0].message.content || '{}');

        return res.status(200).json({
            success: true,
            rawResponse,
            analysis: analysisResult
        });

    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}
