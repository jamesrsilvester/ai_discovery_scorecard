import Head from 'next/head';
import { ReactNode } from 'react';
import Header from './Header';
import FilterRow from './FilterRow';
import { ScorecardProvider } from '@/context/ScorecardContext';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <ScorecardProvider>
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                <Head>
                    <title>AI Discovery Scorecard</title>
                </Head>

                <Header />
                <FilterRow />

                <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {children}
                </main>
            </div>
        </ScorecardProvider>
    );
}
