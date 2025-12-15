"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTravelProfile } from "@/hooks/useTravelProfile";
import type { TravelProfile } from "@/types/profile";
import MobileFrame from "@/components/mobile/MobileFrame";

const FOOD = ["한식", "양식", "일식", "중식", "기타"] as const;
const ETC = ["금연", "금주"] as const;
const WAKE = [
  { key: "morning", label: "아침형" },
  { key: "night", label: "저녁형" },
  { key: "flex", label: "유연함" },
] as const;

const REGION_OPTIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "충북",
  "충남",
  "전남",
  "경북",
  "경남",
  "제주",
  "강원",
  "전북",
] as const;

function cn(...s: Array<string | false | undefined | null>) {
  return s.filter(Boolean).join(" ");
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold text-neutral-600">{children}</div>
  );
}

function ChipButton({
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
      className={cn(
        "h-9 px-4 rounded-full border text-sm transition-colors",
        active
          ? "border-sky-500 text-sky-600 font-semibold bg-sky-50"
          : "border-neutral-200 text-neutral-500 bg-white"
      )}
    >
      {children}
    </button>
  );
}

export default function TravelProfilePage() {
  const router = useRouter();
  const { profile, ready, upsert } = useTravelProfile();

  const initial = useMemo<TravelProfile>(() => {
    if (profile) return profile;
    return {
      name: "",
      nickname: "",
      gender: "",
      birth: "",
      region: "",
      intro: "",
      mbti: "",
      wakeUp: "",
      food: [],
      etc: [],
      avatarSeed: "K",
    };
  }, [profile]);

  const [form, setForm] = useState<TravelProfile>(initial);

  if (!ready) return null;

  const toggleArray = (key: "food" | "etc", value: string) => {
    setForm((prev) => {
      const has = prev[key].includes(value);
      return {
        ...prev,
        [key]: has
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const onSave = () => {
    const seed = (form.nickname || form.name || "K").trim().slice(0, 1) || "K";
    upsert({ ...form, avatarSeed: seed.toUpperCase() });
    router.push("/travel");
  };

  return (
    <MobileFrame showBottomBar={false} showTopBar={false}>
      <div className="h-full flex flex-col bg-white">
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
          <div className="justify-self-center font-bold">여행 프로필 설정</div>
          <div className="justify-self-end w-6" />
        </header>

        {/* 본문 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-6 pb-28">
          {/* 아바타 + 본인인증 */}
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center">
              {/* 간단 아바타(placeholder) */}
              <div className="h-14 w-14 rounded-full bg-neutral-200" />
              {/* 연필 오버레이 */}
              <div className="absolute right-1 bottom-1 h-7 w-7 rounded-full bg-white shadow flex items-center justify-center border border-neutral-100">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M14.06 4.94 17.81 8.69"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <button
              type="button"
              className="mt-3 rounded-full bg-sky-500 px-6 py-2 text-xs font-semibold text-white"
            >
              본인인증
            </button>
          </div>

          {/* 기본 정보 */}
          <h2 className="mt-8 text-base font-bold text-neutral-900">
            기본 정보
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>이름*</Label>
              <input
                className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-sky-400"
                placeholder="Placeholder"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>닉네임*</Label>
              <input
                className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-sky-400"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* 성별 */}
            <div className="space-y-2">
              <Label>성별*</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={cn(
                    "h-12 rounded-xl border text-sm",
                    form.gender === "M"
                      ? "border-sky-500 text-sky-600 font-semibold bg-sky-50"
                      : "border-neutral-200 text-neutral-500 bg-white"
                  )}
                  onClick={() => setForm({ ...form, gender: "M" })}
                >
                  남성
                </button>
                <button
                  type="button"
                  className={cn(
                    "h-12 rounded-xl border text-sm",
                    form.gender === "F"
                      ? "border-sky-500 text-sky-600 font-semibold bg-sky-50"
                      : "border-neutral-200 text-neutral-500 bg-white"
                  )}
                  onClick={() => setForm({ ...form, gender: "F" })}
                >
                  여성
                </button>
              </div>
            </div>

            {/* 생년월일 */}
            <div className="space-y-2">
              <Label>생년월일*</Label>
              <div className="relative">
                <input
                  type="date"
                  className="h-12 w-full rounded-xl border border-neutral-200 px-4 pr-12 text-sm outline-none focus:border-sky-400"
                  value={form.birth}
                  onChange={(e) => setForm({ ...form, birth: e.target.value })}
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 3v2M17 3v2M4 8h16M6 12h4M6 16h4M14 12h4M14 16h4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 거주 지역 */}
          <div className="mt-4 space-y-2">
            <Label>거주 지역*</Label>
            <div className="relative">
              <select
                className="h-12 w-full appearance-none rounded-xl border border-neutral-200 px-4 pr-10 text-sm text-neutral-700 outline-none focus:border-sky-400 bg-white"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                <option value="">지역 선택</option>
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 소개글 */}
          <div className="mt-4 space-y-2">
            <Label>소개글 ({form.intro.length}/150)</Label>
            <textarea
              className="h-28 w-full rounded-xl border border-neutral-200 p-4 text-sm outline-none focus:border-sky-400 resize-none"
              value={form.intro}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
              maxLength={150}
            />
          </div>

          {/* 성향 및 선호도 */}
          <h2 className="mt-10 text-base font-bold text-neutral-900">
            성향 및 선호도
          </h2>

          {/* MBTI */}
          <div className="mt-4 space-y-2">
            <Label>MBTI</Label>
            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-sky-400"
              value={form.mbti}
              onChange={(e) => setForm({ ...form, mbti: e.target.value })}
            />
          </div>

          {/* 기상 시간 */}
          <div className="mt-6 space-y-2">
            <Label>기상 시간</Label>
            <div className="flex gap-2">
              {WAKE.map((w) => (
                <ChipButton
                  key={w.key}
                  active={form.wakeUp === w.key}
                  onClick={() => setForm({ ...form, wakeUp: w.key })}
                >
                  {w.label}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* 음식 취향 */}
          <div className="mt-6 space-y-2">
            <Label>음식 취향</Label>
            <div className="flex flex-wrap gap-2">
              {FOOD.map((f) => (
                <ChipButton
                  key={f}
                  active={form.food.includes(f)}
                  onClick={() => toggleArray("food", f)}
                >
                  {f}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* 기타 사항 */}
          <div className="mt-6 space-y-2">
            <Label>기타 사항</Label>
            <div className="flex gap-2">
              {ETC.map((x) => (
                <ChipButton
                  key={x}
                  active={form.etc.includes(x)}
                  onClick={() => toggleArray("etc", x)}
                >
                  {x}
                </ChipButton>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 저장 버튼(스크린샷처럼 크게 고정) */}
        <div className="shrink-0 bg-white px-5 pb-5 pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.10)]">
          <button
            type="button"
            onClick={onSave}
            className="cursor-pointer w-full h-14 rounded-2xl bg-sky-500 text-white font-bold text-base"
          >
            저장
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
