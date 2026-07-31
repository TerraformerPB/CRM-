"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AnalyticsDashboard } from "@/components/crm/AnalyticsDashboard";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { NewDealModal } from "@/components/crm/NewDealModal";
import { Sparkles, ArrowRight, Kanban, BarChart2 } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDealCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenNewDealModal={() => setIsModalOpen(true)} />

        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900/60 to-emerald-950/30 border border-indigo-500/20 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Open-Source CRM Platform v1.0
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Willkommen zurück, Alex!
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Ihre Daten sind zu 100% in der lokalen/PostgreSQL-Datenbank gespeichert. Tastaturnavigation mit <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-indigo-500/30 font-mono text-xs">Cmd + K</kbd> aktiv.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all text-sm self-start md:self-auto"
            >
              <span>+ Deal Erstellen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Dynamic Database Analytics & Graphs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-400" />
                <span>Echtzeit-Analysen &amp; Prognosen</span>
              </h2>
            </div>
            <AnalyticsDashboard key={`analytics-${refreshKey}`} />
          </div>

          {/* Section 2: Drag & Drop Kanban Board */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <KanbanBoard key={`kanban-${refreshKey}`} onOpenNewDealModal={() => setIsModalOpen(true)} />
          </div>
        </main>
      </div>

      <NewDealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDealCreated={handleDealCreated}
      />
    </div>
  );
}
