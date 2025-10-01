import LinkTile, { LinkItem } from "@/components/tiles/LinkTile";

import AyeZeeLogo from "@/components/AyeZeeLogo";
import Greeting from "@/components/greeting";
import { TimeDisplay } from "@/components/TimeDisplay";
import { links } from "@/lib/links";

export default async function Home() {
  return (
    <div className="p-4">
      <AyeZeeLogo className="mb-4 md:mb-8 w-[200px] h-auto" />

      <Greeting />

      <div className="absolute bottom-4 right-4">
        <TimeDisplay />
      </div>

      <div className="flex flex-wrap items-center justify-start w-full gap-y-10 md:gap-y-12 gap-x-4 md:gap-x-8">
        {links.map((link) => (
          <LinkTile key={link.label} link={link as LinkItem} />
        ))}
      </div>
    </div>
  );
}
