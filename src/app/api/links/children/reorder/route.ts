import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";
import { linkChildren } from "@/lib/db/schema";

// POST /api/links/children/reorder - Reorder child links
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { parentId, childIds } = body as {
      parentId: string;
      childIds: string[];
    };

    if (!parentId || !childIds || !Array.isArray(childIds)) {
      return NextResponse.json(
        { error: "Parent ID and child IDs are required" },
        { status: 400 },
      );
    }

    // Update position for each child based on its index in the array
    await Promise.all(
      childIds.map((childId, index) =>
        db
          .update(linkChildren)
          .set({ position: index, updatedAt: new Date() })
          .where(eq(linkChildren.id, childId)),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering child links:", error);
    return NextResponse.json(
      { error: "Failed to reorder child links" },
      { status: 500 },
    );
  }
}
