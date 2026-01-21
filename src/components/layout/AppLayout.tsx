import Head from 'next/head';
import { ReactNode } from 'react';
import Header from './Header';
import FilterRow from './FilterRow';
import { ScorecardProvider } from '@/context/ScorecardContext';
import DashboardShell from './DashboardShell';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <ScorecardProvider>
            <DashboardShell>
                <div className="min-h-full font-sans text-slate-900 bg-slate-50">
                    <Head>
                        <title>AI Discovery Scorecard</title>
                    </Head>

                    <Header />
                    <FilterRow />

                    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                        {children}
                    </main>
                </div>
            </DashboardShell>
        </ScorecardProvider>
    );
}
