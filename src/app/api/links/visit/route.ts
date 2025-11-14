import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db/drizzle";
import { getServerSession } from "@/lib/auth";
import { links } from "@/lib/db/schema";

// POST /api/links/visit - Increment visit count for a link
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkId } = await request.json();

    if (!linkId) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 },
      );
    }

    // Increment the visit count
    await db
      .update(links)
      .set({
        visitCount: sql`${links.visitCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(links.id, linkId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking link visit:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 },
    );
  }
}
