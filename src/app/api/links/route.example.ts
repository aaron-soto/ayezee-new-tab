import {
  IconType,
  createLink,
  deleteLink,
  getLinksFromDb,
  updateLink,
} from "@/lib/linksDb";
import { NextRequest, NextResponse } from "next/server";

// GET /api/links - Fetch all links
export async function GET() {
  try {
    // You can get userId from session/auth here if needed
    // const session = await getServerSession();
    // const links = await getLinksFromDb(session?.user?.id);

    const links = await getLinksFromDb();
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
    const body = await request.json();
    const { label, icon, href, type } = body;

    if (!label || !icon) {
      return NextResponse.json(
        { error: "Label and icon are required" },
        { status: 400 },
      );
    }

    const newLink = await createLink({
      label,
      icon,
      href,
      type: type === "list" ? IconType.List : IconType.Icon,
      // userId: session?.user?.id, // Add userId from auth if needed
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

// PUT /api/links/[id] - Update a link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, label, icon, href, type } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 },
      );
    }

    const updatedLink = await updateLink(id, {
      label,
      icon,
      href,
      type: type === "list" ? IconType.List : IconType.Icon,
    });

    return NextResponse.json({ link: updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 },
    );
  }
}

// DELETE /api/links/[id] - Delete a link
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 },
      );
    }

    await deleteLink(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 },
    );
  }
}
