"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { key: "home", label: "홈", href: "/home", icon: "🏠" },
  { key: "benefit", label: "혜택·정기권", href: "/benefit", icon: "🎁" },
  { key: "travel", label: "여행상품·패스", href: "/travel", icon: "🧳" },
  { key: "myticket", label: "나의 티켓", href: "/my-ticket", icon: "🎫" },
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
            className={`flex flex-col items-center justify-center text-xs ${
              active ? "text-[#0B3A5B] font-semibold" : "text-neutral-500"
            }`}
          >
            <div className="text-lg">{t.icon}</div>
            <div>{t.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}
