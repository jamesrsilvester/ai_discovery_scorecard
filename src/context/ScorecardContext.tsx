import { createContext, useContext, useState, ReactNode } from "react";
import { Market, TAXONOMY, ServiceLine } from "@/data/mockData";

interface ScorecardState {
    selectedMarket: Market | "All";
    setSelectedMarket: (m: Market | "All") => void;
    selectedServiceLine: string | "All";
    setSelectedServiceLine: (id: string | "All") => void;
    dateRange: string;
    setDateRange: (range: string) => void;
    openDrillDown: string | null; // Service Line ID
    setOpenDrillDown: (id: string | null) => void;
}

const ScorecardContext = createContext<ScorecardState | undefined>(undefined);

export function ScorecardProvider({ children }: { children: ReactNode }) {
    const [selectedMarket, setSelectedMarket] = useState<Market | "All">("All");
    const [selectedServiceLine, setSelectedServiceLine] = useState<string | "All">("All");
    const [dateRange, setDateRange] = useState("Last 28 days");
    const [openDrillDown, setOpenDrillDown] = useState<string | null>(null);

    return (
        <ScorecardContext.Provider
            value={{
                selectedMarket,
                setSelectedMarket,
                selectedServiceLine,
                setSelectedServiceLine,
                dateRange,
                setDateRange,
                openDrillDown,
                setOpenDrillDown,
            }}
        >
            {children}
        </ScorecardContext.Provider>
    );
}

export function useScorecard() {
    const context = useContext(ScorecardContext);
    if (!context) throw new Error("useScorecard must be used within ScorecardProvider");
    return context;
}
