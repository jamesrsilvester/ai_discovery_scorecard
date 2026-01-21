import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PROMPTS } from '@/data/mockData';
import { Play, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TestLive() {
    const [selectedPromptId, setSelectedPromptId] = useState(PROMPTS[0].id);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const prompt = PROMPTS.find(p => p.id === selectedPromptId);
            if (!prompt) return;

            const res = await fetch('/api/chatgpt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promptText: prompt.text, market: prompt.market }),
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

    const selectedPrompt = PROMPTS.find(p => p.id === selectedPromptId);

    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Live Data Test (ChatGPT)</h1>
                    <p className="text-slate-500">Select a prompt to run a live query against GPT-4 and analyze the results.</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
                    <div className="flex gap-4 items-end mb-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Select Prompt</label>
                            <select
                                value={selectedPromptId}
                                onChange={(e) => setSelectedPromptId(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                            >
                                {PROMPTS.map(p => (
                                    <option key={p.id} value={p.id}>
                                        [{p.market}] {p.text.length > 50 ? p.text.substring(0, 50) + '...' : p.text}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleRun}
                            disabled={loading}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                                <p className="mt-2 text-xs opacity-75">Did you add OPENAI_API_KEY to .env.local?</p>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Analysis Card */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Analysis Result
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-white rounded border border-slate-100 shadow-sm">
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Your Rank</div>
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
                                            <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">
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
