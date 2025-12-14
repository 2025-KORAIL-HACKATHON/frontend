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
    <MobileFrame>
      {/* 페이지 내부에서 "헤더 고정 + 본문만 스크롤" */}
      <div className="h-full flex flex-col bg-white">
        {/* 고정 헤더 */}
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b bg-white">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm"
          >
            ←
          </button>
          <div className="font-bold">여행 프로필 설정</div>
        </header>

        {/* 본문만 스크롤 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4">
          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-neutral-200" />
            <button
              type="button"
              className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white"
            >
              본인인증
            </button>
          </div>

          <h2 className="mt-8 text-sm font-bold">기본 정보</h2>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              className="h-11 rounded-xl border px-3"
              placeholder="이름*"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="h-11 rounded-xl border px-3"
              placeholder="닉네임*"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                className={`h-11 flex-1 rounded-xl border ${
                  form.gender === "M"
                    ? "border-sky-500 text-sky-600 font-semibold"
                    : ""
                }`}
                onClick={() => setForm({ ...form, gender: "M" })}
              >
                남성
              </button>
              <button
                type="button"
                className={`h-11 flex-1 rounded-xl border ${
                  form.gender === "F"
                    ? "border-sky-500 text-sky-600 font-semibold"
                    : ""
                }`}
                onClick={() => setForm({ ...form, gender: "F" })}
              >
                여성
              </button>
            </div>

            <input
              type="date"
              className="h-11 rounded-xl border px-3"
              value={form.birth}
              onChange={(e) => setForm({ ...form, birth: e.target.value })}
            />
          </div>

          <input
            className="mt-3 h-11 w-full rounded-xl border px-3"
            placeholder="거주 지역* (예: 서울/부산)"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />

          <textarea
            className="mt-3 h-28 w-full rounded-xl border p-3"
            placeholder="소개글 (0/150)"
            value={form.intro}
            onChange={(e) => setForm({ ...form, intro: e.target.value })}
            maxLength={150}
          />

          <h2 className="mt-8 text-sm font-bold">성향 및 선호도</h2>

          <input
            className="mt-3 h-11 w-full rounded-xl border px-3"
            placeholder="MBTI"
            value={form.mbti}
            onChange={(e) => setForm({ ...form, mbti: e.target.value })}
          />

          <div className="mt-4">
            <div className="text-xs font-semibold text-neutral-700">
              기상 시간
            </div>
            <div className="mt-2 flex gap-2">
              {WAKE.map((w) => (
                <button
                  key={w.key}
                  type="button"
                  className={`h-10 rounded-full border px-4 text-sm ${
                    form.wakeUp === w.key
                      ? "border-sky-500 text-sky-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => setForm({ ...form, wakeUp: w.key })}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-semibold text-neutral-700">
              음식 취향
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {FOOD.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`h-10 rounded-full border px-4 text-sm ${
                    form.food.includes(f)
                      ? "border-sky-500 text-sky-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => toggleArray("food", f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-semibold text-neutral-700">
              기타 사항
            </div>
            <div className="mt-2 flex gap-2">
              {ETC.map((x) => (
                <button
                  key={x}
                  type="button"
                  className={`h-10 rounded-full border px-4 text-sm ${
                    form.etc.includes(x)
                      ? "border-sky-500 text-sky-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => toggleArray("etc", x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          {/* 본문 스크롤 안에서 하단 고정(sticky) */}
          <div className="sticky bottom-0 -mx-5 z-10 bg-white pt-3 pb-4 border-t shadow-[0_-6px_18px_rgba(0,0,0,0.06)]">
            <div className="px-5">
              <button
                type="button"
                onClick={onSave}
                className="w-full h-12 rounded-xl bg-sky-500 text-white font-bold"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
