import { Building, Calendar, Settings, Share } from "lucide-react";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">AI Discovery Scorecard</h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Acme Health</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full" />
                        <span className="text-emerald-600 font-medium">Pro Plan</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    Last 28 Days
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                    <Share className="w-4 h-4 text-slate-500" />
                    Export
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
