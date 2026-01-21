import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { promptText, market } = req.body;

    if (!promptText) {
        return res.status(400).json({ message: 'Prompt text is required' });
    }

    try {
        // Step 1: Simulate the "Search" - Ask ChatGPT the user's question
        const searchCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: promptText }],
            model: 'gpt-4',
        });

        const rawResponse = searchCompletion.choices[0].message.content || '';

        // Step 2: The "Analyst" - Analyze the response for our metrics
        // We instruct the LLM to extract data in a specific JSON format
        const analysisSystemPrompt = `
You are a data analyst for 'Acme Health'. 
Analyze the following text which is a response from an AI to a user's health query.
1. Identify all healthcare providers/brands mentioned.
2. Determine if 'Acme Health' is mentioned.
3. If 'Acme Health' is mentioned, what is its rank order? (1 = first mentioned or most recommended). If not mentioned, rank is null.
4. Return a JSON object with keys: entitiesDetected (string[]), firstMentioned (string | null), rank (number | null).
`;

        const analysisCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: analysisSystemPrompt },
                { role: 'user', content: `Analyze this response:\n---\n${rawResponse}\n---` }
            ],
            model: 'gpt-4o-mini', // Fast & cheap for analysis
            response_format: { type: "json_object" },
        });

        const analysisResult = JSON.parse(analysisCompletion.choices[0].message.content || '{}');

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
