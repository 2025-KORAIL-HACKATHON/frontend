"use client";

import { useParams, useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";

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

export default function MatchedPage() {
  const router = useRouter();
  const params = useParams<{ postId: string }>();

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white">
        <header className="px-4 pt-3 pb-3 border-b">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <IconBack />
            </button>
            <div className="font-black">매칭 완료</div>
            <div className="w-10" />
          </div>
        </header>

        <div className="px-6 py-10">
          <div className="rounded-2xl border bg-white p-8 flex flex-col items-center">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-neutral-200" />
              <div className="h-10 w-10 rounded-full bg-sky-200 flex items-center justify-center">
                🤝
              </div>
              <div className="h-16 w-16 rounded-full bg-neutral-200" />
            </div>

            <div className="mt-6 text-center font-black text-lg">
              용감한 호랑이 님과
              <br />
              매칭이 완료되었습니다.
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[
                "25.12.14 ~ 25.12.15 (총 1박 2일)",
                "n명 모집",
                "여유로움",
                "인당 30만원대",
                "여행 목적",
                "여행 목적",
                "여행 목적",
              ].map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md border text-xs text-neutral-700 bg-white"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-6 w-full rounded-2xl border p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center">
                  🛡️
                </div>
                <div className="text-sm text-sky-700 font-bold">
                  안전한 여행을 위한 팁
                </div>
              </div>
              <ul className="mt-2 text-xs text-sky-700 list-disc pl-6 space-y-1">
                <li>첫 만남은 공공장소에서 하세요.</li>
                <li>개인정보는 신중하게 공유하세요.</li>
                <li>여행 일정을 가족/친구와 공유하세요.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/travel/chat/room-${params.postId}`)}
              className="cursor-pointer mt-6 w-full h-12 rounded-2xl bg-sky-500 text-white font-black"
            >
              채팅으로 이동
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
