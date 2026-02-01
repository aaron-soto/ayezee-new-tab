import { NextRequest, NextResponse } from "next/server";
import { linkChildren, links } from "@/lib/db/schema";

import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

// POST /api/links/children - Create a new child link
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const parentId = formData.get("parentId") as string;
    const label = formData.get("label") as string;
    const href = formData.get("href") as string;
    const iconFile = formData.get("icon") as File | null;
    const faviconUrl = formData.get("faviconUrl") as string | null;

    if (!parentId || !label || !href) {
      return NextResponse.json(
        { error: "Parent ID, label, and href are required" },
        { status: 400 },
      );
    }

    let iconUrl = "";

    // Upload icon to Cloudinary if provided
    if (iconFile) {
      const uploadResult = await uploadToCloudinary(iconFile, "new-tab/icons");
      iconUrl = uploadResult.url;
    } else if (faviconUrl) {
      // Use the favicon URL directly (no need to upload to Cloudinary)
      iconUrl = faviconUrl;
    } else {
      return NextResponse.json({ error: "Icon is required" }, { status: 400 });
    }

    // Create child link
    const [newChildLink] = await db
      .insert(linkChildren)
      .values({
        parentId,
        label,
        href,
        icon: iconUrl,
        position: 0, // You might want to calculate this based on existing children
      })
      .returning();

    // Update parent link to be of type "list"
    await db
      .update(links)
      .set({ type: "list", updatedAt: new Date() })
      .where(eq(links.id, parentId));

    return NextResponse.json({ childLink: newChildLink }, { status: 201 });
  } catch (error) {
    console.error("Error creating child link:", error);
    return NextResponse.json(
      { error: "Failed to create child link" },
      { status: 500 },
    );
  }
}

// PUT /api/links/children - Update a child link
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const label = formData.get("label") as string;
    const href = formData.get("href") as string;
    const iconFile = formData.get("icon") as File | null;
    const faviconUrl = formData.get("faviconUrl") as string | null;

    if (!id) {
      return NextResponse.json(
        { error: "Child link ID is required" },
        { status: 400 },
      );
    }

    const updateData: {
      label?: string;
      href?: string;
      icon?: string;
    } = {};

    if (label) updateData.label = label;
    if (href) updateData.href = href;

    // If new icon is uploaded, upload to Cloudinary
    if (iconFile) {
      const uploadResult = await uploadToCloudinary(iconFile, "new-tab/icons");
      updateData.icon = uploadResult.url;
    } else if (faviconUrl) {
      // Use the favicon URL directly
      updateData.icon = faviconUrl;
    }

    // Update child link
    const [updatedChildLink] = await db
      .update(linkChildren)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(linkChildren.id, id))
      .returning();

    return NextResponse.json({ childLink: updatedChildLink });
  } catch (error) {
    console.error("Error updating child link:", error);
    return NextResponse.json(
      { error: "Failed to update child link" },
      { status: 500 },
    );
  }
}

// DELETE /api/links/children - Delete a child link
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Child link ID is required" },
        { status: 400 },
      );
    }

    // Delete the child link
    await db.delete(linkChildren).where(eq(linkChildren.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting child link:", error);
    return NextResponse.json(
      { error: "Failed to delete child link" },
      { status: 500 },
    );
  }
}
