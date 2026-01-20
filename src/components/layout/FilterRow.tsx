import { useScorecard } from "@/context/ScorecardContext";
import { MARKETS, TAXONOMY } from "@/data/mockData";
import { Filter, ChevronDown } from "lucide-react";

export default function FilterRow() {
    const { selectedMarket, setSelectedMarket, selectedServiceLine, setSelectedServiceLine } = useScorecard();

    return (
        <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters:</span>
            </div>

            {/* Market Selector */}
            <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value as any)}
                className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="All">All Markets</option>
                {MARKETS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>

            {/* Service Line Selector */}
            <select
                value={selectedServiceLine}
                onChange={(e) => setSelectedServiceLine(e.target.value)}
                className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="All">All Service Lines</option>
                {TAXONOMY.map((sl) => (
                    <option key={sl.id} value={sl.id}>{sl.name}</option>
                ))}
            </select>

            <div className="w-px h-6 bg-slate-200 mx-2" />

            {/* AI Source (Hardcoded for prototype) */}
            <select className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md text-slate-500">
                <option>All AI Sources</option>
                <option>ChatGPT</option>
                <option>Perplexity</option>
                <option>Google AI</option>
            </select>

            <div className="flex-1" />

            {/* Query Set */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium border border-indigo-100">
                <span>Set: High-intent Patient Discovery</span>
                <ChevronDown className="w-3 h-3" />
            </div>

        </div>
    );
}
