"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { useRecommendStore } from "@/stores/recommendStore";

const PAGE_SIZE = 4;

export default function PackageResultPage() {
  const router = useRouter();
  const { input, matchedPackages } = useRecommendStore();

  const [page, setPage] = useState(1);
  const [filterPurpose, setFilterPurpose] = useState<string>("ALL");
  const [sortKey, setSortKey] = useState<"RELEVANCE" | "PRICE_LOW">(
    "RELEVANCE"
  );

  if (!input) {
    router.replace("/travel/recommend/input");
    return null;
  }
  if (input.travelType !== "PACKAGE") {
    router.replace("/travel/recommend/itinerary");
    return null;
  }

  const purposes = useMemo(() => {
    const set = new Set<string>();
    matchedPackages.forEach((p) => p.purposes.forEach((x) => set.add(x)));
    return ["ALL", ...Array.from(set)];
  }, [matchedPackages]);

  const filtered = useMemo(() => {
    let list = [...matchedPackages];

    if (filterPurpose !== "ALL") {
      list = list.filter((p) => p.purposes.includes(filterPurpose));
    }

    if (sortKey === "PRICE_LOW") {
      list.sort((a, b) => a.price - b.price);
    }

    return list;
  }, [matchedPackages, filterPurpose, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      {/* 전체 overflow-hidden으로 잠금 */}
      <div className="h-full flex flex-col bg-white overflow-hidden">
        {/* 고정 헤더 */}
        <header className="h-14 shrink-0 grid grid-cols-3 items-center px-4 border-b bg-white">
          <button
            type="button"
            onClick={() => router.back()}
            className="justify-self-start text-sm cursor-pointer"
            aria-label="뒤로가기"
          >
            ←
          </button>

          <div className="justify-self-center font-bold">
            패키지 추천 리스트
          </div>

          <div className="justify-self-end w-6" />
        </header>

        {/* 본문 + 하단 버튼 레이아웃 */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* 본문만 스크롤 */}
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
            <div className="font-bold text-lg">
              {input.region1} · {input.period}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              목적: {input.purposes.join(", ")}
            </div>

            {/* 필터/정렬 */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <select
                className="h-11 rounded-xl border px-3 text-sm"
                value={filterPurpose}
                onChange={(e) => {
                  setFilterPurpose(e.target.value);
                  setPage(1);
                }}
              >
                {purposes.map((p) => (
                  <option key={p} value={p}>
                    {p === "ALL" ? "목적 전체" : p}
                  </option>
                ))}
              </select>

              <select
                className="h-11 rounded-xl border px-3 text-sm"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
              >
                <option value="RELEVANCE">관련도순</option>
                <option value="PRICE_LOW">가격 낮은순</option>
              </select>
            </div>

            {/* 리스트 */}
            <div className="mt-6 space-y-3">
              {pageItems.length === 0 ? (
                <div className="rounded-2xl border p-4 text-sm text-neutral-600">
                  조건에 맞는 패키지 상품이 없어요.
                </div>
              ) : (
                pageItems.map((p) => (
                  <div key={p.id} className="rounded-2xl border p-4">
                    <div className="text-xs text-neutral-500">
                      {p.region} · {p.period} · {p.provider}
                    </div>
                    <div className="mt-1 font-bold">{p.title}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.purposes.map((x) => (
                        <span
                          key={x}
                          className="text-xs px-2 py-1 rounded-full bg-neutral-100"
                        >
                          {x}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 font-bold">
                      {p.price.toLocaleString()}원
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                className="h-10 px-3 rounded-xl border text-sm disabled:opacity-40"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                이전
              </button>
              <div className="text-sm font-semibold">
                {safePage} / {totalPages}
              </div>
              <button
                className="cursor-pointer h-10 px-3 rounded-xl border text-sm disabled:opacity-40"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                다음
              </button>
            </div>
          </div>

          {/* 하단 고정 버튼 */}
          <div className="shrink-0 px-5 pb-5 pt-3 bg-white border-t">
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
