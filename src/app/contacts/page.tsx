"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Users, Mail, Phone, Building2, Plus, Sparkles, Search } from "lucide-react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setContacts(data.contacts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredContacts = contacts.filter((c) => {
    const full = `${c.firstName} ${c.lastName} ${c.email} ${c.jobTitle}`.toLowerCase();
    return full.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-400" />
                <span>360°-Kontakte</span>
              </h1>
              <p className="text-xs text-slate-400">Verwaltung aller Ansprechpartner mit benutzerdefinierten Feldern</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Kontakt suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Contacts Table Card */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Lade Kontakte aus der Datenbank...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/90 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Name &amp; Position</th>
                      <th className="px-6 py-4">Unternehmen</th>
                      <th className="px-6 py-4">E-Mail &amp; Telefon</th>
                      <th className="px-6 py-4">Custom Fields (JSONB)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredContacts.map((contact) => {
                      let customParsed: any = {};
                      try {
                        customParsed = JSON.parse(contact.customFields || "{}");
                      } catch (e) {}

                      return (
                        <tr key={contact.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                                {contact.firstName[0]}
                                {contact.lastName[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-white">
                                  {contact.firstName} {contact.lastName}
                                </div>
                                <div className="text-xs text-slate-400">{contact.jobTitle || "Keine Position"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {contact.company ? (
                              <div className="flex items-center gap-1.5 text-slate-200">
                                <Building2 className="w-4 h-4 text-indigo-400" />
                                <span>{contact.company.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Keine Firma</span>
                            )}
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            {contact.email && (
                              <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(customParsed).map(([k, v]) => (
                                <span
                                  key={k}
                                  className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono"
                                >
                                  {k}: {String(v)}
                                </span>
                              ))}
                              {Object.keys(customParsed).length === 0 && (
                                <span className="text-xs text-slate-500">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
