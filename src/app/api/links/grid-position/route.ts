import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";
import { links } from "@/lib/db/schema";

// PATCH /api/links/grid-position - Update grid position for a link
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkId, gridRow, gridColumn } = await request.json();

    if (!linkId || gridRow === undefined || gridColumn === undefined) {
      return NextResponse.json(
        { error: "Link ID, grid row, and grid column are required" },
        { status: 400 },
      );
    }

    // Update grid position
    await db
      .update(links)
      .set({
        gridRow,
        gridColumn,
        updatedAt: new Date(),
      })
      .where(eq(links.id, linkId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating grid position:", error);
    return NextResponse.json(
      { error: "Failed to update grid position" },
      { status: 500 },
    );
  }
}
