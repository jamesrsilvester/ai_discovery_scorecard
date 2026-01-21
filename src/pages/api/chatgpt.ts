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

interface QueryResult {
    query: string;
    rawResponse: string;
    analysis: {
        entitiesDetected: string[];
        firstMentioned: string | null;
        rank: number | null;
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { serviceLine, market, targetBrand } = req.body;

    if (!serviceLine || !market) {
        return res.status(400).json({ message: 'Service line and market are required' });
    }

    const brandName = targetBrand || 'Banner Health';

    try {
        // Step 1: Generate 5 query variations
        const variationPrompt = `
You are a healthcare marketing expert. Generate 5 different search queries that a patient might use when looking for ${serviceLine} services in ${market}.
The queries should represent diverse patient intents:
1. A "best provider" query
2. A "near me" or local query  
3. A cost/insurance related query
4. A specific procedure or condition query
5. A comparison or recommendation query

Return a JSON object with key "queries" containing an array of 5 query strings. Keep them realistic and concise.
`;

        const variationsResult = await fetchOpenAICompat(
            [{ role: 'user', content: variationPrompt }],
            'gpt-4o-mini',
            'json'
        );

        const variations = JSON.parse(variationsResult.choices[0].message.content || '{"queries":[]}');
        const queries: string[] = variations.queries || [];

        if (queries.length === 0) {
            throw new Error("Failed to generate query variations");
        }

        // Step 2: Run each query and analyze
        const results: QueryResult[] = [];

        for (const query of queries) {
            // Get AI response
            const searchResult = await fetchOpenAICompat(
                [{ role: 'user', content: query }],
                'gpt-4o-mini',
                'text'
            );
            const rawResponse = searchResult.choices[0].message.content || '';

            // Analyze response
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

            const analysis = JSON.parse(analysisResultRaw.choices[0].message.content || '{}');

            results.push({
                query,
                rawResponse,
                analysis
            });
        }

        // Step 3: Calculate aggregated metrics
        const rankedResults = results.filter(r => r.analysis.rank !== null);
        const mentionCount = rankedResults.length;
        const avgRank = rankedResults.length > 0
            ? rankedResults.reduce((sum, r) => sum + (r.analysis.rank || 0), 0) / rankedResults.length
            : null;

        // Count first mentions
        const firstMentionCount = results.filter(r => r.analysis.firstMentioned === brandName).length;

        // Unique competitors across all results
        const allEntities = new Set<string>();
        results.forEach(r => r.analysis.entitiesDetected?.forEach(e => allEntities.add(e)));

        return res.status(200).json({
            success: true,
            targetBrand: brandName,
            queries: queries,
            results,
            aggregate: {
                totalQueries: queries.length,
                mentionCount,   // How many times the brand was mentioned
                mentionRate: Math.round((mentionCount / queries.length) * 100),
                avgRank: avgRank ? parseFloat(avgRank.toFixed(1)) : null,
                firstMentionCount,
                allCompetitors: Array.from(allEntities).filter(e => e !== brandName)
            }
        });

    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}
