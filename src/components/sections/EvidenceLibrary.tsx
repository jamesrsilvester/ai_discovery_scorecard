import { useScorecard } from "@/context/ScorecardContext";
import { MOCK_RUNS, PROMPTS, MY_BRAND } from "@/data/mockData";
import { filterRuns } from "@/utils/analytics";
import { Search, ChevronDown, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function EvidenceLibrary() {
    const { selectedMarket, selectedServiceLine } = useScorecard();
    const filtered = filterRuns(MOCK_RUNS, { market: selectedMarket, serviceLine: selectedServiceLine });
    const [search, setSearch] = useState("");

    // Limit to 10 for performance in prototype
    const displayRuns = filtered
        .filter(r => {
            const p = PROMPTS.find(p => p.id === r.promptId);
            if (search && !p?.text.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .slice(0, 10);

    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Evidence Library</h3>
                    <p className="text-sm text-slate-500">Verify what AI models are actually saying.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search prompts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Prompt</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Source & Rank</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Response Snippet</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {displayRuns.map(run => {
                            const prompt = PROMPTS.find(p => p.id === run.promptId);
                            const iAmMentioned = run.entitiesDetected.includes(MY_BRAND);
                            return (
                                <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-slate-900 font-medium max-w-xs truncate">
                                        {prompt?.text}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-slate-700">{run.source}</span>
                                            <span className={`text-xs ${iAmMentioned ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {iAmMentioned ? (run.rank === 1 ? 'Rank 1' : 'Mentioned') : 'Not present'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500 max-w-md truncate">
                                        {run.responseSnippet}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center">
                <button className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 w-full">
                    Show more results <ChevronDown className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
