import { asc, eq, isNull } from "drizzle-orm";
import { linkChildren, links } from "./db/schema";

import { db } from "./db/drizzle";

export enum IconType {
  Icon = 0,
  List = 1,
}

export interface Link {
  id?: string;
  href?: string;
  label: string;
  icon: string;
  type?: IconType;
  visitCount?: number;
  children?: Link[];
}

/**
 * Fetch all links from the database with their children
 * @param userId Optional user ID to filter links by user
 * @returns Array of links with nested children
 */
export async function getLinksFromDb(userId?: string): Promise<Link[]> {
  // Fetch all links for the user (or global links if userId is null)
  const dbLinks = await db.query.links.findMany({
    where: userId ? eq(links.userId, userId) : isNull(links.userId),
    orderBy: [asc(links.position)],
  });

  // Fetch all children for these links
  const result: Link[] = [];

  for (const link of dbLinks) {
    const children = await db.query.linkChildren.findMany({
      where: eq(linkChildren.parentId, link.id),
      orderBy: [asc(linkChildren.position)],
    });

    result.push({
      id: link.id,
      href: link.href || undefined,
      label: link.label,
      icon: link.icon,
      type: link.type === "list" ? IconType.List : IconType.Icon,
      visitCount: link.visitCount || 0,
      children: children.length
        ? children.map((child) => ({
            id: child.id,
            href: child.href,
            label: child.label,
            icon: child.icon,
          }))
        : undefined,
    });
  }

  return result;
}

/**
 * Create a new link
 */
export async function createLink(
  data: Omit<Link, "id" | "children"> & {
    userId?: string;
    cloudinaryPublicId?: string;
  },
) {
  const [newLink] = await db
    .insert(links)
    .values({
      href: data.href,
      label: data.label,
      icon: data.icon,
      cloudinaryPublicId: data.cloudinaryPublicId || null,
      type: data.type === IconType.List ? "list" : "icon",
      userId: data.userId || null,
      position: 0, // You might want to calculate this based on existing links
    })
    .returning();

  return newLink;
}

/**
 * Update a link
 */
export async function updateLink(
  linkId: string,
  data: Partial<Omit<Link, "id" | "children">>,
) {
  // Build update object with only provided fields
  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (data.href !== undefined) updateData.href = data.href;
  if (data.label !== undefined) updateData.label = data.label;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.type !== undefined) {
    updateData.type = data.type === IconType.List ? "list" : "icon";
  }

  const [updatedLink] = await db
    .update(links)
    .set(updateData)
    .where(eq(links.id, linkId))
    .returning();

  return updatedLink;
}

/**
 * Delete a link
 */
export async function deleteLink(linkId: string) {
  // First get the link to check if it has a cloudinary public ID
  const [link] = await db.select().from(links).where(eq(links.id, linkId));

  // Delete the link from database
  await db.delete(links).where(eq(links.id, linkId));

  // Return the cloudinary public ID if it exists (caller will handle deletion)
  return link?.cloudinaryPublicId || null;
}

// Export the static links for backward compatibility
export { links as staticLinks } from "./links";
