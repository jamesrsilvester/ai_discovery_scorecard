import { useScorecard } from "@/context/ScorecardContext";
import { MOCK_RUNS, MY_BRAND } from "@/data/mockData";
import { filterRuns, getTrendData } from "@/utils/analytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function ShareOfVoice() {
    const { selectedMarket, selectedServiceLine } = useScorecard();
    const filtered = filterRuns(MOCK_RUNS, { market: selectedMarket, serviceLine: selectedServiceLine });
    const data = getTrendData(filtered);

    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">Share of Voice Trends</h3>
                <p className="text-sm text-slate-500">Daily mention frequency vs Competitors</p>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            unit="%"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#F1F5F9' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey={MY_BRAND} name="My Brand" stackId="a" fill="#4F46E5" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Competitor" name="Competitors" stackId="a" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
