"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { NewDealModal } from "@/components/crm/NewDealModal";

export default function DealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenNewDealModal={() => setIsModalOpen(true)} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <KanbanBoard key={refreshKey} onOpenNewDealModal={() => setIsModalOpen(true)} />
        </main>
      </div>
      <NewDealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDealCreated={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}
