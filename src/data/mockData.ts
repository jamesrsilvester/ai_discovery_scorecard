export type IntentType = "High-intent" | "Local" | "Info" | "Cost";
export type Market = "Phoenix" | "Denver";
export type AIPlatform = "ChatGPT" | "Perplexity" | "Google AI Overviews" | "Gemini";

export interface ServiceLine {
    id: string;
    name: string;
    subLines: string[];
    keywords: string[];
    comprehensiveKeywords: string[];
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
        ],
        comprehensiveKeywords: [
            "obesity medicine", "weight loss injections", "wegovy", "ozempic", "gastric balloon",
            "endoscopic sleeve gastroplasty", "ESG weight loss", "duodenal switch", "bariatric nutritionist",
            "weight loss support group", "gastric bypass revision", "bariatric dietitian",
            "obesity counseling", "BMI reduction surgery", "weight loss for diabetes",
            "gastric pleat surgery", "swallowable weight loss pill", "medical weight loss programs",
            "vsg surgery", "rny bypass", "minigastric bypass", "medical supervised weight loss",
            "weight loss surgery reviews", "bariatric surgeons directory", "gastric bypass cost",
            "weight loss clinic denver", "bariatric surgery phx", "weight loss programs near me",
            "best weight loss doctors", "non-surgical fat reduction", "metabolic health clinic",
            "struggling to lose weight", "why can't I lose weight", "weight loss shots", "help with emotional eating",
            "plus size health", "carrying too much weight", "tiring easily due to weight", "knee pain from weight"
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
        ],
        comprehensiveKeywords: [
            "ulcerative colitis specialist", "celiac disease doctor", "irritable bowel syndrome",
            "ibs treatment", "gerd specialist", "esophageal manometry", "motility clinic",
            "hepatologist", "fatty liver treatment", "hepatitis c doctor", "pancreas specialist",
            "bile duct surgery", "colon cancer prevention", "hemorrhoid treatment", "polyps removal",
            "sigmoidoscopy", "virtual colonoscopy", "capsule endoscopy", "pillcam", "stool test",
            "fit test", "breath test for sibo", "sibo specialist", "leaky gut doctor",
            "functional gi disorders", "fecal transplant", "microbiome analysis",
            "bloating and gas treatment", "chronic constipation doctor", "diarrhea specialist",
            "rectal bleeding", "barrett's esophagus", "swallowing disorders specialist",
            "gallbladder doctor", "gallstones treatment", "gi clinic phoenix", "gi doctor denver",
            "stomach ache", "bloat", "gas", "funny feeling in stomach", "heartburn", "indigestion",
            "upset tummy", "irregularity", "poop problems", "tummy trouble", "acid in throat", "burning chest"
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
        ],
        comprehensiveKeywords: [
            "sports injury specialist", "rotator cuff repair", "meniscus tear surgery", "arthroscopy",
            "pain management clinic", "rheumatology", "arthritis doctor", "osteoarthritis treatment",
            "rheumatoid arthritis", "carpal tunnel surgery", "scoliosis specialist",
            "herniated disc treatment", "sciatica doctor", "lower back pain relief",
            "partial knee replacement", "total hip arthroplasty", "robotic joint surgery",
            "mako robotic surgery", "orthobiologics", "prp injection", "stem cell therapy for joints",
            "cortisone shot", "physical medicine and rehab", "physiatry", "podiatrist",
            "bunion surgery", "plantar fasciitis treatment", "stress fracture",
            "tennis elbow treatment", "golfer's elbow", "bursitis specialist", "ligament repair",
            "tendonitis treatment", "orthopedic oncology", "pediatric orthopedics", "concussion clinic",
            "knee hurts", "stiff joints", "sore back", "sprained ankle", "broken foot", "can't walk on foot",
            "shoulder pop", "crick in neck", "hip hurts when walking", "swollen knee", "wrist pain typing",
            "clicking finger", "back pain"
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
        ],
        comprehensiveKeywords: [
            "stress test", "calcium score", "heart scan", "pacemaker specialist", "icd doctor",
            "valve replacement", "taver procedure", "mitraclip", "heart murmur doctor",
            "carotid artery disease", "peripheral artery disease", "pad treatment",
            "varicose vein specialist", "deep vein thrombosis", "dvt doctor",
            "stroke prevention", "atrial fibrillation ablation", "afib clinic", "holter monitor",
            "cardiac catheterization", "angioplasty", "stent placement", "coronary artery disease",
            "clogged arteries doctor", "high cholesterol specialist", "statin clinic",
            "cardiovascular screening", "sports cardiology", "ejection fraction improvement",
            "chest tightness", "fluttering heart", "skipping a beat", "out of breath", "legs swelling",
            "dizzy when standing", "racing heart", "pressure in chest", "tiring quickly", "weakness"
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
        ],
        comprehensiveKeywords: [
            "second opinion cancer", "cancer immunotherapy", "targeted therapy", "palliative care",
            "genetic testing for cancer", "cancer survivorship", "clinical trials for cancer",
            "bone marrow transplant", "stem cell transplant", "leukemia specialist",
            "lymphoma doctor", "multiple myeloma specialist", "melanoma clinic",
            "skin cancer specialist", "pancreatic cancer doctor", "liver cancer specialist",
            "brain tumor center", "neuro-oncology", "gynecologic oncology", "urologic oncology",
            "pediatric oncology", "cancer support services", "integrative oncology",
            "cancer infusion denver", "oncology specialist phoenix",
            "weird mole", "lump in breast", "pain that won't go away", "unexplained weight loss",
            "night sweats", "always tired", "hard lump", "changing skin spot", "coughing up blood"
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
        ],
        comprehensiveKeywords: [
            "same day doctor", "urgent care", "telehealth primary care", "concierge medicine",
            "executive physical", "geriatrician", "senior care doctor", "asthma management",
            "diabetes specialist primary care", "blood pressure clinic", "cholesterol management",
            "obesity medicine primary care", "smoking cessation", "mental health in primary care",
            "anxiety doctor pcp", "depression treatment pcp", "allergy testing pcp",
            "flu shot clinic", "covid testing", "sports physicals", "camp physicals",
            "employment physicals", "dot physicals", "immigration physicals",
            "bad cold", "pink eye", "rash", "fever", "sore throat", "checkup", "feeling under the weather",
            "ear ache", "itchy skin", "flu symptoms", "migraine", "headache", "sinus pressure"
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
        ],
        comprehensiveKeywords: [
            "high risk pregnancy", "endometriosis specialist", "pcos clinic", "fibroid treatment",
            "hysterectomy options", "minimally invasive gynecology", "urogynecology",
            "pelvic organ prolapse", "urinary incontinence women", "sexual health clinic",
            "adolescent gynecology", "pediatric gynecology", "menopause hormone therapy",
            "bioidentical hormones", "vulvar disorders", "breast health", "mammogram screening",
            "breast ultrasound", "in vitro fertilization", "ivf center", "egg freezing",
            "iui treatment", "reproductive endocrinology",
            "period pain", "cramps", "newly pregnant", "pregnancy test", "missed period",
            "hot flashes", "night sweats", "yeast infection", "burning when peeing", "lump in chest", "planning a baby"
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
