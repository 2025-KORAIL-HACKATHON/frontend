"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { useRecommendStore } from "@/stores/recommendStore";

export default function ItineraryPage() {
  const router = useRouter();
  const { input, itinerary } = useRecommendStore();
  const [activeDay, setActiveDay] = useState(1);

  const days = useMemo(() => itinerary ?? [], [itinerary]);

  if (!input) {
    router.replace("/travel/recommend/input");
    return null;
  }
  if (input.travelType !== "FREE") {
    router.replace("/travel/recommend/packages");
    return null;
  }

  const current = days.find((d) => d.day === activeDay);

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      {/*  전체를 overflow-hidden으로 잠그고 */}
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {/*  상단 헤더 고정 */}
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b">
          <button onClick={() => router.back()} className="text-sm">
            ←
          </button>
          <div className="font-bold">AI 추천 일정표</div>
        </header>

        {/*  헤더 아래(고정 영역 + 스크롤 영역 + 하단 버튼) */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/*  고정 정보 영역 */}
          <div className="shrink-0 px-5 pt-6">
            <div className="font-bold text-lg">
              {input.region1} · {input.period}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              목적: {input.purposes.join(", ")}
            </div>

            {/* DAY 탭 (고정) */}
            <div className="mt-6 flex gap-2">
              {days.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={[
                    "h-10 px-4 rounded-full border text-sm",
                    activeDay === d.day
                      ? "border-black font-bold"
                      : "text-neutral-500",
                  ].join(" ")}
                >
                  DAY {d.day}
                </button>
              ))}
            </div>
          </div>

          {/*  여기만 내부 스크롤 */}
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
            <div className="space-y-3">
              {(current?.items ?? []).map((it, idx) => (
                <div key={idx} className="rounded-2xl border p-4">
                  <div className="text-xs text-neutral-500">{it.time}</div>
                  <div className="mt-1 font-bold">{it.title}</div>
                  <div className="mt-1 text-sm text-neutral-600">{it.desc}</div>
                </div>
              ))}
            </div>

            {/*  리스트가 버튼 밑으로 숨지 않게 여백 */}
            <div className="h-24" />
          </div>

          {/*  하단 버튼 고정 */}
          <div className="shrink-0 px-5 pb-5">
            <button
              onClick={() => router.push("/travel")}
              className="w-full h-12 rounded-2xl bg-black text-white font-bold"
            >
              여행상품·패스로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
