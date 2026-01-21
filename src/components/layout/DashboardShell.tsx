import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Bell, HelpCircle } from 'lucide-react';

export default function DashboardShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                    {/* Breadcrumb / Page Title */}
                    <div className="font-semibold text-lg text-slate-800">
                        AI Insights
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            {/* Notification badge */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-white"></span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <HelpCircle className="w-5 h-5" />
                        </button>

                        {/* User Avatar */}
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium cursor-pointer ring-2 ring-transparent hover:ring-indigo-100 transition-all">
                            AN
                        </div>
                    </div>
                </div>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-auto">
                    {/* This is the wrapped content (The 'pink box') */}
                    {children}
                </div>
            </div>
        </div>
    );
}
