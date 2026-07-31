"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { CalendarCheck, MessageSquare, PhoneCall, Mail, CheckCircle2, Clock } from "lucide-react";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([
    {
      id: "act-1",
      type: "MEETING",
      subject: "Architektur-Deep-Dive mit VP of Engineering",
      content: "Besprechung der SSO und REST-API Anforderung. Kunde wünscht AGPL Community Audit.",
      dueDate: "Heute",
      isCompleted: true,
    },
    {
      id: "act-2",
      type: "EMAIL",
      subject: "Angebotsentwurf v2 versendet",
      content: "Anpassung der Lizenzbedingungen bezüglich DSGVO Anonymisierungs-Toolkit.",
      dueDate: "Gestern",
      isCompleted: true,
    },
    {
      id: "act-3",
      type: "TASK",
      subject: "Follow-Up Call bezüglich Datenbankschema vereinbaren",
      content: "Prüfen ob Postgres Row-Level-Security benötigt wird.",
      dueDate: "In 2 Tagen",
      isCompleted: false,
    },
  ]);

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-emerald-400" />
              <span>Aktivitäten &amp; Aufgaben Timeline</span>
            </h1>
            <p className="text-xs text-slate-400">Chronologische Aufzeichnung aller Interaktionen</p>
          </div>

          <div className="space-y-4 max-w-3xl">
            {activities.map((act) => (
              <div key={act.id} className="p-5 rounded-2xl glass-panel flex items-start gap-4 border border-slate-800">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    act.isCompleted ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  }`}
                >
                  {act.type === "MEETING" && <MessageSquare className="w-5 h-5" />}
                  {act.type === "EMAIL" && <Mail className="w-5 h-5" />}
                  {act.type === "TASK" && <Clock className="w-5 h-5" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">{act.subject}</h3>
                    <span className="text-xs text-slate-400 font-medium">{act.dueDate}</span>
                  </div>
                  <p className="text-xs text-slate-300">{act.content}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        act.isCompleted ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {act.isCompleted ? "Abgeschlossen" : "Ausstehend"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
