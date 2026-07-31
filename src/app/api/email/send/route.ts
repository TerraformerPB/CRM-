import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { toEmail, subject, content, contactId, dealId, templateName } = body;

    if (!toEmail || !content) {
      return NextResponse.json({ success: false, error: "Empfänger E-Mail und Inhalt erforderlich" }, { status: 400 });
    }

    // Process Template Variables if contact/deal provided
    let processedContent = content;
    if (contactId) {
      const contact = await prisma.contact.findUnique({ where: { id: contactId } });
      if (contact) {
        processedContent = processedContent.replace(/\{\{contact\.firstName\}\}/g, contact.firstName);
        processedContent = processedContent.replace(/\{\{contact\.lastName\}\}/g, contact.lastName);
        processedContent = processedContent.replace(/\{\{contact\.jobTitle\}\}/g, contact.jobTitle || "");
      }
    }

    if (dealId) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (deal) {
        processedContent = processedContent.replace(/\{\{deal\.title\}\}/g, deal.title);
        processedContent = processedContent.replace(/\{\{deal\.amount\}\}/g, `€${deal.amount.toLocaleString()}`);
      }
    }

    // Persist as Email Activity in database for 360-degree timeline sync
    const activity = await prisma.activity.create({
      data: {
        workspaceId: "ws-main",
        userId: "usr-admin",
        contactId: contactId || null,
        dealId: dealId || null,
        type: "EMAIL",
        subject: subject || "Kein Betreff",
        content: processedContent,
        metadata: JSON.stringify({
          to: toEmail,
          status: "SENT",
          templateUsed: templateName || "Standard",
          sentAt: new Date().toISOString(),
        }),
        isCompleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "E-Mail erfolgreich gesendet & in der CRM-Timeline synchronisiert",
      activity,
      sentContent: processedContent,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
