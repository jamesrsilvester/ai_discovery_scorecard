import { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TAXONOMY, MARKETS, COMPETITORS } from '@/data/mockData';
import { Play, Loader2, CheckCircle, AlertTriangle, TrendingUp, Target, Award, Users } from 'lucide-react';

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
        allCompetitors: string[];
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
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const handleRun = async () => {
        setLoading(true);
        setLoadingStep(0);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceLine: activeServiceLine?.name,
                    market: selectedMarket,
                    targetBrand: targetBrand
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
        }
    };

    // Animate loading steps
    useEffect(() => {
        if (!loading) return;
        const steps = [
            { delay: 0 },      // Step 0: Generating queries
            { delay: 1500 },   // Step 1: Query 1 - asking
            { delay: 3000 },   // Step 2: Query 2 - asking
            { delay: 4500 },   // Step 3: Query 3 - asking
            { delay: 6000 },   // Step 4: Query 4 - asking
            { delay: 7500 },   // Step 5: Query 5 - asking
            { delay: 9000 },   // Step 6: Analyzing 1
            { delay: 10500 },  // Step 7: Analyzing 2
            { delay: 12000 },  // Step 8: Analyzing 3
            { delay: 13500 },  // Step 9: Analyzing 4
            { delay: 15000 },  // Step 10: Analyzing 5
            { delay: 16500 },  // Step 11: Aggregating
        ];
        const timers = steps.map((step, i) =>
            setTimeout(() => setLoadingStep(i), step.delay)
        );
        return () => timers.forEach(t => clearTimeout(t));
    }, [loading]);

    const service = activeServiceLine?.name || 'service';
    const region = selectedMarket;

    const loadingSteps = [
        { label: `Generating 5 query variations for ${service}...`, icon: '🔍' },
        { label: `Asking: "best ${service} in ${region}"`, icon: '💬' },
        { label: `Asking: "${service} specialists near me"`, icon: '💬' },
        { label: `Asking: "top rated ${service} doctors in ${region}"`, icon: '💬' },
        { label: `Asking: "recommended ${service} clinics in ${region}"`, icon: '💬' },
        { label: `Asking: "${service} provider reviews in ${region}"`, icon: '💬' },
        { label: `Analyzing: "best ${service} in ${region}"`, icon: '📊' },
        { label: `Analyzing: "${service} specialists near me"`, icon: '📊' },
        { label: `Analyzing: "top rated ${service} doctors in ${region}"`, icon: '📊' },
        { label: `Analyzing: "recommended ${service} clinics in ${region}"`, icon: '📊' },
        { label: `Analyzing: "${service} provider reviews in ${region}"`, icon: '📊' },
        { label: 'Aggregating results...', icon: '✨' },
    ];

    return (
        <AppLayout showFilters={false}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Live Data Test (ChatGPT)</h1>
                    <p className="text-slate-500">Configure your target and run 5 query variations with aggregated results.</p>
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
                                    Running 5 Queries...
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

                {/* Loading State */}
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
                                <div className="text-sm text-slate-500">This typically takes 10-15 seconds</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {loadingSteps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < loadingStep ? 'bg-emerald-100 text-emerald-600' :
                                        i === loadingStep ? 'bg-indigo-100 text-indigo-600 animate-pulse' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {i < loadingStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={`text-sm transition-colors ${i < loadingStep ? 'text-emerald-600' :
                                        i === loadingStep ? 'text-slate-900 font-medium' :
                                            'text-slate-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
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
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Competitors Found */}
                        {result.aggregate.allCompetitors.length > 0 && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Competitors Detected</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.aggregate.allCompetitors.map((comp, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                            {comp}
                                        </span>
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
