import { AIRun, PROMPTS, MY_BRAND, COMPETITORS, Market } from "@/data/mockData";

export interface FilterState {
    market: Market | "All";
    serviceLine: string | "All";
}

export function filterRuns(runs: AIRun[], filters: FilterState) {
    return runs.filter(run => {
        const prompt = PROMPTS.find(p => p.id === run.promptId);
        if (!prompt) return false;

        // Filter by Market
        if (filters.market !== "All" && prompt.market !== filters.market) return false;

        // Filter by Service Line
        if (filters.serviceLine !== "All" && prompt.serviceLineId !== filters.serviceLine) return false;

        return true;
    });
}

export function calculateMetrics(runs: AIRun[]) {
    const total = runs.length;
    if (total === 0) return {
        shareOfVoice: 0,
        firstMention: 0,
        runs
    };

    const mentioned = runs.filter(r => r.entitiesDetected.includes(MY_BRAND)).length;
    const first = runs.filter(r => r.rank === 1).length;

    return {
        shareOfVoice: (mentioned / total) * 100,
        firstMention: (first / total) * 100,
        runs
    };
}

export function getCompetitorShare(runs: AIRun[], market: Market | "All") {
    // If All markets, just pick Phoenix competitors for demo or aggregate?
    // Let's aggregate top 3 unique names across runs
    const allEntities = runs.flatMap(r => r.entitiesDetected);
    const counts: Record<string, number> = {};
    allEntities.forEach(e => {
        if (e !== MY_BRAND) counts[e] = (counts[e] || 0) + 1;
    });

    const total = runs.length || 1;
    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({
            name,
            share: (count / total) * 100
        }));

    return sorted;
}

export function getTrendData(runs: AIRun[]) {
    // Buckets by week (approx 7 days for demo)
    // Or simple daily buckets. Let's do daily for smoother charts or weekly for "Exec" view.
    // The mock data is past 28 days. Let's group into 4 weeks.
    const weeks: Record<string, any> = {};

    runs.forEach(run => {
        const date = new Date(run.timestamp);
        // Simple week grouping: just use date string for day, or week number.
        // Let's do strict date sorting.
        const day = date.toISOString().split("T")[0]; // YYYY-MM-DD

        if (!weeks[day]) {
            weeks[day] = { date: day, [MY_BRAND]: 0, "Competitor": 0, "Others": 0, total: 0 };
        }

        weeks[day].total++;
        if (run.entitiesDetected.includes(MY_BRAND)) {
            weeks[day][MY_BRAND]++;
        } else {
            // Find if any major competitor is mentioned
            // Simplified: if not us, check if any entity detected is a competitor
            // For this demo, let's just count mentions.
            // If run.entitiesDetected has > 0, it's a competitor or other
            if (run.entitiesDetected.length > 0) weeks[day]["Competitor"]++;
            else weeks[day]["Others"]++; // No one mentioned?
        }
    });

    // Convert counts to percentages
    return Object.values(weeks).map((w: any) => ({
        date: w.date,
        [MY_BRAND]: (w[MY_BRAND] / w.total) * 100,
        Competitor: (w.Competitor / w.total) * 100,
    })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getServiceLineBreakdown(runs: AIRun[], taxonomy: any[]) {
    // Return array of { id, name, presence, topCompetitor, gap }
    return taxonomy.map(sl => {
        // Runs for this SL
        const slRuns = runs.filter(r => {
            const prompt = PROMPTS.find(p => p.id === r.promptId);
            return prompt?.serviceLineId === sl.id;
        });

        if (slRuns.length === 0) return { ...sl, presence: 0, topCompetitor: "-", topCompShare: 0, gap: 0 };

        const myMentions = slRuns.filter(r => r.entitiesDetected.includes(MY_BRAND)).length;
        const presence = (myMentions / slRuns.length) * 100;

        // Top competitor
        const compShare = getCompetitorShare(slRuns, "All");
        const top = compShare[0] || { name: "-", share: 0 };

        return {
            ...sl,
            presence,
            topCompetitor: top.name,
            topCompShare: top.share,
            gap: top.share - presence
        };
    }).sort((a, b) => a.presence - b.presence); // Lowest presence first (weakness focus)
}
