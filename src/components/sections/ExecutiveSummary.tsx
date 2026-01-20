import { useScorecard } from "@/context/ScorecardContext";
import { MOCK_RUNS, MY_BRAND } from "@/data/mockData";
import { calculateMetrics, filterRuns, getCompetitorShare } from "@/utils/analytics";
import { ArrowUpRight, ArrowDownRight, Info, AlertTriangle } from "lucide-react";

export default function ExecutiveSummary() {
    const { selectedMarket, selectedServiceLine } = useScorecard();

    const filtered = filterRuns(MOCK_RUNS, { market: selectedMarket, serviceLine: selectedServiceLine });
    const metrics = calculateMetrics(filtered);
    const competitors = getCompetitorShare(filtered, selectedMarket);

    // Mock Trend for V1
    const trend = +2.4;
    const isPositive = trend > 0;

    return (
        <section className="space-y-6">

            <div className="flex gap-6">
                {/* A. Primary KPI Card (Hero) */}
                <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <div className="w-32 h-32 bg-indigo-600 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    </div>

                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-slate-700">AI Share of Voice</h2>
                            <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(trend)}% vs last 28d
                        </div>
                    </div>

                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold text-slate-900">{metrics.shareOfVoice.toFixed(1)}%</span>
                        <span className="text-sm text-slate-500 font-medium">mentions in replies</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                            <div className="text-xs text-indigo-600 uppercase font-semibold tracking-wider">First Mention</div>
                            <div className="text-xl font-bold text-indigo-900">{metrics.firstMention.toFixed(1)}%</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Not Mentioned</div>
                            <div className="text-xl font-bold text-slate-700">{(100 - metrics.shareOfVoice).toFixed(1)}%</div>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-400">
                        N={filtered.length} prompts • Refreshed 2h ago
                    </div>
                </div>

                {/* B. Competitive Snapshot */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">You vs Top Competitors</h3>
                        <div className="space-y-4">
                            {/* My Brand */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-indigo-700">{MY_BRAND}</span>
                                    <span className="font-bold">{metrics.shareOfVoice.toFixed(0)}%</span>
                                </div>
                                <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${metrics.shareOfVoice}%` }}></div>
                                </div>
                            </div>

                            {/* Competitors */}
                            {competitors.map((comp, i) => (
                                <div key={comp.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-600">{comp.name}</span>
                                        <span className="text-slate-500">{comp.share.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-400 rounded-full" style={{ width: `${comp.share}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* C. Risk Summary */}
            <div className="flex gap-4">
                <RiskChip label="High-risk Market" value="Phoenix (Ortho)" priority="high" />
                <RiskChip label="Service Line at Risk" value="Medical Weight Loss" priority="medium" />
                <RiskChip label="Competitor Surge" value="Banner Health (+12%)" priority="low" />
            </div>

        </section>
    );
}

function RiskChip({ label, value, priority }: { label: string, value: string, priority: 'high' | 'medium' | 'low' }) {
    const colors = {
        high: "bg-rose-50 border-rose-100 text-rose-700",
        medium: "bg-amber-50 border-amber-100 text-amber-700",
        low: "bg-slate-50 border-slate-100 text-slate-600"
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${colors[priority]} flex-1`}>
            {priority === 'high' && <AlertTriangle className="w-5 h-5" />}
            {priority === 'medium' && <Info className="w-5 h-5" />}
            <div>
                <div className="text-xs uppercase font-bold opacity-75">{label}</div>
                <div className="font-semibold">{value}</div>
            </div>
        </div>
    );
}
