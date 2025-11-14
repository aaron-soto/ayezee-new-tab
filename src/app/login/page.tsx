import AnimatedGradientBackground from "@/components/AnimatedGradientBackground";
import AyeZeeLogo from "@/components/AyeZeeLogo";
import SignInButton from "@/components/SignInButton";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <AnimatedGradientBackground />

      <div className="relative w-full max-w-md space-y-8 rounded-2xl p-8">
        <div className="flex flex-col items-center space-y-4">
          <AyeZeeLogo className="mb-8 h-auto w-[200px]" />
          <p className="text-center text-neutral-300">
            Sign in to access your personalized new tab experience.
          </p>
        </div>

        <div className="mt-8">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
