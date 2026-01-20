import { useScorecard } from "@/context/ScorecardContext";
import { MOCK_RUNS, TAXONOMY, MARKETS } from "@/data/mockData";
import { filterRuns, getServiceLineBreakdown } from "@/utils/analytics";
import { AlertTriangle, Lightbulb, ExternalLink } from "lucide-react";

export default function RiskOpportunities() {
    const { selectedMarket } = useScorecard();
    // Logic to find risks
    const risks = [];

    // Check Market Risks
    const marketCheck = MARKETS.find(m => m === selectedMarket || selectedMarket === "All");
    if (marketCheck) {
        // This logic is simplified for the prototype
        risks.push({
            id: 'r1',
            title: `Competitor dominance in Ortho (${selectedMarket === 'All' ? 'Phoenix' : marketCheck})`,
            severity: "High",
            desc: "Banner Health appears in 80% of top queries.",
            action: "Review Ortho landing pages",
            link: "#"
        });
    }

    // Check Service Line Risks
    const slBreakdown = getServiceLineBreakdown(MOCK_RUNS, TAXONOMY);
    const weakest = slBreakdown[0]; // Sorted by presence ascending
    if (weakest.presence < 30) {
        risks.push({
            id: 'r2',
            title: `Low visibility in ${weakest.name}`,
            severity: "Medium",
            desc: `Only ${weakest.presence.toFixed(0)}% presence. Competitors are winning high-intent queries.`,
            action: "Create dedicated content cluster",
            link: "#"
        });
    }

    // Opportunities: Prompts with 0 presence
    const allRuns = filterRuns(MOCK_RUNS, { market: selectedMarket, serviceLine: "All" });
    const missedPrompts = allRuns
        .filter(r => !r.entitiesDetected.includes("Acme Health"))
        .slice(0, 5)
        .map(r => ({
            id: r.promptId,
            theme: "Unknown Theme", // ID lookup needed in real app
            market: "Unknown",
            topComp: r.firstMentioned || "None"
        }));

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Flags */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    Risk Flags
                </h3>
                <div className="space-y-3">
                    {risks.map(risk => (
                        <div key={risk.id} className="p-4 bg-rose-50 border border-rose-100 rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-rose-800 text-sm uppercase tracking-wide">{risk.severity} Severity</span>
                                <a href={risk.link} className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1">
                                    View examples <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                            <div className="font-semibold text-slate-800 mb-1">{risk.title}</div>
                            <div className="text-sm text-slate-600 mb-3">{risk.desc}</div>
                            <div className="text-sm font-medium text-rose-700 bg-white bg-opacity-50 px-3 py-1.5 rounded inline-block">
                                Suggestion: {risk.action}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Opportunities */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Top Opportunities
                </h3>
                <p className="text-sm text-slate-500 mb-4">High-intent queries where you are missing.</p>

                <div className="overflow-hidden border border-slate-100 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Topic</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Top Competitor</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {/* Mock rows for opportunities */}
                            <tr>
                                <td className="px-4 py-3 text-sm text-slate-700 font-medium">Gastric Bypass Cost</td>
                                <td className="px-4 py-3 text-sm text-slate-500">Banner Health</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-xs text-indigo-600 font-medium hover:underline">Add to set</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-sm text-slate-700 font-medium">Ortho Urgent Care</td>
                                <td className="px-4 py-3 text-sm text-slate-500">The CORE Institute</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-xs text-indigo-600 font-medium hover:underline">Add to set</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-sm text-slate-700 font-medium">Best GI Doctor</td>
                                <td className="px-4 py-3 text-sm text-slate-500">Mayo Clinic</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-xs text-indigo-600 font-medium hover:underline">Add to set</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
