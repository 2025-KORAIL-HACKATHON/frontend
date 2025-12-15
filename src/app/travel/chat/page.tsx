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
        {/* 고정 헤더 */}
        <header className="h-14 shrink-0 grid grid-cols-3 items-center px-4 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer justify-self-start text-xl leading-none"
            aria-label="뒤로가기"
          >
            ‹
          </button>
          <div className="justify-self-center font-bold">채팅 목록</div>
          <div className="justify-self-end w-6" />
        </header>

        <div className="px-6 pb-6">
          <div className="flex flex-col gap-8 pt-6">
            {mockRooms.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => router.push(`/travel/chat/${r.id}`)}
                className="border-gray-300 border-b cursor-pointer w-full text-left flex items-center gap-4 pb-6"
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
