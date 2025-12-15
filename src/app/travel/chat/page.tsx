"use client";

import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { mockRooms } from "@/lib/koTripMock";

function IconBack() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChatListPage() {
  const router = useRouter();

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white">
        <header className="px-4 pt-3 pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <IconBack />
          </button>

          <div className="mt-3 text-lg font-black">채팅 목록</div>
        </header>

        <div className="px-6 pb-6">
          <div className="flex flex-col gap-8 ">
            {mockRooms.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => router.push(`/travel/chat/${r.id}`)}
                className="border-gray-300 border-b cursor-pointer w-full text-left flex items-center gap-4 pb-4"
              >
                <div className="h-16 w-16 rounded-full bg-sky-100 shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="font-black">{r.name}</div>
                  <div className="text-xs text-neutral-600 line-clamp-1">
                    {r.lastText}
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">
                    {r.lastAgo}
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="h-10 w-20 rounded-md bg-sky-400 text-white text-sm font-semibold flex items-center justify-center">
                    View
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
