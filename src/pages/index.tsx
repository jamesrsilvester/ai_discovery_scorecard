import AppLayout from "@/components/layout/AppLayout";
import ExecutiveSummary from "@/components/sections/ExecutiveSummary";
import ShareOfVoice from "@/components/sections/ShareOfVoice";
import ServiceLineCoverage from "@/components/sections/ServiceLineCoverage";
import LocalVisibility from "@/components/sections/LocalVisibility";
import RiskOpportunities from "@/components/sections/RiskOpportunities";
import EvidenceLibrary from "@/components/sections/EvidenceLibrary";

export default function Home() {
    return (
        <AppLayout>
            <ExecutiveSummary />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShareOfVoice />
                {/* Right Column: Service Lines */}
                <div className="space-y-6">
                    <ServiceLineCoverage />
                </div>
            </div>

            {/* Local Visibility row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LocalVisibility />
                </div>
                {/* Placeholder for future map or insights */}
                <div className="bg-indigo-600 rounded-xl p-6 text-white flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-bold mb-2">Unlock Phase 2</h3>
                    <p className="text-indigo-100 text-sm mb-4">Connect outcome data to see how visibility drives appointments.</p>
                    <button className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">Connect CRM</button>
                </div>
            </div>

            <RiskOpportunities />
            <EvidenceLibrary />

        </AppLayout>
    )
}
