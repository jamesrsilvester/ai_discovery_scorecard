export type IntentType = "High-intent" | "Local" | "Info" | "Cost";
export type Market = "Phoenix" | "Denver";
export type AIPlatform = "ChatGPT" | "Perplexity" | "Google AI Overviews" | "Gemini";

export interface ServiceLine {
    id: string;
    name: string;
    subLines: string[];
}

export interface Competitor {
    id: string;
    name: string;
    color: string;
}

export interface Prompt {
    id: string;
    text: string;
    theme: string;
    serviceLineId: string;
    intentType: IntentType;
    market: Market;
}

export interface AIRun {
    id: string;
    promptId: string;
    source: AIPlatform;
    timestamp: string;
    responseSnippet: string;
    entitiesDetected: string[]; // Brand names
    firstMentioned: string | null;
    rank: number | null; // Rank of OUR brand (null if not mentioned)
}

// Taxonomy
export const TAXONOMY: ServiceLine[] = [
    {
        id: "bariatrics",
        name: "Bariatrics & Weight Management",
        subLines: ["Bariatric Surgery", "Medical Weight Loss", "Obesity-Related Conditions"]
    },
    {
        id: "gi",
        name: "Gastroenterology & Digestive Health",
        subLines: ["General GI", "Endoscopy", "Colonoscopy", "IBD", "Hepatology"]
    },
    {
        id: "ortho",
        name: "Orthopedics & Sports Medicine",
        subLines: ["Sports Medicine", "Joint Replacement", "Spine", "Hand & Upper Extremity", "Foot & Ankle"]
    }
];

export const MARKETS: Market[] = ["Phoenix", "Denver"];

// Competitors per market
export const COMPETITORS: Record<Market, Competitor[]> = {
    Phoenix: [
        { id: "banner", name: "Banner Health", color: "#005EB8" },
        { id: "honor", name: "HonorHealth", color: "#63479B" },
        { id: "dignity", name: "Dignity Health", color: "#F58025" }
    ],
    Denver: [
        { id: "uchealth", name: "UCHealth", color: "#C21B2F" },
        { id: "healthone", name: "HealthONE", color: "#009CA6" },
        { id: "scl", name: "Intermountain (SCL)", color: "#0057B8" }
    ]
};

export const MY_BRAND = "Acme Health";

// Generate Prompts
export const PROMPTS: Prompt[] = [
    // Bariatrics - Phoenix
    { id: "p1", text: "best bariatric surgeon in Phoenix", theme: "Best Surgeon", serviceLineId: "bariatrics", intentType: "High-intent", market: "Phoenix" },
    { id: "p2", text: "am I eligible for bariatric surgery", theme: "Eligibility", serviceLineId: "bariatrics", intentType: "Info", market: "Phoenix" },
    { id: "p3", text: "gastric sleeve cost Phoenix", theme: "Cost/Insurance", serviceLineId: "bariatrics", intentType: "Cost", market: "Phoenix" },
    { id: "p4", text: "GLP-1 weight loss clinic near me", theme: "Gen pop weight loss", serviceLineId: "bariatrics", intentType: "Local", market: "Phoenix" },

    // GI - Phoenix
    { id: "p5", text: "colonoscopy near me", theme: "Colonoscopy", serviceLineId: "gi", intentType: "Local", market: "Phoenix" },
    { id: "p6", text: "best gastroenterologist in Scottsdale", theme: "Best Doctor", serviceLineId: "gi", intentType: "High-intent", market: "Phoenix" },
    { id: "p7", text: "IBD specialist phoenix accepts BCBS", theme: "Specialist/Insurance", serviceLineId: "gi", intentType: "High-intent", market: "Phoenix" },

    // Ortho - Phoenix
    { id: "p8", text: "knee replacement surgeon phoenix", theme: "Joint Replacement", serviceLineId: "ortho", intentType: "High-intent", market: "Phoenix" },
    { id: "p9", text: "orthopedic urgent care scottsdale", theme: "Urgent Ortho", serviceLineId: "ortho", intentType: "Local", market: "Phoenix" },

    // Denver Samples
    { id: "p10", text: "best bariatric surgeon in Denver", theme: "Best Surgeon", serviceLineId: "bariatrics", intentType: "High-intent", market: "Denver" },
    { id: "p11", text: "sports medicine doctor denver", theme: "Sports Med", serviceLineId: "ortho", intentType: "High-intent", market: "Denver" }
];

// Mock Runs Generation
// Function to generate random runs for the scorecard visuals
const generateRuns = (): AIRun[] => {
    const runs: AIRun[] = [];
    const sources: AIPlatform[] = ["ChatGPT", "Perplexity", "Google AI Overviews"];
    const now = new Date();

    // Generate 4 weeks of data
    for (let i = 0; i < 28; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString();

        PROMPTS.forEach(prompt => {
            sources.forEach(source => {
                // Random outcome logic
                const rand = Math.random();
                let rank: number | null = null;
                let firstMentioned: string | null = null;
                const entities = [];

                if (rand > 0.3) { // 70% chance we are mentioned
                    // We are mentioned.
                    // 30% chance we are first
                    if (Math.random() > 0.6) {
                        rank = 1;
                        firstMentioned = MY_BRAND;
                        entities.push(MY_BRAND);
                    } else {
                        rank = 2; // Rank 2 or 3
                        // Competitor is first
                        const comp = COMPETITORS[prompt.market][0].name;
                        firstMentioned = comp;
                        entities.push(comp, MY_BRAND);
                    }
                } else {
                    // Not mentioned
                    const comp = COMPETITORS[prompt.market][Math.floor(Math.random() * 3)].name;
                    firstMentioned = comp;
                    entities.push(comp);
                }

                runs.push({
                    id: `${prompt.id}-${source}-${i}`,
                    promptId: prompt.id,
                    source,
                    timestamp: dateStr,
                    responseSnippet: `Here are some top options for ${prompt.text}...`,
                    entitiesDetected: entities,
                    firstMentioned,
                    rank
                });
            });
        });
    }
    return runs;
};

export const MOCK_RUNS = generateRuns();
