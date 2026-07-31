"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.metrics);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Won Revenue */}
        <div className="p-5 rounded-2xl glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gewonnener Umsatz</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">
              €{metrics.totalWonVolume.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% ggü. Vormonat</span>
            </div>
          </div>
        </div>

        {/* Card 2: Weighted Pipeline Value */}
        <div className="p-5 rounded-2xl glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktive Pipeline (Gewichtet)</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">
              €{Math.round(metrics.weightedPipelineValue).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {metrics.totalOpenDealsCount} offene Verhandlungen
            </div>
          </div>
        </div>

        {/* Card 3: Contacts */}
        <div className="p-5 rounded-2xl glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gespeicherte Kontakte</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{metrics.contactsCount}</div>
            <div className="text-xs text-slate-400 mt-1">Verknüpft mit {metrics.companiesCount} Firmen</div>
          </div>
        </div>

        {/* Card 4: Companies */}
        <div className="p-5 rounded-2xl glass-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unternehmen</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{metrics.companiesCount}</div>
            <div className="text-xs text-emerald-400 mt-1">360° Daten-Mapping aktiv</div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph 1: Revenue Forecast Area Chart (2/3 width) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Umsatz-Verlauf &amp; Projektion</span>
              </h2>
              <p className="text-xs text-slate-400">
                Echtzeitdaten aus der PostgreSQL-Datenbank (Gewonnener Umsatz vs. Prognose)
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              H1 2026
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                  }}
                  formatter={(value: any) => [`€${Number(value).toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="won" name="Realisiert (€)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWon)" />
                <Area type="monotone" dataKey="projected" name="Prognose (€)" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorProjected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Pipeline Stage Distribution Pie Chart (1/3 width) */}
        <div className="p-6 rounded-2xl glass-panel space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-400" />
              <span>Phasen-Verteilung</span>
            </h2>
            <p className="text-xs text-slate-400">Verteilung des Deal-Volumens je Stage</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.stageBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="totalValue"
                >
                  {metrics.stageBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                  }}
                  formatter={(value: any) => [`€${Number(value).toLocaleString()}`, "Volumen"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {metrics.stageBreakdown.slice(0, 4).map((stage: any, i: number) => (
              <div key={stage.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="text-slate-300 truncate max-w-[120px]">{stage.name}</span>
                </div>
                <span className="font-semibold text-slate-400">€{stage.totalValue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
