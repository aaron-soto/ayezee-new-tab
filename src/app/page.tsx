import AyeZeeLogo from "@/components/AyeZeeLogo";
import Image from "next/image";
import { TimeDisplay } from "@/components/TimeDisplay";
import { getTimeBasedGreeting } from "@/lib/utils";
import { links } from "@/lib/links";

export default async function Home() {
  return (
    <div className="p-4 ">
      <AyeZeeLogo className="mb-12 w-[200px] h-auto" />

      <h2 className="text-2xl font-bold mb-8">{getTimeBasedGreeting()}, Aaron</h2>

      <div className="absolute bottom-4 right-4">
        <TimeDisplay />
      </div>

      <div className="flex flex-wrap gap-4 gap-y-12 justify-around md:justify-start items-center">
        {links.map((link) => (
          <a key={link.label} href={link.href} className="flex items-center relative group">
            <svg
              viewBox="0 0 160 160"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              fill="currentColor"
              className="size-16 min-h-16 min-w-16 text-neutral-800 group-hover:text-neutral-700 transition-all duration-100 ease-in-out cursor-pointer"
            >
              <path
                d="M 0 80 C 0 0, 0 0, 80 0 S 160 0, 160 80, 160 160
80 160, 0 160, 0 80"
                transform="rotate(0, 80, 80) translate(0, 0)"
              ></path>
            </svg>
            <Image
              src={link.icon}
              alt={link.label}
              width={32}
              height={32}
              className="size-8 absolute left-1/2 -translate-x-1/2"
            />
            <span className="text-xs font-semibold absolute -bottom-6 left-1/2 -translate-x-1/2 text-nowrap text-ellipsis">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
