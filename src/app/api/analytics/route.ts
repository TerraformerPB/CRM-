import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      where: { workspaceId: "ws-main" },
      include: {
        stage: true,
        company: true,
      },
    });

    const stages = await prisma.pipelineStage.findMany({
      where: { pipeline: { workspaceId: "ws-main" } },
      orderBy: { order: "asc" },
      include: {
        deals: true,
      },
    });

    // Compute Metrics
    let totalWonVolume = 0;
    let weightedPipelineValue = 0;
    let totalOpenDealsCount = 0;

    const stageBreakdown = stages.map((stage) => {
      const stageDeals = deals.filter((d) => d.stageId === stage.id);
      const stageValue = stageDeals.reduce((sum, d) => sum + d.amount, 0);

      if (stage.name.toLowerCase().includes("won")) {
        totalWonVolume += stageValue;
      } else {
        weightedPipelineValue += stageValue * stage.probability;
        totalOpenDealsCount += stageDeals.length;
      }

      return {
        id: stage.id,
        name: stage.name,
        dealCount: stageDeals.length,
        totalValue: stageValue,
        probability: stage.probability,
      };
    });

    // Mock trend history combined with live db data for beautiful dynamic graphs
    const monthlyForecast = [
      { month: "Jan", won: 18000, projected: 25000 },
      { month: "Feb", won: 24000, projected: 32000 },
      { month: "Mär", won: 31000, projected: 45000 },
      { month: "Apr", won: 29000, projected: 40000 },
      { month: "Mai", won: 42000, projected: 58000 },
      { month: "Jun", won: totalWonVolume, projected: totalWonVolume + weightedPipelineValue },
    ];

    const activitiesCount = await prisma.activity.count({
      where: { workspaceId: "ws-main" },
    });

    const contactsCount = await prisma.contact.count({
      where: { workspaceId: "ws-main" },
    });

    const companiesCount = await prisma.company.count({
      where: { workspaceId: "ws-main" },
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalWonVolume,
        weightedPipelineValue,
        totalOpenDealsCount,
        activitiesCount,
        contactsCount,
        companiesCount,
        stageBreakdown,
        monthlyForecast,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
