import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pipelines = await prisma.pipeline.findMany({
      where: { workspaceId: "ws-main" },
      include: {
        stages: {
          orderBy: { order: "asc" },
          include: {
            deals: {
              include: {
                company: true,
                contact: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, pipelines });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, amount, currency, stageId, companyId, contactId, customFields } = body;

    const deal = await prisma.deal.create({
      data: {
        workspaceId: "ws-main",
        title,
        amount: parseFloat(amount) || 0,
        currency: currency || "EUR",
        stageId,
        companyId: companyId || null,
        contactId: contactId || null,
        customFields: JSON.stringify(customFields || {}),
      },
      include: {
        company: true,
        contact: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        workspaceId: "ws-main",
        actorId: "usr-admin",
        action: "DEAL_CREATED",
        entityType: "DEAL",
        entityId: deal.id,
        changes: JSON.stringify({ newDeal: deal }),
      },
    });

    return NextResponse.json({ success: true, deal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { dealId, newStageId } = body;

    const existingDeal = await prisma.deal.findUnique({ where: { id: dealId } });

    if (!existingDeal) {
      return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 });
    }

    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: { stageId: newStageId },
      include: {
        company: true,
        contact: true,
      },
    });

    // Create Audit Log for Drag-and-Drop update
    await prisma.auditLog.create({
      data: {
        workspaceId: "ws-main",
        actorId: "usr-admin",
        action: "DEAL_STAGE_UPDATED",
        entityType: "DEAL",
        entityId: dealId,
        changes: JSON.stringify({
          fromStageId: existingDeal.stageId,
          toStageId: newStageId,
        }),
      },
    });

    return NextResponse.json({ success: true, deal: updatedDeal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
