import AddLinkButton from "@/components/AddLinkButton";
import AyeZeeLogo from "@/components/AyeZeeLogo";
import DraggableGrid from "@/components/DraggableGrid";
import Greeting from "@/components/greeting";
import SearchBar from "@/components/SearchBar";
import { TimeDisplay } from "@/components/TimeDisplay";
import TipsComponent from "@/components/TipsComponent";
import UserMenu from "@/components/UserMenu";
import { getLinksFromDb } from "@/lib/linksDb";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user-specific links
  const links = await getLinksFromDb(session.user.id);

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between w-full mb-8">
        <AyeZeeLogo className="mr-8 h-auto w-[200px]" />

        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Greeting name={session.user.name} />

          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <AddLinkButton />
        </div>
      </div>

      <DraggableGrid links={links} />

      <div className="absolute flex items-end justify-between inset-x-4 bottom-4">
        <TipsComponent />

        <TimeDisplay />
      </div>
    </div>
  );
}
