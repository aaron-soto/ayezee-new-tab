import * as dotenv from "dotenv";

import { IconType, links as staticLinks } from "./links";
import { closeDb, db } from "./db/drizzle-script";
import { linkChildren, links } from "./db/schema";

import { eq } from "drizzle-orm";

// Load environment variables FIRST before any other imports
dotenv.config();

/**
 * PERSONAL LINKS SEEDER
 *
 * This seeds YOUR personal links from links.ts to YOUR user account.
 * This is NOT used for new user signups - see seedUser.ts for that.
 *
 * Usage: npm run db:seed-personal -- <your-user-id>
 *
 * To find your user ID:
 * 1. Sign in to the app
 * 2. Run: npm run db:studio
 * 3. Look in the "user" table for your email
 * 4. Copy your user ID
 */
async function seedPersonalLinks() {
  try {
    const userId = process.argv[2];

    if (!userId) {
      console.error("❌ Please provide YOUR user ID as an argument");
      console.error("Usage: npm run db:seed-personal -- <your-user-id>");
      console.error("\nTo find your user ID:");
      console.error("1. Run: npm run db:studio");
      console.error("2. Look in the 'user' table");
      console.error("3. Find your email and copy the user ID");
      process.exit(1);
    }

    console.log("🌱 Seeding YOUR personal links...");
    console.log(`   User ID: ${userId}`);

    // Delete existing links for this user only
    console.log("🗑️  Clearing your existing links...");
    const existingLinks = await db.query.links.findMany({
      where: (links, { eq }) => eq(links.userId, userId),
    });

    for (const link of existingLinks) {
      await db.delete(linkChildren).where(eq(linkChildren.parentId, link.id));
    }
    await db.delete(links).where(eq(links.userId, userId));

    // Insert links
    console.log("📝 Inserting your personal links...");
    for (let i = 0; i < staticLinks.length; i++) {
      const link = staticLinks[i];

      const [insertedLink] = await db
        .insert(links)
        .values({
          href: link.href,
          label: link.label,
          icon: link.icon,
          type: link.type === IconType.List ? "list" : "icon",
          position: i,
          userId: userId, // Your user ID
        })
        .returning();

      console.log(`  ✓ Inserted: ${link.label}`);

      // Insert children if they exist
      if (link.children && link.children.length > 0) {
        console.log(`    └─ Inserting ${link.children.length} children...`);
        for (let j = 0; j < link.children.length; j++) {
          const child = link.children[j];
          await db.insert(linkChildren).values({
            parentId: insertedLink.id,
            href: child.href!,
            label: child.label,
            icon: child.icon,
            position: j,
          });
          console.log(`       ✓ ${child.label}`);
        }
      }
    }

    console.log("\n✅ Database seeded successfully!");
    console.log(`   Total links: ${staticLinks.length}`);
    console.log(
      `   Total children: ${staticLinks.reduce((acc, link) => acc + (link.children?.length || 0), 0)}`,
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await closeDb();
  }
}

// Run the seed function
if (require.main === module) {
  process.env.DB_SEEDING = "1";
  seedPersonalLinks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedPersonalLinks as seedLinks };
