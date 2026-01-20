import { useScorecard } from "@/context/ScorecardContext";
import { MOCK_RUNS, TAXONOMY } from "@/data/mockData";
import { filterRuns, getServiceLineBreakdown } from "@/utils/analytics";
import { ChevronRight, AlertCircle } from "lucide-react";

export default function ServiceLineCoverage() {
    const { selectedMarket, setSelectedServiceLine, setOpenDrillDown } = useScorecard();
    // Filter only by market here, because we want to compare ALL service lines
    const filtered = filterRuns(MOCK_RUNS, { market: selectedMarket, serviceLine: "All" });
    const breakdown = getServiceLineBreakdown(filtered, TAXONOMY);

    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Coverage by Service Line</h3>
                    <p className="text-sm text-slate-500">Ranked by lowest presence (weakest first)</p>
                </div>
                <div className="flex gap-2">
                    <button className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded">High-intent only</button>
                    <button className="text-xs font-medium px-2 py-1 text-slate-500 hover:bg-slate-50 rounded">All prompts</button>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {breakdown.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 flex items-center hover:bg-slate-50 cursor-pointer transition-colors group"
                        onClick={() => {
                            setSelectedServiceLine(item.id);
                            // In real app, this would open the detailed panel
                            // setOpenDrillDown(item.id); 
                        }}
                    >
                        <div className="w-1/3">
                            <div className="font-semibold text-slate-800">{item.name}</div>
                            <div className="text-xs text-slate-500 truncate">{item.subLines.join(", ")}</div>
                        </div>

                        <div className="flex-1 px-4">
                            <div className="flex justify-between mb-1 text-xs font-medium text-slate-500">
                                <span>Presence: {item.presence.toFixed(0)}%</span>
                                <span>Gap: {item.gap > 0 ? `-${item.gap.toFixed(0)}%` : 'Leading'}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                                {/* Competitor marker (simplified visual) */}
                                {item.gap > 0 && (
                                    <div
                                        className="absolute top-0 h-full bg-rose-200"
                                        style={{ left: `${item.presence}%`, width: `${item.gap}%` }}
                                    />
                                )}
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.presence}%` }}></div>
                            </div>
                        </div>

                        <div className="w-1/4 px-4 text-right">
                            <div className="text-xs text-slate-400 uppercase tracking-wider">Top Rival</div>
                            <div className="text-sm font-medium text-slate-700">{item.topCompetitor}</div>
                        </div>

                        <div className="pl-4 text-slate-300 group-hover:text-indigo-500">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
