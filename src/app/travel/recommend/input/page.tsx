"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { useRecommendStore } from "@/stores/recommendStore";
import type { RecommendInput, TravelType } from "@/types/recommend";

const PURPOSES = [
  "체험·액티비티",
  "문화·예술·역사",
  "자연과 함께",
  "여유롭게 힐링",
  "관광보다 먹방",
  "쇼핑은 열정적으로",
  "여행지 느낌 물씬",
  "유명 관광지 필수",
  "SNS 핫플",
] as const;

const REGIONS = [
  "서울",
  "부산",
  "대전",
  "강릉",
  "제주",
  "경주",
  "속초",
  "여수",
] as const;

const PERIODS: RecommendInput["period"][] = [
  "당일",
  "1박2일",
  "2박3일",
  "3박4일",
  "4박이상",
];
const INTENSITY: RecommendInput["intensity"][] = ["여유", "중간", "강행군"];
const PEOPLE: RecommendInput["people"][] = ["혼자서", "단둘이", "3명 이상"];

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
        "cursor-pointer h-10 px-4 rounded-full border text-sm",
        active
          ? "border-sky-500 text-sky-600 font-semibold"
          : "text-neutral-500",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function RecommendInputPage() {
  const router = useRouter();
  const { setInput } = useRecommendStore();

  const [travelType, setTravelType] = useState<TravelType>("FREE");
  const [region1, setRegion1] = useState("");
  const [region2, setRegion2] = useState("");
  const [period, setPeriod] = useState<RecommendInput["period"] | "">("");
  const [purposes, setPurposes] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<RecommendInput["intensity"] | "">(
    ""
  );
  const [people, setPeople] = useState<RecommendInput["people"] | "">("");

  const isValid = useMemo(() => {
    return (
      !!travelType &&
      !!region1 &&
      !!period &&
      purposes.length > 0 &&
      !!intensity &&
      !!people
    );
  }, [travelType, region1, period, purposes, intensity, people]);

  const togglePurpose = (p: string) => {
    setPurposes((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const onNext = () => {
    if (!isValid) return;

    const payload: RecommendInput = {
      travelType,
      region1,
      region2,
      period: period as RecommendInput["period"],
      purposes,
      intensity: intensity as RecommendInput["intensity"],
      people: people as RecommendInput["people"],
    };

    setInput(payload);
    router.push("/travel/recommend/loading");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full flex flex-col bg-white">
        {/* 고정 헤더 */}
        <header className="h-14 shrink-0 grid grid-cols-3 items-center px-4 border-b bg-white">
          {/* left */}
          <button
            type="button"
            onClick={() => router.back()}
            className="justify-self-start text-sm cursor-pointer"
            aria-label="뒤로가기"
          >
            ←
          </button>

          {/* center */}
          <div className="justify-self-center font-bold">정보 입력</div>

          {/* right (빈 공간: 중앙 정렬 고정용) */}
          <div className="justify-self-end w-6" />
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 pb-6">
          <div className="text-lg font-bold">여행 관련 정보</div>

          {/* 여행 유형 (상단 추가) */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">여행 유형</div>
            <div className="flex gap-2">
              <Chip
                active={travelType === "FREE"}
                onClick={() => setTravelType("FREE")}
              >
                자유 여행
              </Chip>
              <Chip
                active={travelType === "PACKAGE"}
                onClick={() => setTravelType("PACKAGE")}
              >
                패키지 여행
              </Chip>
            </div>
          </div>

          {/* 여행 지역 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">여행 지역</div>
            <div className="grid grid-cols-2 gap-3">
              <select
                className="h-11 rounded-xl border px-3 text-sm"
                value={region1}
                onChange={(e) => setRegion1(e.target.value)}
              >
                <option value="">지역 선택</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                className="h-11 rounded-xl border px-3 text-sm"
                value={region2}
                onChange={(e) => setRegion2(e.target.value)}
              >
                <option value="">(선택) 세부 지역</option>
                <option value="중심가">중심가</option>
                <option value="바다/강">바다/강</option>
                <option value="산/자연">산/자연</option>
                <option value="카페거리">카페거리</option>
              </select>
            </div>
          </div>

          {/* 여행 기간 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">여행 기간</div>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <Chip
                  key={p}
                  active={period === p}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </Chip>
              ))}
            </div>
          </div>

          {/* 목적 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">
              여행 목적 (다중선택)
            </div>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <Chip
                  key={p}
                  active={purposes.includes(p)}
                  onClick={() => togglePurpose(p)}
                >
                  {p}
                </Chip>
              ))}
            </div>
          </div>

          {/* 일정 강도 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">여행 일정 강도</div>
            <div className="flex gap-2">
              {INTENSITY.map((v) => (
                <Chip
                  key={v}
                  active={intensity === v}
                  onClick={() => setIntensity(v)}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          {/* 동행 인원 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">동행 인원</div>
            <div className="flex gap-2">
              {PEOPLE.map((v) => (
                <Chip
                  key={v}
                  active={people === v}
                  onClick={() => setPeople(v)}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 다음 버튼 */}
        <div className="sticky bottom-0 z-10 bg-white border-t px-5 py-4">
          <button
            type="button"
            disabled={!isValid}
            onClick={onNext}
            className={[
              "cursor-pointer w-full h-12 rounded-2xl font-bold",
              isValid
                ? "bg-sky-500 text-white"
                : "bg-neutral-200 text-neutral-500",
            ].join(" ")}
          >
            다음
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
