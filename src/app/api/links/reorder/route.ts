import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";
import { links } from "@/lib/db/schema";

// PATCH /api/links/reorder - Update link positions
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { links: linkUpdates } = body;

    if (!linkUpdates || !Array.isArray(linkUpdates)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Update each link's position
    await Promise.all(
      linkUpdates.map(async (update: { id: string; position: number }) => {
        if (!update.id || typeof update.position !== "number") {
          return;
        }

        await db
          .update(links)
          .set({
            position: update.position,
            updatedAt: new Date(),
          })
          .where(eq(links.id, update.id));
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering links:", error);
    return NextResponse.json(
      { error: "Failed to reorder links" },
      { status: 500 },
    );
  }
}
