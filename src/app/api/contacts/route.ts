import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      where: { workspaceId: "ws-main" },
      include: {
        company: true,
        activities: {
          orderBy: { createdAt: "desc" },
        },
        deals: {
          include: {
            stage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, contacts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, jobTitle, companyId, customFields } = body;

    const contact = await prisma.contact.create({
      data: {
        workspaceId: "ws-main",
        firstName,
        lastName,
        email,
        phone,
        jobTitle,
        companyId: companyId || null,
        customFields: JSON.stringify(customFields || {}),
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
