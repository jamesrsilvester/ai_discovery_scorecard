export type IntentType = "High-intent" | "Local" | "Info" | "Cost";
export type Market = "Phoenix" | "Denver";
export type AIPlatform = "ChatGPT" | "Perplexity" | "Google AI Overviews" | "Gemini";

export interface ServiceLine {
    id: string;
    name: string;
    subLines: string[];
    keywords: string[];
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
        subLines: ["Bariatric Surgery", "Medical Weight Loss", "Obesity-Related Conditions"],
        keywords: [
            "weight loss surgery", "gastric sleeve", "bariatric surgeon", "medical weight loss",
            "obesity specialist", "lap band surgery", "weight loss clinic", "gastric bypass",
            "metabolic surgery", "non-surgical weight loss", "bariatric center",
            "weight management doctor", "semaglutide clinic", "medical obesity treatment",
            "weight loss procedure"
        ]
    },
    {
        id: "gi",
        name: "Gastroenterology & Digestive Health",
        subLines: ["General GI", "Endoscopy", "Colonoscopy", "IBD", "Hepatology"],
        keywords: [
            "gastroenterologist", "endoscopy center", "colonoscopy screening", "stomach doctor",
            "acid reflux specialist", "IBD clinic", "liver specialist", "digestive health",
            "heartburn treatment", "abdominal pain doctor", "GI specialist",
            "Crohn's disease doctor", "gastroscopy", "digestive disorders", "colorectal screening"
        ]
    },
    {
        id: "ortho",
        name: "Orthopedics & Sports Medicine",
        subLines: ["Sports Medicine", "Joint Replacement", "Spine", "Hand & Upper Extremity", "Foot & Ankle"],
        keywords: [
            "orthopedic surgeon", "sports medicine", "joint replacement", "knee replacement",
            "hip replacement", "spine doctor", "shoulder specialist", "hand surgeon",
            "foot and ankle doctor", "orthopedic clinic", "ACL surgery", "orthopedic specialist",
            "physical therapy", "back pain doctor", "fracture care"
        ]
    },
    {
        id: "cardio",
        name: "Cardiovascular & Heart",
        subLines: ["General Cardiology", "Interventional Cardiology", "Heart Failure", "Vascular Surgery"],
        keywords: [
            "cardiologist", "heart specialist", "heart clinic", "chest pain doctor",
            "arrhythmia specialist", "vascular surgeon", "heart failure clinic",
            "cardiothoracic surgeon", "atrial fibrillation treatment", "blood pressure specialist",
            "cardiac rehab", "diagnostic cardiology", "preventative cardiology",
            "echocardiogram center", "heart rhythm doctor"
        ]
    },
    {
        id: "oncology",
        name: "Oncology & Cancer Center",
        subLines: ["Medical Oncology", "Radiation Oncology", "Surgical Oncology", "Breast Cancer", "Lung Cancer"],
        keywords: [
            "oncologist", "cancer center", "cancer specialist", "breast cancer doctor",
            "chemotherapy clinic", "radiation therapy", "surgical oncology", "hematologist",
            "lung cancer specialist", "infusion center", "cancer treatment",
            "colorectal cancer doctor", "prostate cancer specialist", "ovarian cancer doctor",
            "oncology clinic"
        ]
    },
    {
        id: "primary",
        name: "Primary Care & Family Medicine",
        subLines: ["Adult Medicine", "Pediatrics", "Internal Medicine", "Wellness Exams"],
        keywords: [
            "primary care physician", "family doctor", "PCP", "internal medicine",
            "pediatrician", "wellness exam", "annual physical", "general practitioner",
            "primary care clinic", "chronic disease management", "preventative care doctor",
            "vaccinations", "travel medicine", "women's health primary care", "men's health primary care"
        ]
    },
    {
        id: "womens",
        name: "Women's Health & OBGYN",
        subLines: ["Obstetrics", "Gynecology", "Maternal Fetal Medicine", "Pregnancy Care"],
        keywords: [
            "obgyn", "gynecologist", "obstetrician", "prenatal care",
            "maternal fetal medicine", "pregnancy doctor", "midwife",
            "fertility specialist", "menopause clinic", "womens health center",
            "papsmear", "birth control clinic", "infertility doctor",
            "pelvic health specialist", "gynecologic oncology"
        ]
    }
];

export const MARKETS: Market[] = ["Phoenix", "Denver"];

// Competitors per market
export const COMPETITORS: Record<Market, Competitor[]> = {
    Phoenix: [
        { id: "banner", name: "Banner Health", color: "#005EB8" },
        { id: "honor", name: "HonorHealth", color: "#63479B" },
        { id: "dignity", name: "Dignity Health", color: "#F58025" },
        { id: "mayo", name: "Mayo Clinic", color: "#BB133E" },
        { id: "abrazo", name: "Abrazo Health", color: "#003A70" },
        { id: "phx-childrens", name: "Phoenix Children's", color: "#00A9E0" }
    ],
    Denver: [
        { id: "uchealth", name: "UCHealth", color: "#C21B2F" },
        { id: "healthone", name: "HealthONE", color: "#009CA6" },
        { id: "scl", name: "Intermountain (SCL)", color: "#0057B8" },
        { id: "denver-health", name: "Denver Health", color: "#7B6129" },
        { id: "bch", name: "Boulder Community Health", color: "#0072CE" },
        { id: "childrens-co", name: "Children's Hospital Colorado", color: "#E35205" }
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

    // Cardio - Phoenix
    { id: "p12", text: "best cardiologist in Phoenix", theme: "Best Doctor", serviceLineId: "cardio", intentType: "High-intent", market: "Phoenix" },
    { id: "p13", text: "heart clinic Scottsdale", theme: "Local Clinic", serviceLineId: "cardio", intentType: "Local", market: "Phoenix" },

    // Oncology - Denver
    { id: "p14", text: "top oncologist in Denver", theme: "Best Doctor", serviceLineId: "oncology", intentType: "High-intent", market: "Denver" },
    { id: "p15", text: "cancer treatment centers Denver reviews", theme: "Centers reviews", serviceLineId: "oncology", intentType: "Info", market: "Denver" },

    // Primary/Womens - Denver
    { id: "p16", text: "primary care physician denver", theme: "PCP", serviceLineId: "primary", intentType: "Local", market: "Denver" },
    { id: "p17", text: "best obgyn in denver for pregnancy", theme: "OBGYN", serviceLineId: "womens", intentType: "High-intent", market: "Denver" },

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
