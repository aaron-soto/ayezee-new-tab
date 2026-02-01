import {
  IconType,
  createLink,
  deleteLink,
  getLinksFromDb,
  updateLink,
} from "@/lib/linksDb";
import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth";
import { links } from "@/lib/db/schema";

// GET /api/links - Fetch user's links
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await getLinksFromDb(session.user.id);
    return NextResponse.json({ links });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 },
    );
  }
}

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const label = formData.get("label") as string;
    const href = formData.get("href") as string;
    const type = formData.get("type") as string;
    const iconFile = formData.get("icon") as File | null;
    const faviconUrl = formData.get("faviconUrl") as string | null;

    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    let iconUrl = "";
    let cloudinaryPublicId = "";

    // Upload icon to Cloudinary if provided
    if (iconFile) {
      const uploadResult = await uploadToCloudinary(iconFile, "new-tab/icons");
      iconUrl = uploadResult.url;
      cloudinaryPublicId = uploadResult.publicId;
    } else if (faviconUrl) {
      // Use the favicon URL directly (no need to upload to Cloudinary)
      iconUrl = faviconUrl;
      // No cloudinaryPublicId since it's an external URL
    } else {
      return NextResponse.json({ error: "Icon is required" }, { status: 400 });
    }

    const newLink = await createLink({
      label,
      icon: iconUrl,
      href: href || undefined,
      type: type === "list" ? IconType.List : IconType.Icon,
      userId: session.user.id,
      cloudinaryPublicId: cloudinaryPublicId || undefined,
    });

    return NextResponse.json({ link: newLink }, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 },
    );
  }
}

// PUT /api/links - Update a link
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
    const type = formData.get("type") as string;
    const iconFile = formData.get("icon") as File | null;
    const faviconUrl = formData.get("faviconUrl") as string | null;

    if (!id) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 },
      );
    }

    const updateData: {
      label?: string;
      href?: string;
      icon?: string;
      type?: IconType;
    } = {};

    if (label) updateData.label = label;
    // Allow setting href to empty string (for folders/parent icons)
    if (href !== null && href !== undefined) {
      updateData.href = href || undefined;
    }
    if (type) updateData.type = type === "list" ? IconType.List : IconType.Icon;

    // If new icon is uploaded, upload to Cloudinary and delete old one
    if (iconFile) {
      // Get the current link to find old cloudinary public ID
      const [currentLink] = await db
        .select()
        .from(links)
        .where(eq(links.id, id));

      // Upload new icon
      const uploadResult = await uploadToCloudinary(iconFile, "new-tab/icons");
      updateData.icon = uploadResult.url;

      // Delete old image from Cloudinary if it exists
      if (currentLink?.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(currentLink.cloudinaryPublicId);
          console.log(
            `✅ Deleted old Cloudinary image: ${currentLink.cloudinaryPublicId}`,
          );
        } catch (error) {
          console.error("Error deleting old Cloudinary image:", error);
        }
      }

      // Update the cloudinary public ID
      await db
        .update(links)
        .set({ cloudinaryPublicId: uploadResult.publicId })
        .where(eq(links.id, id));
    } else if (faviconUrl) {
      // Use the favicon URL directly (no need to upload to Cloudinary)
      updateData.icon = faviconUrl;

      // Get the current link to check if we need to clean up old Cloudinary image
      const [currentLink] = await db
        .select()
        .from(links)
        .where(eq(links.id, id));

      // Delete old image from Cloudinary if it exists
      if (currentLink?.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(currentLink.cloudinaryPublicId);
          console.log(
            `✅ Deleted old Cloudinary image: ${currentLink.cloudinaryPublicId}`,
          );
        } catch (error) {
          console.error("Error deleting old Cloudinary image:", error);
        }
      }

      // Clear the cloudinary public ID since we're using external URL now
      await db
        .update(links)
        .set({ cloudinaryPublicId: null })
        .where(eq(links.id, id));
    }

    const updatedLink = await updateLink(id, updateData);

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 },
    );
  }
}

// DELETE /api/links - Delete a link
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
        { error: "Link ID is required" },
        { status: 400 },
      );
    }

    // Delete link and get cloudinary public ID if it exists
    const cloudinaryPublicId = await deleteLink(id);

    // Delete from Cloudinary if there's a public ID
    if (cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(cloudinaryPublicId);
        console.log(`✅ Deleted Cloudinary image: ${cloudinaryPublicId}`);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Don't fail the request if Cloudinary deletion fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 },
    );
  }
}
