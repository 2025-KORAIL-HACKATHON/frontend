"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const tabs = [
  { key: "home", label: "홈", href: "/home", iconSrc: "/icons/home.svg" },
  {
    key: "benefit",
    label: "혜택·정기권",
    href: "/benefit",
    iconSrc: "/icons/benefit.svg",
  },
  {
    key: "travel",
    label: "여행상품·패스",
    href: "/travel",
    iconSrc: "/icons/travel.svg",
  },
  {
    key: "myticket",
    label: "나의 티켓",
    href: "/my-ticket",
    iconSrc: "/icons/ticket.svg",
  },
] as const;

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="h-16 border-t bg-white grid grid-cols-4">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);

        return (
          <Link
            key={t.key}
            href={t.href}
            className={`flex flex-col items-center justify-center gap-0.5 text-xs ${
              active ? "text-[#0B3A5B] font-semibold" : "text-neutral-500"
            }`}
          >
            {/* SVG 아이콘 */}
            <Image
              src={t.iconSrc}
              alt={t.label}
              width={26}
              height={26}
              className={active ? "opacity-100" : "opacity-70"}
            />

            <div>{t.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}
