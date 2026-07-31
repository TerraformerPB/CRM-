import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, results: { deals: [], contacts: [], companies: [] } });
    }

    const deals = await prisma.deal.findMany({
      where: {
        workspaceId: "ws-main",
        title: { contains: query },
      },
      take: 5,
    });

    const contacts = await prisma.contact.findMany({
      where: {
        workspaceId: "ws-main",
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { email: { contains: query } },
        ],
      },
      take: 5,
    });

    const companies = await prisma.company.findMany({
      where: {
        workspaceId: "ws-main",
        name: { contains: query },
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      results: { deals, contacts, companies },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
