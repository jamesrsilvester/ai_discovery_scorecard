import { useScorecard } from "@/context/ScorecardContext";
import { MOCK_RUNS, MARKETS } from "@/data/mockData";
import { filterRuns, calculateMetrics } from "@/utils/analytics";
import { MapPin } from "lucide-react";

export default function LocalVisibility() {
    const { setSelectedMarket } = useScorecard();

    // Calculate metrics per market
    const marketData = MARKETS.map(m => {
        const filtered = filterRuns(MOCK_RUNS, { market: m, serviceLine: "All" });
        const metrics = calculateMetrics(filtered);
        return {
            name: m,
            ...metrics
        };
    }).sort((a, b) => b.shareOfVoice - a.shareOfVoice);

    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Local Visibility</h3>
                    <p className="text-sm text-slate-500">Performance by Key Market</p>
                </div>
                <button className="text-sm text-indigo-600 font-medium hover:underline">View Map</button>
            </div>

            <div className="space-y-4">
                {marketData.map((m) => (
                    <div
                        key={m.name}
                        className="flex items-center p-3 border border-slate-100 rounded-lg hover:border-indigo-200 cursor-pointer"
                        onClick={() => setSelectedMarket(m.name)}
                    >
                        <div className="p-2 bg-indigo-50 rounded-full mr-4 text-indigo-600">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-slate-900">{m.name}</div>
                            <div className="text-xs text-slate-500">N={m.runs.length} prompts</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800">{m.shareOfVoice.toFixed(0)}%</div>
                            <div className="text-xs text-slate-500">Presence</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
