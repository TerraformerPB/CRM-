import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      where: { workspaceId: "ws-main" },
      include: {
        contacts: true,
        deals: {
          include: {
            stage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, companies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, domain, industry, employeeCount, customFields } = body;

    const company = await prisma.company.create({
      data: {
        workspaceId: "ws-main",
        name,
        domain,
        industry,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        customFields: JSON.stringify(customFields || {}),
      },
    });

    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
