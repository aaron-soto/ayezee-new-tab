// Example of how to update page.tsx to use database links
// This file shows the migration path from static links to database links

import AyeZeeLogo from "@/components/AyeZeeLogo";
import DraggableGrid from "@/components/DraggableGrid";
import Greeting from "@/components/greeting";
import { TimeDisplay } from "@/components/TimeDisplay";
import { getLinksFromDb } from "@/lib/linksDb";

// OPTION 1: Use database links (recommended for production)

// OPTION 2: Keep using static links (for backward compatibility)
// import { links } from "@/lib/links";

export default async function Home() {
  // Fetch links from database
  // For global links (not user-specific), don't pass a userId
  const links = await getLinksFromDb();

  // For user-specific links, you would pass the userId:
  // const session = await getServerSession(); // or however you get the user
  // const links = await getLinksFromDb(session?.user?.id);

  return (
    <div className="p-4">
      <div className="mb-8 flex w-full items-center justify-start">
        <AyeZeeLogo className="mr-8 h-auto w-[200px]" />

        <div className="flex items-center gap-4">
          {/* <button className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700">
            Icons
          </button> */}
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <Greeting />

        <div className="flex items-center gap-4">
          {/* <NewLinkSidebar /> */}
        </div>
      </div>

      <DraggableGrid links={links} />

      <div className="absolute bottom-4 right-4">
        <TimeDisplay />
      </div>
    </div>
  );
}
