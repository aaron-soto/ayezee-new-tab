import Link from "next/link";
import SettingsForm from "@/components/SettingsForm";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-foreground/5 mb-6 rounded-2xl p-8 shadow-xl backdrop-blur-2xl">
          <h1 className="mb-6 text-2xl font-bold text-white">Settings</h1>
          <SettingsForm user={session.user} />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
