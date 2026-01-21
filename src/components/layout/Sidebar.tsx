import Link from 'next/link';
import Image from 'next/image';
import {
    Settings,
    ChevronDown,
    ChevronRight,
    Sliders,
    GitMerge,
    BarChart,
    Users,
    CheckCircle,
    Play,
    Activity,
    Shield,
    Server
} from 'lucide-react';
import { useState } from 'react';

// New Type for nav items to handle badges
type NavItemProps = {
    icon?: any;
    label: string;
    active?: boolean;
    expanded?: boolean;
    hasSubmenu?: boolean;
    onClick?: () => void;
    badge?: string; // For "NEW" badges
};

const NavItem = ({
    icon: Icon,
    label,
    active = false,
    expanded = false,
    hasSubmenu = false,
    onClick,
    badge
}: NavItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`
        flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors select-none group
        ${active ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
      `}
        >
            {Icon && <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />}
            <span className="flex-1">{label}</span>

            {badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 bg-emerald-200 rounded uppercase tracking-wide">
                    {badge}
                </span>
            )}

            {hasSubmenu && (
                expanded ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />
            )}
        </div>
    );
};

export default function Sidebar() {
    const [internalToolsExpanded, setInternalToolsExpanded] = useState(false);
    const [settingsExpanded, setSettingsExpanded] = useState(false);

    const prefix = process.env.NODE_ENV === 'production' ? '/ai_discovery_scorecard' : '';

    return (
        <div className="w-64 h-full bg-[#1e293b] flex flex-col border-r border-slate-700">
            {/* Brand */}
            <div className="h-16 flex items-center gap-3 px-4 shrink-0">
                <Image
                    src={`${prefix}/freshpaint-logo.png`}
                    alt="Freshpaint"
                    width={120}
                    height={32}
                    className="object-contain"
                />
            </div>

            {/* Account Switcher Mock */}
            <div className="mx-4 mb-4 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors">
                <div className="flex flex-col min-w-0">
                    <span className="text-xs text-slate-400 font-medium">Fresh Health</span>
                    <span className="text-sm text-white font-bold truncate">James</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {/* Setup */}
                <NavItem icon={Sliders} label="Setup" />

                {/* Events */}
                <NavItem icon={GitMerge} label="Events" hasSubmenu />

                {/* Integrations */}
                <NavItem icon={Server} label="Integrations" hasSubmenu />

                {/* Insights */}
                <NavItem icon={BarChart} label="Insights" hasSubmenu badge="NEW" active={true} expanded={true} />

                {/* Audiences */}
                <NavItem icon={Users} label="Audiences" hasSubmenu />

                {/* Consent */}
                <NavItem icon={CheckCircle} label="Consent" hasSubmenu badge="NEW" />

                {/* Video */}
                <NavItem icon={Play} label="Video" />

                {/* Web Trackers */}
                <NavItem icon={Activity} label="Web Trackers" />

                {/* Internal Tools */}
                <div className="pt-4 pb-1">
                    <NavItem
                        icon={Shield}
                        label="Internal Tools"
                        hasSubmenu
                        expanded={internalToolsExpanded}
                        onClick={() => setInternalToolsExpanded(!internalToolsExpanded)}
                    />
                </div>

                {/* WTM Internal */}
                <NavItem icon={Server} label="WTM Internal" hasSubmenu />

                {/* Settings */}
                <NavItem
                    icon={Settings}
                    label="Settings"
                    hasSubmenu
                    expanded={settingsExpanded}
                    onClick={() => setSettingsExpanded(!settingsExpanded)}
                />
            </div>
        </div>
    );
}
