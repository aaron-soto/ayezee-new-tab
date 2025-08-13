// app/page.tsx
import AyeZeeLogo from "@/components/AyeZeeLogo";
import { TimeDisplay } from "@/components/TimeDisplay";
import Greeting from "@/components/greeting";
import { nav } from "@/lib/links";
import type { NavItem, PanelItem } from "@/lib/nav-types";
import { PanelGroup } from "@/components/PanelGroup";
import { LinkTile } from "@/components/LinkTile";
import { FolderTile } from "@/components/FolderTile";

export default function Home() {
  return (
    <div className="p-4">
      <AyeZeeLogo className="mb-12 w-[200px] h-auto" />
      <Greeting />

      <div className="absolute bottom-4 right-4">
        <TimeDisplay />
      </div>

      {/* Top-level: allow either loose links/folders or panels */}
      <div className="mt-4">
        {nav.map((item: NavItem) => {
          if (item.type === "panel") {
            return <PanelGroup key={(item as PanelItem).title} panel={item as PanelItem} />;
          }
          // If you want to allow non-panel items at root:
          if (item.type === "link") {
            return (
              <div key={item.label} className="mb-6">
                <div className="flex flex-wrap items-center gap-10 gap-y-12">
                  <LinkTile href={item.href} label={item.label} icon={item.icon} />
                </div>
              </div>
            );
          }
          if (item.type === "folder") {
            return (
              <div key={item.label} className="mb-6">
                <div className="flex flex-wrap items-center gap-10 gap-y-12">
                  <FolderTile folder={item} />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
