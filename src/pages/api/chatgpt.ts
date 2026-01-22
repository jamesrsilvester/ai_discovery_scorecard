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

    const { serviceLine, market, targetBrand, step, queries: providedQueries, userKeywords } = req.body;

    if (!serviceLine || !market) {
        return res.status(400).json({ message: 'Service line and market are required' });
    }

    const brandName = targetBrand || 'Acme Health';

    try {
        let queries = providedQueries || [];

        // Step 1: Generate queries if not provided
        if (queries.length === 0) {
            const hasUserKeywords = userKeywords && userKeywords.length > 0;
            const keywordsToUse = hasUserKeywords ? userKeywords.join(", ") : serviceLine;
            const keywordCount = hasUserKeywords ? userKeywords.length : 5;
            const totalQueries = keywordCount * 3;

            const variationPrompt = `
You are a healthcare marketing expert. 
${hasUserKeywords
                    ? `The user has specified these priority patient keywords: ${keywordsToUse}.`
                    : `For the service line "${serviceLine}" in the "${market}" region, identify 5 distinct "consumer-friendly" keywords or phrases that patients actually use (e.g., instead of "Gastroenterology", they might search for "stomach doctor", "acid reflux", or "colonoscopy").`
                }

For ${hasUserKeywords ? 'those specific keywords' : 'EACH of those 5 consumer keywords'}, generate exactly 3 distinct search query variations focused on finding a provider/specialist in "${market}".

Total queries to generate: ${totalQueries}.

Return a JSON object with:
- "keywords": an array of the ${keywordCount} primary consumer keywords ${hasUserKeywords ? '(including the ones provided)' : 'identified'}
- "queries": an array of all ${totalQueries} query strings (3 variations for each of the ${keywordCount} keywords)

CRITICAL INSTRUCTIONS:
1. EVERY query must explicitly include the location "${market}" (e.g., "stomach doctor in ${market}").
2. DO NOT use the phrases "near me", "nearby", or "local".
3. Ensure all queries are focused on provider discovery.
`;

            const variationsResult = await fetchOpenAICompat(
                [{ role: 'user', content: variationPrompt }],
                'gpt-4o-mini',
                'json'
            );

            const variations = JSON.parse(variationsResult.choices[0].message.content || '{"queries":[]}');
            queries = variations.queries || [];

            if (queries.length === 0) {
                throw new Error("Failed to generate query variations");
            }

            // If only generation was requested, return early
            if (step === 'generate') {
                return res.status(200).json({ success: true, queries });
            }
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

1. Identify healthcare ORGANIZATIONS mentioned. Only include:
   - Health systems (e.g., "UCHealth", "Kaiser Permanente", "HCA Healthcare")
   - Hospitals (e.g., "Denver Health Medical Center", "University of Colorado Hospital")
   - Medical groups/clinics (e.g., "The Steadman Clinic", "OrthoColorado")
   
   DO NOT include:
   - Individual doctor names (e.g., "Dr. Robert Smith")
   - Review websites (e.g., "Healthgrades", "Zocdoc", "Vitals", "Yelp")
   - Professional associations (e.g., "American Academy of Orthopaedic Surgeons")
   - General websites or search engines

2. Determine if '${brandName}' (or a close variation) is mentioned.
3. If '${brandName}' is mentioned, what is its rank order among the organizations? (1 = first mentioned or most recommended). If not mentioned, rank is null.
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

        // Count competitor mentions
        const competitorCounts: Record<string, number> = {};
        results.forEach(r => {
            r.analysis.entitiesDetected?.forEach(e => {
                if (e !== brandName) {
                    competitorCounts[e] = (competitorCounts[e] || 0) + 1;
                }
            });
        });

        const sortedCompetitors = Object.entries(competitorCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

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
                allCompetitors: sortedCompetitors
            }
        });

    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}
