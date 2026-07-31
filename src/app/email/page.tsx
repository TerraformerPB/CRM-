"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Mail, Send, Inbox, FileText, Settings, Sparkles, Check, Building2, User, Shield, RefreshCw } from "lucide-react";

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "settings">("sent");
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sending, setSending] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContactId, setSelectedContactId] = useState("");

  useEffect(() => {
    fetchEmails();
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setContacts(data.contacts);
      });
  }, []);

  const fetchEmails = () => {
    setLoading(true);
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Extract all email activities from contacts
          const allEmailActs: any[] = [];
          data.contacts.forEach((c: any) => {
            if (c.activities) {
              c.activities
                .filter((a: any) => a.type === "EMAIL")
                .forEach((a: any) => {
                  allEmailActs.push({
                    ...a,
                    contactName: `${c.firstName} ${c.lastName}`,
                    contactEmail: c.email,
                  });
                });
            }
          });
          setEmails(allEmailActs);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
    if (templateName === "Angebot Follow-Up") {
      setSubject("Follow-Up: Ihr Angebot für {{deal.title}}");
      setContent(
        "Hallo {{contact.firstName}},\n\n'ich wollte mich kurz bezüglich unseres letzten Gesprächs erkundigen. Haben Sie das Angebot für {{deal.title}} prüfen können?\n\nBei Fragen stehe ich Ihnen jederzeit zur Verfügung.\n\nBeste Grüße,\nAlex Dev"
      );
    } else if (templateName === "Erstkontakt Demo") {
      setSubject("Willkommen bei Acme - Terminvereinbarung");
      setContent(
        "Hallo {{contact.firstName}},\n\nvielen Dank für Ihr Interesse. Gerne möchten wir Ihnen in einer kurzen Demo unsere Enterprise-Lösung vorstellen.\n\nPasst es Ihnen diese Woche für 20 Minuten?\n\nViele Grüße,\nAlex Dev"
      );
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail || !content) return;

    setSending(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail,
          subject,
          content,
          contactId: selectedContactId || null,
          templateName: selectedTemplate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsComposerOpen(false);
        setToEmail("");
        setSubject("");
        setContent("");
        fetchEmails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Mail className="w-6 h-6 text-indigo-400" />
                <span>E-Mail &amp; Kommunikations-Hub</span>
              </h1>
              <p className="text-xs text-slate-400">IMAP/SMTP Zwei-Wege-Sync mit automatischer Kontaktzuordnung</p>
            </div>

            <button
              onClick={() => setIsComposerOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
            >
              <Send className="w-4 h-4" />
              <span>E-Mail Verfassen</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "sent" ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Send className="w-4 h-4" /> Gesendete E-Mails ({emails.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "settings" ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" /> IMAP/SMTP Server Anbindung
            </button>
          </div>

          {/* Tab 1: Sent / Timeline Emails */}
          {activeTab === "sent" && (
            <div className="space-y-4">
              {loading ? (
                <div className="p-12 text-center text-slate-400">Lade E-Mail Verlauf...</div>
              ) : (
                <div className="space-y-3">
                  {emails.map((email) => (
                    <div key={email.id} className="p-5 rounded-2xl glass-panel space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{email.subject}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                            Synchronisiert
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(email.createdAt).toLocaleDateString("de-DE")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-indigo-300">
                        <span>An: {email.contactName} ({email.contactEmail})</span>
                      </div>

                      <p className="text-xs text-slate-300 whitespace-pre-line pt-2 border-t border-slate-800/80">
                        {email.content}
                      </p>
                    </div>
                  ))}

                  {emails.length === 0 && (
                    <div className="p-12 text-center text-sm text-slate-400 glass-panel rounded-2xl">
                      Noch keine E-Mails gesendet. Klicken Sie oben auf &quot;E-Mail Verfassen&quot;.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: IMAP / SMTP Configuration */}
          {activeTab === "settings" && (
            <div className="p-6 rounded-2xl glass-panel space-y-5 max-w-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">IMAP / SMTP Server Anbindung</h2>
                  <p className="text-xs text-slate-400">Verbinden Sie Ihren eigenen Mail-Server für Zwei-Wege-Sync</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <Shield className="w-3.5 h-3.5" /> AES-256 Verschlüsselt
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      defaultValue="mail.acme-crm.dev"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">SMTP Port</label>
                    <input
                      type="text"
                      defaultValue="587 (TLS 1.3)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Benutzername / E-Mail</label>
                    <input
                      type="text"
                      defaultValue="alex@acme-crm.dev"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Passwort</label>
                    <input
                      type="password"
                      defaultValue="supersecretpass"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-medium">
                    <Check className="w-4 h-4" /> Verbindung Speichern
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 glass-panel shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" /> E-Mail Verfassen
              </h2>
              <button onClick={() => setIsComposerOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kontakt Empfänger</label>
                <select
                  value={selectedContactId}
                  onChange={(e) => {
                    setSelectedContactId(e.target.value);
                    const ct = contacts.find((c) => c.id === e.target.value);
                    if (ct && ct.email) setToEmail(ct.email);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                >
                  <option value="">Kontakt auswählen...</option>
                  {contacts.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.firstName} {ct.lastName} ({ct.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Empfänger E-Mail *</label>
                <input
                  type="email"
                  required
                  placeholder="s.conner@techvision.de"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">E-Mail Template Laden</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-indigo-500/30 text-white text-sm focus:outline-none"
                >
                  <option value="">Keines (Leere E-Mail)</option>
                  <option value="Angebot Follow-Up">Angebot Follow-Up mit Variablen</option>
                  <option value="Erstkontakt Demo">Erstkontakt Demo Termin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Betreff *</label>
                <input
                  type="text"
                  required
                  placeholder="Ihr Angebot"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nachrichteninhalt *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Schreiben Sie Ihre Nachricht..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30"
                >
                  {sending ? "Sende..." : "Jetzt Senden"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
