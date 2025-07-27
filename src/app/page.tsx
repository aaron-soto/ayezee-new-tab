import AyeZeeLogo from "@/components/AyeZeeLogo";
import Image from "next/image";
import { TimeDisplay } from "@/components/TimeDisplay";
import { getTimeBasedGreeting } from "@/lib/utils";
import { links } from "@/lib/links";

export default async function Home() {
  return (
    <div className="p-4 ">
      <AyeZeeLogo className="mb-12 w-[200px] h-auto" />

      <h2 className="mb-8 text-2xl font-bold">{getTimeBasedGreeting()}, Aaron</h2>

      <div className="absolute bottom-4 right-4">
        <TimeDisplay />
      </div>

      <div className="flex flex-wrap items-center justify-around gap-10 gap-y-12 md:justify-start">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="relative flex items-center group drop-shadow-2xl"
          >
            <svg
              viewBox="0 0 160 160"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              fill="currentColor"
              className="transition-all duration-100 ease-in-out cursor-pointer size-16 min-h-16 min-w-16 text-neutral-800 group-hover:text-neutral-700"
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
              className="absolute -translate-x-1/2 size-8 left-1/2"
            />
            <span className="absolute text-sm font-medium -translate-x-1/2 -bottom-6 left-1/2 text-nowrap text-ellipsis">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
