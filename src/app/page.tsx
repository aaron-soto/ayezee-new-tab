import AddLinkButton from "@/components/AddLinkButton";
import AyeZeeLogo from "@/components/AyeZeeLogo";
import DraggableGrid from "@/components/DraggableGrid";
import Greeting from "@/components/greeting";
import { TimeDisplay } from "@/components/TimeDisplay";
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
      <div className="mb-8 flex w-full items-center justify-between">
        <AyeZeeLogo className="mr-8 h-auto w-[200px]" />

        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <Greeting name={session.user.name} />

        <div className="flex items-center gap-4">
          <AddLinkButton />
        </div>
      </div>

      <DraggableGrid links={links} />

      <div className="absolute bottom-4 right-4">
        <TimeDisplay />
      </div>
    </div>
  );
}
