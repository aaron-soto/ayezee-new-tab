import AyeZeeLogo from "@/components/AyeZeeLogo";
import DraggableGrid from "@/components/DraggableGrid";
import Greeting from "@/components/greeting";
import { TimeDisplay } from "@/components/TimeDisplay";
import { links } from "@/lib/links";

// import NewLinkSidebar from "@/components/NewLinkSidebar";

export default async function Home() {
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
