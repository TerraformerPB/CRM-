"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Settings, Shield, Key, Sliders, Download, Check, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"workspace" | "custom-fields" | "security">("workspace");
  const [exporting, setExporting] = useState(false);

  const handleGdprExport = () => {
    setExporting(true);
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ workspace: "Acme Corp", contactsCount: 3, dealsCount: 4, timestamp: new Date() }));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "gdpr_crm_data_export.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setExporting(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-400" />
              <span>Einstellungen &amp; Systemkonfiguration</span>
            </h1>
            <p className="text-xs text-slate-400">Workspace-Verwaltung, Custom Field Definitions &amp; DSGVO Datenschutz</p>
          </div>

          {/* Settings Tabs Header */}
          <div className="flex gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab("workspace")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "workspace" ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" /> Workspace &amp; Team
            </button>
            <button
              onClick={() => setActiveTab("custom-fields")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "custom-fields" ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4" /> Custom Fields Engine
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "security" ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-4 h-4" /> Security &amp; DSGVO
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "workspace" && (
            <div className="p-6 rounded-2xl glass-panel space-y-4 max-w-2xl border border-slate-800">
              <h2 className="text-lg font-bold text-white">Workspace Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="Acme Enterprise Solutions"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Workspace Slug (Tenant ID)</label>
                  <input
                    type="text"
                    defaultValue="acme-corp"
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "custom-fields" && (
            <div className="p-6 rounded-2xl glass-panel space-y-4 max-w-3xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Custom Field Definitionen</h2>
                  <p className="text-xs text-slate-400">Erweitern Sie Entitäten ohne Schema-Migrationen (JSONB Hybrid)</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-300 uppercase">CONTACT</span>
                    <div className="text-sm font-semibold text-white">custom_preferred_lang (Bevorzugte Sprache)</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">SELECT</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-300 uppercase">COMPANY</span>
                    <div className="text-sm font-semibold text-white">custom_tax_id (USt-IdNr. / Tax ID)</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">TEXT</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-300 uppercase">DEAL</span>
                    <div className="text-sm font-semibold text-white">custom_priority (Deal Priorität)</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">SELECT</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-6 rounded-2xl glass-panel space-y-6 max-w-2xl border border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span>DSGVO / GDPR Toolkit</span>
                </h2>
                <p className="text-xs text-slate-400">Recht auf Auskunft &amp; Datenübertragbarkeit</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="text-xs text-emerald-200">
                  <strong className="block text-emerald-300 mb-1">100% Privacy by Design &amp; AES-256 Verschlüsselung</strong>
                  Alle empfindlichen Anmeldedaten werden vor dem Speichern in der PostgreSQL-Datenbank mit AES-256-GCM verschlüsselt.
                </div>
                <button
                  onClick={handleGdprExport}
                  disabled={exporting}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting ? "Generiere Export..." : "DSGVO Datenexport (JSON) herunterladen"}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
