"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 px-4 rounded-full border text-xs font-semibold",
        active
          ? "border-sky-500 bg-sky-50 text-sky-600"
          : "border-neutral-300 text-neutral-600",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function KoTripFilterPage() {
  const router = useRouter();

  const [region, setRegion] = useState<string | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const [people, setPeople] = useState<string | null>(null);

  const applyFilter = () => {
    /**
     * 지금은 단순 이동
     * 나중에:
     *  - zustand store
     *  - query string (?region=서울&period=1박2일)
     * 로 확장 가능
     */
    router.push("/travel/ko-trip");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white flex flex-col">
        {/* 헤더 */}
        <header className="h-14 shrink-0 flex items-center px-4 border-b">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <IconBack />
          </button>
          <div className="flex-1 text-center font-bold">맞춤형 모집글 필터</div>
          <div className="w-8" />
        </header>

        {/* 본문 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-8">
          {/* 지역 */}
          <section>
            <div className="text-sm font-bold mb-3">여행 지역</div>
            <div className="flex flex-wrap gap-2">
              {["서울", "부산", "강원", "제주", "전라도"].map((r) => (
                <Chip
                  key={r}
                  active={region === r}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </Chip>
              ))}
            </div>
          </section>

          {/* 기간 */}
          <section>
            <div className="text-sm font-bold mb-3">여행 기간</div>
            <div className="flex flex-wrap gap-2">
              {["당일", "1박2일", "2박3일", "3박 이상"].map((p) => (
                <Chip
                  key={p}
                  active={period === p}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </Chip>
              ))}
            </div>
          </section>

          {/* 동행 인원 */}
          <section>
            <div className="text-sm font-bold mb-3">동행 인원</div>
            <div className="flex flex-wrap gap-2">
              {["2명", "3명", "4명 이상"].map((p) => (
                <Chip
                  key={p}
                  active={people === p}
                  onClick={() => setPeople(p)}
                >
                  {p}
                </Chip>
              ))}
            </div>
          </section>
        </div>

        {/* 하단 버튼 */}
        <div className="shrink-0 px-5 py-4 border-t bg-white">
          <button
            type="button"
            onClick={applyFilter}
            className="w-full h-12 rounded-2xl bg-sky-500 text-white font-bold"
          >
            조건 적용하기
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
