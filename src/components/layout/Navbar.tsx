"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Bell, Command } from "lucide-react";
import { CommandPalette } from "./CommandPalette";

export function Navbar({ onOpenNewDealModal }: { onOpenNewDealModal?: () => void }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 bg-[#0d1322]/80 border-b border-slate-800/80 px-6 flex items-center justify-between backdrop-blur-xl sticky top-0 z-30">
        {/* Search Bar / Cmd+K Trigger */}
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 bg-slate-900/90 hover:bg-slate-800/90 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl border border-slate-800 cursor-pointer w-72 md:w-96 transition-all duration-200 shadow-inner group"
        >
          <Search className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-normal flex-1">Schnellsuche (Deals, Kontakte)...</span>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {onOpenNewDealModal && (
            <button
              onClick={onOpenNewDealModal}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Neuer Deal</span>
            </button>
          )}

          <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white relative transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950"></span>
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xs text-white">
                AD
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white">Alex Dev</div>
              <div className="text-[10px] text-indigo-400 font-medium">Owner</div>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </>
  );
}
