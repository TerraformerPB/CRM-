"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Users,
  Building2,
  CalendarCheck,
  Mail,
  Settings,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Deals & Pipeline", href: "/deals", icon: Kanban, badge: "Kanban" },
  { label: "Kontakte", href: "/contacts", icon: Users },
  { label: "Unternehmen", href: "/companies", icon: Building2 },
  { label: "E-Mail Hub", href: "/email", icon: Mail, badge: "Sync" },
  { label: "Aktivitäten", href: "/activities", icon: CalendarCheck },
  { label: "Einstellungen", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d1322]/90 border-r border-slate-800/80 flex flex-col justify-between min-h-screen p-4 select-none backdrop-blur-xl">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">OpenCRM</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                v1.0
              </span>
            </div>
            <span className="text-xs text-slate-400">Acme Enterprise</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-950/50"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Open Source & GDPR Badge */}
      <div className="space-y-3 pt-6 border-t border-slate-800/60">
        <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> DSGVO / Privacy
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            AES-256 Verschlüsselung & 100% Datensouveränität aktiv.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AGPLv3 Community
          </span>
          <span className="hover:underline cursor-pointer">Docs</span>
        </div>
      </div>
    </aside>
  );
}
