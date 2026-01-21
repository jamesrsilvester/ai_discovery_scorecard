import Link from 'next/link';
import {
    LayoutGrid,
    Terminal,
    BarChart2,
    Puzzle,
    Activity,
    FileText,
    Video,
    Settings,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const NavItem = ({
    icon: Icon,
    label,
    active = false,
    expanded = false,
    hasSubmenu = false,
    onClick
}: {
    icon: any,
    label: string,
    active?: boolean,
    expanded?: boolean,
    hasSubmenu?: boolean,
    onClick?: () => void
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors
        ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
      `}
        >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{label}</span>
            {hasSubmenu && (
                expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
        </div>
    );
};

const SubNavItem = ({ label, active = false }: { label: string, active?: boolean }) => {
    return (
        <div className={`
      px-4 py-2 pl-12 text-sm cursor-pointer transition-colors
      ${active ? 'text-white font-medium bg-slate-800/50' : 'text-slate-400 hover:text-white'}
    `}>
            {label}
        </div>
    );
};

export default function Sidebar() {
    const [marketingExpanded, setMarketingExpanded] = useState(true);

    return (
        <div className="w-64 h-full bg-[#1e293b] flex flex-col border-r border-slate-700"> {/* Dark background matching screenshot */}
            {/* Brand */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-700/50">
                <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    {/* Simple logo shape */}
                    <div className="w-4 h-4 bg-white rounded-sm opacity-50" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Freshpaint</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
                {/* Main Section */}
                <div className="px-2">
                    <div className="mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Main
                    </div>
                    <NavItem icon={LayoutGrid} label="Production" hasSubmenu />
                </div>

                <div className="my-4 h-px bg-slate-700/50 mx-4" />

                <div className="px-2 space-y-1">
                    <NavItem icon={Terminal} label="SDK Setup" hasSubmenu />

                    <NavItem
                        icon={BarChart2}
                        label="Marketing"
                        active={true} // Parent active because child is active
                        hasSubmenu
                        expanded={marketingExpanded}
                        onClick={() => setMarketingExpanded(!marketingExpanded)}
                    />

                    {marketingExpanded && (
                        <div className="space-y-1 mb-2">
                            <SubNavItem label="Ad Performance" />
                            <SubNavItem label="Audiences" />
                            <SubNavItem label="Insights" active={true} />
                        </div>
                    )}

                    <NavItem icon={Puzzle} label="Integrations" hasSubmenu />
                    <NavItem icon={Activity} label="Events" hasSubmenu />
                    <NavItem icon={FileText} label="Forms" />
                    <NavItem icon={Video} label="Video" />
                    <NavItem icon={Settings} label="Settings" hasSubmenu />
                </div>
            </div>

            {/* User / Footer area if needed */}
        </div>
    );
}
