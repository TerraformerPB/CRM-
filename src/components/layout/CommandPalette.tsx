"use client";

import { useEffect, useState } from "react";
import { Search, Building2, Users, Kanban, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ deals: any[]; contacts: any[]; companies: any[] }>({
    deals: [],
    contacts: [],
    companies: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ deals: [], contacts: [], companies: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            placeholder="Suchen nach Deals, Kontakten, Firmen... (Tippe zum Suchen)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-base font-normal"
            autoFocus
          />
          {loading && <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />}
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {query.length < 2 && (
            <div className="p-6 text-center text-sm text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-indigo-400/50 animate-pulse" />
              <p className="font-medium text-slate-300">Blitzeffiziente Tastatur-Suche (&lt;100 ms)</p>
              <p className="text-xs text-slate-400">Geben Sie mindestens 2 Zeichen ein, um Datensätze zu durchsuchen.</p>
            </div>
          )}

          {/* Deals Results */}
          {results.deals.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                <Kanban className="w-3.5 h-3.5 text-indigo-400" /> Deals
              </div>
              <div className="space-y-1">
                {results.deals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => {
                      router.push("/deals");
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/80 cursor-pointer group transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-300">
                      {deal.title}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      €{deal.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts Results */}
          {results.contacts.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Kontakte
              </div>
              <div className="space-y-1">
                {results.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      router.push("/contacts");
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/80 cursor-pointer group transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-300">
                        {contact.firstName} {contact.lastName}
                      </span>
                      {contact.jobTitle && <span className="text-xs text-slate-400 block">{contact.jobTitle}</span>}
                    </div>
                    <span className="text-xs text-slate-400">{contact.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companies Results */}
          {results.companies.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Unternehmen
              </div>
              <div className="space-y-1">
                {results.companies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => {
                      router.push("/companies");
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/80 cursor-pointer group transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-300">
                      {company.name}
                    </span>
                    <span className="text-xs text-slate-400">{company.industry || company.domain}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 &&
            results.deals.length === 0 &&
            results.contacts.length === 0 &&
            results.companies.length === 0 &&
            !loading && (
              <div className="p-6 text-center text-sm text-slate-400">Keine Datensätze gefunden für &quot;{query}&quot;</div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">ESC</kbd> zum Schließen
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">↵</kbd> zum Auswählen
          </span>
        </div>
      </div>
    </div>
  );
}
