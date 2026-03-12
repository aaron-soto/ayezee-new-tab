import { asc, eq, inArray, isNull } from "drizzle-orm";
import { linkChildren, links } from "./db/schema";
import { unstable_cache } from "next/cache";

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
  gridRow?: number | null;
  gridColumn?: number | null;
  children?: Link[];
}

async function fetchLinksFromDb(userId?: string): Promise<Link[]> {
  const dbLinks = await db.query.links.findMany({
    where: userId ? eq(links.userId, userId) : isNull(links.userId),
    orderBy: [asc(links.position)],
  });

  if (dbLinks.length === 0) return [];

  // Batch fetch all children in a single query instead of N+1
  const parentIds = dbLinks.map((link) => link.id);
  const allChildren = await db.query.linkChildren.findMany({
    where: inArray(linkChildren.parentId, parentIds),
    orderBy: [asc(linkChildren.position)],
  });

  // Group children by parentId
  const childrenByParent = new Map<string, typeof allChildren>();
  for (const child of allChildren) {
    const existing = childrenByParent.get(child.parentId) || [];
    existing.push(child);
    childrenByParent.set(child.parentId, existing);
  }

  return dbLinks.map((link) => {
    const children = childrenByParent.get(link.id);
    return {
      id: link.id,
      href: link.href || undefined,
      label: link.label,
      icon: link.icon,
      type: link.type === "list" ? IconType.List : IconType.Icon,
      visitCount: link.visitCount || 0,
      gridRow: link.gridRow,
      gridColumn: link.gridColumn,
      children: children?.length
        ? children.map((child) => ({
            id: child.id,
            href: child.href,
            label: child.label,
            icon: child.icon,
          }))
        : undefined,
    };
  });
}

/**
 * Fetch all links from the database with their children (cached per user).
 * Cache is invalidated via revalidateTag(`links-${userId}`) on mutations.
 */
export async function getLinksFromDb(userId?: string): Promise<Link[]> {
  const tag = userId ? `links-${userId}` : "links-global";
  const cachedFetch = unstable_cache(
    () => fetchLinksFromDb(userId),
    [`links`, userId ?? "global"],
    { tags: [tag] },
  );
  return cachedFetch();
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
