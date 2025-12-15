"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import StepProgress from "@/components/travel/StepProgress";

const KO_TRIP_INFO_MODE_KEY = "korail.koTripInfoMode.v1";
const KO_TRIP_STEP1_KEY = "korail.koTripStep1.v1";

// 샘플 데이터 키
const TICKET_KEY = "korail.ticketReservation.v1";
const HISTORY_KEY = "korail.koTripLastInput.v1";

type Mode = "manual" | "ticket" | "history";

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

const BUDGETS = [
  "0만원 이하",
  "10-19만원",
  "20-29만원",
  "30-39만원",
  "40-49만원",
  "50만원 이상",
] as const;

const INTENSITY = ["여유", "중간", "강행군"] as const;
const PEOPLE = ["2인", "3인", "4인", "5인 이상"] as const;

const MATE_TYPES = [
  "부분 동행",
  "숙박 공유",
  "전체 동행",
  "투어 동행",
  "식사 동행",
  "공동 구매",
  "포토 동행",
  "플랜 동행",
] as const;

type Step1 = {
  startDate: string;
  endDate: string;
  region: string;

  purpose: (typeof PURPOSES)[number] | "";
  budget: (typeof BUDGETS)[number] | "";
  intensity: (typeof INTENSITY)[number] | "";
  people: (typeof PEOPLE)[number] | "";

  mateTypes: (typeof MATE_TYPES)[number][]; // 다중 선택
};

function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

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
        "cursor-pointer h-9 px-4 rounded-full border text-xs",
        active
          ? "border-sky-500 text-sky-600 font-semibold"
          : "text-neutral-500",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function KoTripInfoStep1Page() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("manual");

  const [form, setForm] = useState<Step1>({
    startDate: "",
    endDate: "",
    region: "",
    purpose: "",
    budget: "",
    intensity: "",
    people: "",
    mateTypes: [],
  });

  // 최초 진입 시: 모드 읽고 프리필
  useEffect(() => {
    const m = (localStorage.getItem(KO_TRIP_INFO_MODE_KEY) as Mode) || "manual";
    setMode(m);

    // 1) manual: 그대로 빈값
    if (m === "manual") return;

    // 2) ticket: 기간/지역만 프리필
    if (m === "ticket") {
      const ticket = readJSON<{
        startDate: string;
        endDate: string;
        region: string;
      }>(TICKET_KEY) ?? {
        startDate: "2025-12-14",
        endDate: "2025-12-15",
        region: "부산",
      };

      setForm((prev) => ({
        ...prev,
        startDate: ticket.startDate,
        endDate: ticket.endDate,
        region: ticket.region,
      }));
      return;
    }

    // 3) history: 전체 프리필
    const history =
      readJSON<Step1>(HISTORY_KEY) ??
      ({
        startDate: "2025-12-14",
        endDate: "2025-12-15",
        region: "부산",
        purpose: "관광보다 먹방",
        budget: "20-29만원",
        intensity: "중간",
        people: "2인",
        mateTypes: ["식사 동행", "포토 동행"],
      } satisfies Step1);

    setForm(history);
  }, []);

  const isValid = useMemo(() => {
    return (
      !!form.startDate &&
      !!form.endDate &&
      !!form.region &&
      !!form.purpose &&
      !!form.budget &&
      !!form.intensity &&
      !!form.people &&
      form.mateTypes.length > 0
    );
  }, [form]);

  const toggleMateType = (v: (typeof MATE_TYPES)[number]) => {
    setForm((p) => ({
      ...p,
      mateTypes: p.mateTypes.includes(v)
        ? p.mateTypes.filter((x) => x !== v)
        : [...p.mateTypes, v],
    }));
  };

  const onNext = () => {
    if (!isValid) return;

    writeJSON(KO_TRIP_STEP1_KEY, form);

    // history 모드면 다음에 불러오게 업데이트
    if (mode === "history") {
      writeJSON(HISTORY_KEY, form);
    }

    router.push("/travel/ko-trip/info/step2");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full flex flex-col bg-white">
        {/* 헤더 */}
        <header className="h-14 shrink-0 grid grid-cols-3 items-center px-4 bg-white">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer justify-self-start p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <IconBack />
          </button>
          <div className="justify-self-center font-bold">정보 입력</div>
          <div className="justify-self-end w-6" />
        </header>

        {/* 본문 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          {/* 가운데 SVG */}
          <div className="absolute left-1/2 top-12 -translate-x-1/2">
            <Image
              src="/icons/komate.svg"
              alt="ko mate"
              width={120}
              height={24}
              priority
            />
          </div>

          {/* 이미지처럼: 가운데 정렬 X, 살짝 왼쪽 시작 느낌 */}
          <div className="mt-4">
            <StepProgress total={3} current={2} />
          </div>

          <div className="mt-6 text-sm font-bold">여행 관련 정보</div>

          {/* 여행 기간 */}
          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">여행 기간</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                  className="w-full h-11 rounded-xl border px-3 pr-3 text-sm"
                />
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                  className="w-full h-11 rounded-xl border px-3 pr-3 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 여행 지역 */}
          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">여행 지역</div>
            <select
              value={form.region}
              onChange={(e) =>
                setForm((p) => ({ ...p, region: e.target.value }))
              }
              className="w-full h-11 rounded-xl border px-3 text-sm"
            >
              <option value="">지역 선택</option>
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <option value="대전">대전</option>
              <option value="대구">대구</option>
              <option value="강원">강원</option>
              <option value="제주">제주</option>
            </select>
          </div>

          {/* 여행 목적 (단일) */}
          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">여행 목적</div>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <Chip
                  key={p}
                  active={form.purpose === p}
                  onClick={() => setForm((prev) => ({ ...prev, purpose: p }))}
                >
                  {p}
                </Chip>
              ))}
            </div>
          </div>

          {/* 여행 예산 (단일) */}
          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">여행 예산</div>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <Chip
                  key={b}
                  active={form.budget === b}
                  onClick={() => setForm((p) => ({ ...p, budget: b }))}
                >
                  {b}
                </Chip>
              ))}
            </div>
          </div>

          {/* 여행 일정 강도 (단일) */}
          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">여행 일정 강도</div>
            <div className="flex gap-2 flex-wrap">
              {INTENSITY.map((v) => (
                <Chip
                  key={v}
                  active={form.intensity === v}
                  onClick={() => setForm((p) => ({ ...p, intensity: v }))}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          {/* 동행 인원 (단일) */}
          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">동행 인원</div>
            <div className="flex gap-2 flex-wrap">
              {PEOPLE.map((v) => (
                <Chip
                  key={v}
                  active={form.people === v}
                  onClick={() => setForm((p) => ({ ...p, people: v }))}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          {/* 동행 유형 (다중) */}
          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">동행 유형</div>
            <div className="flex flex-wrap gap-2">
              {MATE_TYPES.map((v) => (
                <Chip
                  key={v}
                  active={form.mateTypes.includes(v)}
                  onClick={() => toggleMateType(v)}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xs text-sky-500 text-center">
            *AI 모집글 생성을 위한 정보를 입력해주세요
          </div>
        </div>

        {/* 하단 버튼 */}
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
            다 음
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
