import { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { TAXONOMY, MARKETS, COMPETITORS } from '@/data/mockData';
import { Play, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TestLive() {
    // Selection State
    const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
    const [selectedServiceLineId, setSelectedServiceLineId] = useState(TAXONOMY[0].id);
    const [targetBrand, setTargetBrand] = useState('');

    // Result State
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
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

    // Dynamic Prompt
    const generatedPrompt = `Best ${activeServiceLine?.name} in ${selectedMarket}`;

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    promptText: generatedPrompt,
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
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Live Data Test (ChatGPT)</h1>
                    <p className="text-slate-500">Configure your target query and run a live analysis.</p>
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

                    {/* Preview Box */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Generated Query</div>
                            <div className="font-mono text-slate-700 text-sm">{generatedPrompt}</div>
                        </div>
                        <button
                            onClick={handleRun}
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Run Live Analysis
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm mb-6 flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <div>
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Mock Warning */}
                            {result.isMock && (
                                <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
                                    <strong>Note:</strong> OpenAI API Quota exceeded. showing mock data for demonstration.
                                </div>
                            )}

                            {/* Analysis Card */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Analysis for {targetBrand}
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-white rounded border border-slate-100 shadow-sm">
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Rank</div>
                                        <div className="text-2xl font-bold text-indigo-600">
                                            {result.analysis.rank !== null ? `#${result.analysis.rank}` : 'Not Ranked'}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white rounded border border-slate-100 shadow-sm col-span-2">
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">First Mentioned</div>
                                        <div className="text-lg font-medium text-slate-900">
                                            {result.analysis.firstMentioned || 'None'}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Entities Detected</div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.analysis.entitiesDetected?.map((entity: string, i: number) => (
                                            <span key={i} className={`px-2 py-1 border rounded text-xs font-medium ${entity === targetBrand ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                                                {entity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Raw Response */}
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2">Raw ChatGPT Response</h3>
                                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                                    {result.rawResponse}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
