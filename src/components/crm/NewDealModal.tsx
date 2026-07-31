"use client";

import { useState, useEffect } from "react";
import { X, DollarSign, Building2, User, Sparkles, Check } from "lucide-react";

export function NewDealModal({
  isOpen,
  onClose,
  onDealCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDealCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [stageId, setStageId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [contactId, setContactId] = useState("");
  const [customPriority, setCustomPriority] = useState("Hoch");

  const [stages, setStages] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch stages, companies, contacts for dropdowns
    fetch("/api/deals")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.pipelines.length > 0) {
          const stgs = data.pipelines[0].stages;
          setStages(stgs);
          if (stgs.length > 0) setStageId(stgs[0].id);
        }
      });

    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCompanies(data.companies);
      });

    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setContacts(data.contacts);
      });
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !stageId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount,
          currency,
          stageId,
          companyId: companyId || null,
          contactId: contactId || null,
          customFields: { custom_priority: customPriority },
        }),
      });

      const data = await res.json();
      if (data.success) {
        onDealCreated();
        onClose();
        setTitle("");
        setAmount("");
      }
    } catch (err) {
      console.error("Failed to create deal:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 glass-panel shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Neuer Deal Erstellen
            </h2>
            <p className="text-xs text-slate-400">Speichert direkt in die PostgreSQL-Datenbank</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deal Titel *</label>
            <input
              type="text"
              required
              placeholder="z.B. Enterprise Cloud Transformation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Volumen (€) *</label>
              <input
                type="number"
                required
                placeholder="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phase *</label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {stages.map((stg) => (
                  <option key={stg.id} value={stg.id}>
                    {stg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Unternehmen</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Keines auswählen</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kontaktperson</label>
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Keine auswählen</option>
                {contacts.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.firstName} {ct.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Field Example */}
          <div>
            <label className="block text-xs font-semibold text-indigo-300 mb-1.5">
              Custom Field: Deal Priorität
            </label>
            <select
              value={customPriority}
              onChange={(e) => setCustomPriority(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-indigo-500/30 text-white text-sm focus:outline-none"
            >
              <option value="Hoch">Hoch</option>
              <option value="Mittel">Mittel</option>
              <option value="Niedrig">Niedrig</option>
            </select>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30"
            >
              {submitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Speichern</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
