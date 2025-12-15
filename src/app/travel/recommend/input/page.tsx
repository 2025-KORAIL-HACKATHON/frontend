"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { useRecommendStore } from "@/stores/recommendStore";
import type { RecommendInput, TravelType } from "@/types/recommend";
import { PROVINCES, DISTRICTS } from "@/data/region";

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

function toDate(yyyyMMdd: string) {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function daysBetweenInclusive(start: string, end: string) {
  const s = toDate(start);
  const e = toDate(end);
  if (!s || !e) return 0;
  const ms = e.getTime() - s.getTime();
  const diff = Math.floor(ms / (1000 * 60 * 60 * 24));
  return diff + 1;
}

function suggestPeriodLabel(
  start: string,
  end: string
): RecommendInput["period"] | null {
  const days = daysBetweenInclusive(start, end);
  if (days <= 0) return null;

  if (days === 1) return "당일";
  if (days === 2) return "1박2일";
  if (days === 3) return "2박3일";
  if (days === 4) return "3박4일";
  return "4박이상";
}

export default function RecommendInputPage() {
  const router = useRouter();
  const { setInput } = useRecommendStore();

  const [travelType, setTravelType] = useState<TravelType>("FREE");

  // ✅ 출발지
  const [fromProvinceCode, setFromProvinceCode] = useState("");
  const [fromDistrictCode, setFromDistrictCode] = useState("");

  // ✅ 도착지
  const [toProvinceCode, setToProvinceCode] = useState("");
  const [toDistrictCode, setToDistrictCode] = useState("");

  // 여행 목적(단일)
  const [purpose, setPurpose] = useState<string>("");

  const [period, setPeriod] = useState<RecommendInput["period"] | "">("");
  const [intensity, setIntensity] = useState<RecommendInput["intensity"] | "">(
    ""
  );
  const [people, setPeople] = useState<RecommendInput["people"] | "">("");

  // 달력(날짜)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // 출발지 구/군/구
  const fromDistricts = useMemo(() => {
    if (!fromProvinceCode) return [];
    return DISTRICTS.filter((d) => d.provinceCode === fromProvinceCode);
  }, [fromProvinceCode]);

  // 도착지 구/군/구
  const toDistricts = useMemo(() => {
    if (!toProvinceCode) return [];
    return DISTRICTS.filter((d) => d.provinceCode === toProvinceCode);
  }, [toProvinceCode]);

  // 출발지 이름
  const fromProvinceName = useMemo(() => {
    return PROVINCES.find((p) => p.code === fromProvinceCode)?.name ?? "";
  }, [fromProvinceCode]);

  const fromDistrictName = useMemo(() => {
    return fromDistricts.find((d) => d.code === fromDistrictCode)?.name ?? "";
  }, [fromDistrictCode, fromDistricts]);

  // 도착지 이름
  const toProvinceName = useMemo(() => {
    return PROVINCES.find((p) => p.code === toProvinceCode)?.name ?? "";
  }, [toProvinceCode]);

  const toDistrictName = useMemo(() => {
    return toDistricts.find((d) => d.code === toDistrictCode)?.name ?? "";
  }, [toDistrictCode, toDistricts]);

  const onChangeStart = (v: string) => {
    setStartDate(v);
    if (endDate && v && endDate < v) setEndDate(v);
    if (v && endDate) {
      const suggested = suggestPeriodLabel(v, endDate);
      if (suggested) setPeriod(suggested);
    }
  };

  const onChangeEnd = (v: string) => {
    if (startDate && v && v < startDate) return;
    setEndDate(v);
    if (startDate && v) {
      const suggested = suggestPeriodLabel(startDate, v);
      if (suggested) setPeriod(suggested);
    }
  };

  const isValid = useMemo(() => {
    return (
      !!travelType &&
      !!fromProvinceCode &&
      !!fromDistrictCode &&
      !!toProvinceCode &&
      !!toDistrictCode &&
      !!startDate &&
      !!endDate &&
      !!period &&
      !!purpose &&
      !!intensity &&
      !!people
    );
  }, [
    travelType,
    fromProvinceCode,
    fromDistrictCode,
    toProvinceCode,
    toDistrictCode,
    startDate,
    endDate,
    period,
    purpose,
    intensity,
    people,
  ]);

  const onNext = () => {
    if (!isValid) return;

    // ✅ 기존 타입을 유지한다면: region1/region2를 출발/도착으로 사용
    const payload: RecommendInput = {
      travelType,
      region1: `${fromProvinceName} ${fromDistrictName}`.trim(), // 출발지
      region2: `${toProvinceName} ${toDistrictName}`.trim(), // 도착지
      period: period as RecommendInput["period"],
      purposes: [purpose],
      intensity: intensity as RecommendInput["intensity"],
      people: people as RecommendInput["people"],
      startDate,
      endDate,
    };

    setInput(payload);
    router.push("/travel/recommend/loading");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full flex flex-col bg-white">
        {/* 고정 헤더 */}
        <header className="shrink-0 bg-white">
          <div className="h-14 grid grid-cols-3 items-center px-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="justify-self-start text-sm cursor-pointer"
              aria-label="뒤로가기"
            >
              ←
            </button>
            <div className="justify-self-center font-bold">정보 입력</div>
            <div className="justify-self-end w-6" />
          </div>
        </header>

        {/* 본문 스크롤 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-6">
          {/* 로고 */}
          <div className="px-5 pb-4">
            <div className="relative h-10">
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <Image
                  src="/icons/kotrip.svg"
                  alt="ko trip"
                  width={120}
                  height={24}
                  priority
                />
              </div>
            </div>
          </div>

          <div className="text-lg font-bold pt-4">여행 관련 정보</div>

          {/* 여행 유형 */}
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

          {/* 여행 날짜 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">여행 날짜</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <div className="text-xs text-neutral-500">출발일</div>
                <input
                  type="date"
                  className="h-11 rounded-xl border px-3 text-sm"
                  value={startDate}
                  onChange={(e) => onChangeStart(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-xs text-neutral-500">도착일</div>
                <input
                  type="date"
                  className="h-11 rounded-xl border px-3 text-sm"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => onChangeEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ✅ 출발지 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">출발지</div>
            <div className="grid grid-cols-2 gap-3">
              <select
                className="h-11 rounded-xl border px-3 cursor-pointer text-sm"
                value={fromProvinceCode}
                onChange={(e) => {
                  setFromProvinceCode(e.target.value);
                  setFromDistrictCode("");
                }}
              >
                <option value="">시/도 선택</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                className="h-11 rounded-xl border px-3 cursor-pointer text-sm"
                value={fromDistrictCode}
                onChange={(e) => setFromDistrictCode(e.target.value)}
                disabled={!fromProvinceCode}
              >
                <option value="">
                  {fromProvinceCode ? "시/군/구 선택" : "시/도를 먼저 선택"}
                </option>
                {fromDistricts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ 도착지 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">도착지</div>
            <div className="grid grid-cols-2 gap-3">
              <select
                className="h-11 rounded-xl border px-3 cursor-pointer text-sm"
                value={toProvinceCode}
                onChange={(e) => {
                  setToProvinceCode(e.target.value);
                  setToDistrictCode("");
                }}
              >
                <option value="">시/도 선택</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                className="h-11 rounded-xl border px-3 cursor-pointer text-sm"
                value={toDistrictCode}
                onChange={(e) => setToDistrictCode(e.target.value)}
                disabled={!toProvinceCode}
              >
                <option value="">
                  {toProvinceCode ? "시/군/구 선택" : "시/도를 먼저 선택"}
                </option>
                {toDistricts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 목적 (단일선택) */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">
              여행 목적 (단일선택)
            </div>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <Chip
                  key={p}
                  active={purpose === p}
                  onClick={() => setPurpose(p)}
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
        <div className="sticky bottom-0 z-10 bg-white px-5 py-4">
          <button
            type="button"
            disabled={!isValid}
            onClick={onNext}
            className={[
              "w-full h-12 rounded-2xl font-bold",
              isValid
                ? "bg-sky-500 text-white cursor-pointer"
                : "bg-neutral-200 text-neutral-500 cursor-not-allowed",
            ].join(" ")}
          >
            다음
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
