import { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TAXONOMY, MARKETS, COMPETITORS } from '@/data/mockData';
import { Play, Loader2, CheckCircle, AlertTriangle, TrendingUp, Target, Award, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface QueryResult {
    query: string;
    rawResponse: string;
    analysis: {
        entitiesDetected: string[];
        firstMentioned: string | null;
        rank: number | null;
    };
}

interface ApiResponse {
    success: boolean;
    targetBrand: string;
    queries: string[];
    results: QueryResult[];
    aggregate: {
        totalQueries: number;
        mentionCount: number;
        mentionRate: number;
        avgRank: number | null;
        firstMentionCount: number;
        allCompetitors: { name: string; count: number }[];
    };
}

export default function TestLive() {
    // Selection State
    const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
    const [selectedServiceLineId, setSelectedServiceLineId] = useState(TAXONOMY[0].id);
    const [targetBrand, setTargetBrand] = useState('');

    // Result State
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [tempQueries, setTempQueries] = useState<string[]>([]);
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    // Keyword Tuning State
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [customKeyword, setCustomKeyword] = useState('');

    // Derived State
    const competitorsForMarket = useMemo(() => {
        const comps = COMPETITORS[selectedMarket] || [];
        return comps.map(c => c.name);
    }, [selectedMarket]);

    // Set default brand when market changes
    useEffect(() => {
        if (competitorsForMarket.length > 0) {
            setTargetBrand(competitorsForMarket[0]);
        }
    }, [competitorsForMarket]);

    const activeServiceLine = TAXONOMY.find(s => s.id === selectedServiceLineId);

    // Reset keywords when service line changes
    useEffect(() => {
        setSelectedKeywords([]);
        setCustomKeyword('');
    }, [selectedServiceLineId]);

    const handleRun = async () => {
        setLoading(true);
        setLoadingStep(0);
        setError(null);
        setResult(null);

        try {
            // Step 1: Generate Queries first (fast)
            const userKeywords = [...selectedKeywords, ...(customKeyword ? [customKeyword] : [])];

            const genRes = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceLine: activeServiceLine?.name,
                    market: selectedMarket,
                    targetBrand: targetBrand,
                    step: 'generate',
                    userKeywords // Send the tuned keywords
                }),
            });
            const genData = await genRes.json();
            if (genData.success && genData.queries) {
                setTempQueries(genData.queries);
            }

            // Step 2: Full Analysis (slow)
            const res = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceLine: activeServiceLine?.name,
                    market: selectedMarket,
                    targetBrand: targetBrand,
                    queries: genData.queries || [] // Pass back the queries we just generated
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to fetch');
            }

            setResult(data);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingStep(0);
            setTempQueries([]);
        }
    };

    // Animate loading steps
    useEffect(() => {
        if (!loading) return;
        // 24 steps total: 1 (Gen) + 9 (Ask) + 9 (Analyze) + 5 (Detailed Aggregation)
        const stepCount = 24;
        const interval = 3600; // 3.6s per step
        const timers = Array.from({ length: stepCount }).map((_, i) =>
            setTimeout(() => setLoadingStep(i), i * interval)
        );
        return () => timers.forEach(t => clearTimeout(t));
    }, [loading]);

    const service = activeServiceLine?.name || 'service';
    const region = selectedMarket;

    const currentQueries = tempQueries.length > 0 ? tempQueries :
        (result?.queries.length ? result.queries : Array(9).fill(null));

    const loadingSteps = useMemo(() => [
        { label: `Identifying consumer keywords for ${service}...`, icon: '🔍' },
        // Asking steps
        ...currentQueries.map((q, i) => ({
            label: q ? `Asking: "${q}"` : `Asking variation ${i + 1} of consumer keyword...`,
            icon: '💬'
        })),
        // Analysis steps
        ...currentQueries.map((q, i) => ({
            label: q ? `Analyzing mentions for: "${q}"` : `Analyzing responses for keyword...`,
            icon: '📊'
        })),
        { label: 'Extracting insights from 9 datasets...', icon: '🧠' },
        { label: 'Calculating competitive SOV benchmarks...', icon: '📊' },
        { label: 'Mapping discovery proof points...', icon: '📍' },
        { label: 'Generating live discovery scorecard...', icon: '✨' },
        { label: 'Rendering comparative analysis charts...', icon: '🎨' },
    ], [currentQueries, service]);

    return (
        <AppLayout showFilters={false}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Live Data Test (ChatGPT)</h1>
                    <p className="text-slate-500">Simulate real patient behavior with 9 consumer-centric queries (3 keywords x 3 variations).</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* 1. Market Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">1. Geographic Region</label>
                            <select
                                value={selectedMarket}
                                onChange={(e) => setSelectedMarket(e.target.value as any)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                            >
                                {MARKETS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Service Line Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">2. Service Line</label>
                            <select
                                value={selectedServiceLineId}
                                onChange={(e) => setSelectedServiceLineId(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                            >
                                {TAXONOMY.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Target Brand Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">3. Your Healthcare System</label>
                            <select
                                value={targetBrand}
                                onChange={(e) => setTargetBrand(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                            >
                                {competitorsForMarket.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 4. Keyword Tuning Grid */}
                    <div className="border-t border-slate-100 pt-6 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-slate-700">4. Tune Keywords (Optional - select up to 5)</label>
                            <span className="text-xs text-slate-400 font-medium">{selectedKeywords.length}/5 selected</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                            {activeServiceLine?.keywords.map((kw) => {
                                const isSelected = selectedKeywords.includes(kw);
                                return (
                                    <button
                                        key={kw}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedKeywords(selectedKeywords.filter(k => k !== kw));
                                            } else if (selectedKeywords.length < 5) {
                                                setSelectedKeywords([...selectedKeywords, kw]);
                                            }
                                        }}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${isSelected
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        {kw}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add custom keyword..."
                                value={customKeyword}
                                onChange={(e) => setCustomKeyword(e.target.value)}
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Run Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleRun}
                            disabled={loading || !targetBrand}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Running 9 Queries...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" />
                                    Run Analysis
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-4xl animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900 text-lg">
                                    {loadingSteps[loadingStep]?.icon} {loadingSteps[loadingStep]?.label}
                                </div>
                                {result && (
                                    <div className="text-sm text-emerald-600 font-medium">Analysis Complete</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 space-y-8 animate-pulse">
                            {/* Skeleton Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-slate-50 h-24 rounded-xl border border-slate-100" />
                                ))}
                            </div>

                            {/* Skeleton List */}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="h-12 bg-slate-50 border-b border-slate-200" />
                                <div className="divide-y divide-slate-100">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="p-6 space-y-3">
                                            <div className="h-4 bg-slate-100 rounded w-3/4" />
                                            <div className="h-3 bg-slate-50 rounded w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skeleton Chart */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                                <div className="h-6 bg-slate-100 rounded w-1/4 mb-6" />
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="w-8 h-4 bg-slate-100 rounded" />
                                        <div className="flex-1 h-3 bg-slate-50 rounded-full" />
                                        <div className="w-20 h-4 bg-slate-100 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2 max-w-4xl">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Aggregate Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <Target className="w-4 h-4" />
                                    Mention Rate
                                </div>
                                <div className="text-3xl font-bold text-indigo-600">{result.aggregate.mentionRate}%</div>
                                <div className="text-xs text-slate-400">{result.aggregate.mentionCount} of {result.aggregate.totalQueries} queries</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    Avg Rank
                                </div>
                                <div className="text-3xl font-bold text-emerald-600">
                                    {result.aggregate.avgRank !== null ? `#${result.aggregate.avgRank}` : 'N/A'}
                                </div>
                                <div className="text-xs text-slate-400">when mentioned</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <Award className="w-4 h-4" />
                                    First Mentions
                                </div>
                                <div className="text-3xl font-bold text-amber-600">{result.aggregate.firstMentionCount}</div>
                                <div className="text-xs text-slate-400">top recommendation</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                                    <Users className="w-4 h-4" />
                                    Competitors
                                </div>
                                <div className="text-3xl font-bold text-slate-700">{result.aggregate.allCompetitors.length}</div>
                                <div className="text-xs text-slate-400">unique brands found</div>
                            </div>
                        </div>

                        {/* Query Results Detail */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-900">Query Results for {result.targetBrand}</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {result.results.map((r, i) => (
                                    <div key={i} className="border-b last:border-b-0 border-slate-100">
                                        <button
                                            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                                            className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-900 mb-1">"{r.query}"</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {r.analysis.entitiesDetected?.slice(0, 5).map((entity, j) => (
                                                        <span
                                                            key={j}
                                                            className={`px-2 py-0.5 text-xs rounded ${entity === result.targetBrand
                                                                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                                                : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                        >
                                                            {entity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right shrink-0">
                                                    {r.analysis.rank !== null ? (
                                                        <div className={`text-lg font-bold ${r.analysis.rank === 1 ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                            #{r.analysis.rank}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-red-500 font-medium">Not Mentioned</div>
                                                    )}
                                                    {r.analysis.firstMentioned === result.targetBrand && (
                                                        <div className="text-xs text-amber-600 font-semibold">★ First</div>
                                                    )}
                                                </div>
                                                {expandedIndex === i ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                            </div>
                                        </button>

                                        {expandedIndex === i && (
                                            <div className="px-4 pb-6 bg-slate-50/50 animate-in slide-in-from-top-1 duration-200">
                                                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4 shadow-inner">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Query</div>
                                                        <div className="text-sm text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100">{r.query}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">All Detected Brands</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {r.analysis.entitiesDetected.length > 0 ? r.analysis.entitiesDetected.map((brand, idx) => (
                                                                <span key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">
                                                                    {brand}
                                                                </span>
                                                            )) : <span className="text-xs text-slate-400">No brands detected</span>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Raw AI Response Excerpt</div>
                                                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                            {r.rawResponse}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Competitors Found */}
                        {result.aggregate.allCompetitors.length > 0 && (
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                                    Competitor Share of Voice
                                </h4>
                                <div className="space-y-3">
                                    {result.aggregate.allCompetitors.map((comp, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-8 font-mono text-sm text-slate-400 font-bold">#{i + 1}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-semibold text-slate-700">{comp.name}</span>
                                                    <span className="text-slate-500">{Math.round((comp.count / result.aggregate.totalQueries) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                                                        style={{ width: `${(comp.count / result.aggregate.totalQueries) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-24 text-right text-xs font-bold text-slate-400 uppercase tracking-tight">
                                                {comp.count} / {result.aggregate.totalQueries} mentions
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
