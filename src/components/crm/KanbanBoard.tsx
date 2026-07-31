"use client";

import { useState, useEffect } from "react";
import { Plus, MoreHorizontal, DollarSign, Building2, User, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  amount: number;
  currency: string;
  stageId: string;
  company?: { name: string } | null;
  contact?: { firstName: string; lastName: string } | null;
}

interface Stage {
  id: string;
  name: string;
  probability: number;
  deals: Deal[];
}

export function KanbanBoard({ onOpenNewDealModal }: { onOpenNewDealModal?: () => void }) {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [activeStageDrop, setActiveStageDrop] = useState<string | null>(null);

  const fetchPipelines = async () => {
    try {
      const res = await fetch("/api/deals");
      const data = await res.json();
      if (data.success && data.pipelines.length > 0) {
        setStages(data.pipelines[0].stages);
      }
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("text/plain", dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (activeStageDrop !== stageId) {
      setActiveStageDrop(stageId);
    }
  };

  const handleDragLeave = () => {
    setActiveStageDrop(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain") || draggedDealId;
    setActiveStageDrop(null);
    setDraggedDealId(null);

    if (!dealId) return;

    // Optimistic UI Update
    setStages((prevStages) => {
      let movedDeal: Deal | undefined;

      const newStages = prevStages.map((stage) => {
        const found = stage.deals.find((d) => d.id === dealId);
        if (found) {
          movedDeal = { ...found, stageId: targetStageId };
          return {
            ...stage,
            deals: stage.deals.filter((d) => d.id !== dealId),
          };
        }
        return stage;
      });

      if (!movedDeal) return prevStages;

      return newStages.map((stage) => {
        if (stage.id === targetStageId) {
          return {
            ...stage,
            deals: [movedDeal!, ...stage.deals],
          };
        }
        return stage;
      });
    });

    // Save stage change in Database
    try {
      const res = await fetch("/api/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, newStageId: targetStageId }),
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on error
        fetchPipelines();
      }
    } catch (err) {
      console.error(err);
      fetchPipelines();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Sales Pipeline</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Drag & Drop Aktiv
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Verschieben Sie Deals per Ziehen in neue Phasen. Änderungen werden in Echtzeit in der PostgreSQL-Datenbank gespeichert.
          </p>
        </div>

        {onOpenNewDealModal && (
          <button
            onClick={onOpenNewDealModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Neuer Deal</span>
          </button>
        )}
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const totalAmount = stage.deals.reduce((sum, d) => sum + d.amount, 0);
          const isDropTarget = activeStageDrop === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 min-h-[500px] ${
                isDropTarget
                  ? "bg-indigo-950/40 border-2 border-dashed border-indigo-400 shadow-2xl scale-[1.01]"
                  : "bg-[#0d1322]/70 border border-slate-800/80 backdrop-blur-md"
              }`}
            >
              <div>
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"></span>
                    <h3 className="font-semibold text-sm text-slate-200">{stage.name}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                    {stage.deals.length}
                  </span>
                </div>

                {/* Total Stage Value */}
                <div className="mb-4 px-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Summe:</span>
                  <span className="font-bold text-emerald-400">€{totalAmount.toLocaleString()}</span>
                </div>

                {/* Deals List */}
                <div className="space-y-3">
                  {stage.deals.map((deal) => {
                    const isDragging = draggedDealId === deal.id;

                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        className={`p-4 rounded-xl glass-card cursor-grab active:cursor-grabbing space-y-3 transition-all duration-200 ${
                          isDragging ? "opacity-40 scale-95 border-indigo-500" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-white line-clamp-2 leading-snug">
                            {deal.title}
                          </h4>
                          <button className="text-slate-500 hover:text-slate-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                          <div className="font-bold text-emerald-400 flex items-center gap-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{deal.amount.toLocaleString()} {deal.currency}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800/80">
                            {Math.round(stage.probability * 100)}% Prob.
                          </span>
                        </div>

                        {/* Associated Company & Contact */}
                        <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                          {deal.company && (
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Building2 className="w-3 h-3 text-indigo-400" />
                              <span className="truncate">{deal.company.name}</span>
                            </div>
                          )}
                          {deal.contact && (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate">
                                {deal.contact.firstName} {deal.contact.lastName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {stage.deals.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-xs text-slate-400">
                      Hierhin ziehen
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
