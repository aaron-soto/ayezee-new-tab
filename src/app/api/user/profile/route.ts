import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";
import { users } from "@/lib/db/schema";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, image } = body;

    // Validate input
    if (name !== undefined && typeof name !== "string") {
      return NextResponse.json(
        { error: "Name must be a string" },
        { status: 400 },
      );
    }

    if (image !== undefined && typeof image !== "string") {
      return NextResponse.json(
        { error: "Image must be a string" },
        { status: 400 },
      );
    }

    // Update user in database
    const updateData: { name?: string; image?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name.trim() || null;
    }

    if (image !== undefined) {
      updateData.image = image.trim() || null;
    }

    await db.update(users).set(updateData).where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
