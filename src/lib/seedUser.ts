import * as dotenv from "dotenv";

import { closeDb, db } from "./db/drizzle-script";
import { linkChildren, links } from "./db/schema";

import { IconType } from "./links";
import { defaultLinks } from "./defaultLinks";

// Load environment variables FIRST before any other imports
dotenv.config();

/**
 * Seed links for a specific user
 * @param userId - The user ID to seed links for
 */
export async function seedLinksForUser(userId: string) {
  try {
    console.log(`🌱 Seeding links for user: ${userId}...`);

    // Check if user already has links
    const existingLinks = await db.query.links.findMany({
      where: (links, { eq }) => eq(links.userId, userId),
    });

    if (existingLinks.length > 0) {
      console.log(
        `ℹ️  User already has ${existingLinks.length} links. Skipping seed.`,
      );
      return;
    }

    // Insert links
    console.log("📝 Inserting links...");
    for (let i = 0; i < defaultLinks.length; i++) {
      const link = defaultLinks[i];

      const [insertedLink] = await db
        .insert(links)
        .values({
          href: link.href,
          label: link.label,
          icon: link.icon,
          type: link.type === IconType.List ? "list" : "icon",
          position: i,
          userId: userId,
        })
        .returning();

      console.log(`  ✓ Inserted: ${link.label}`);

      // Insert children if they exist
      if (link.children && link.children.length > 0) {
        for (let j = 0; j < link.children.length; j++) {
          const child = link.children[j];
          await db.insert(linkChildren).values({
            parentId: insertedLink.id,
            href: child.href!,
            label: child.label,
            icon: child.icon,
            position: j,
          });
        }
      }
    }

    console.log(`\n✅ Links seeded successfully for user ${userId}!`);
    console.log(`   Total links: ${defaultLinks.length}`);
  } catch (error) {
    console.error("❌ Error seeding links:", error);
    throw error;
  }
}

/**
 * Script to seed links for a user (run with: npm run db:seed-user -- <userId>)
 */
if (require.main === module) {
  const userId = process.argv[2];

  if (!userId) {
    console.error("❌ Please provide a user ID as an argument");
    console.error("Usage: npm run db:seed-user -- <userId>");
    process.exit(1);
  }

  process.env.DB_SEEDING = "1";
  seedLinksForUser(userId)
    .then(() => closeDb())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
