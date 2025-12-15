"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import StepProgress from "@/components/travel/StepProgress";

const KO_TRIP_STEP2_KEY = "korail.koTripStep2.v1";

const GENDER = ["무관", "남성", "여성"] as const;
const AGE = ["무관", "20대", "30대", "40대", "50대 이상"] as const;
const WAKE = ["아침형", "저녁형", "유연함"] as const;
const FOOD = ["한식", "양식", "일식", "중식", "기타"] as const;
const ETC = ["금연", "금주"] as const;

type Step2 = {
  gender: (typeof GENDER)[number] | "";
  age: (typeof AGE)[number] | "";
  mbti: string;
  wake: (typeof WAKE)[number] | "";
  food: (typeof FOOD)[number] | "";
  etc: (typeof ETC)[number][]; // 다중
};

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

export default function KoTripInfoStep2Page() {
  const router = useRouter();

  const [form, setForm] = useState<Step2>({
    gender: "",
    age: "",
    mbti: "",
    wake: "",
    food: "",
    etc: [],
  });

  const isValid = useMemo(() => {
    return (
      !!form.gender && !!form.age && !!form.mbti && !!form.wake && !!form.food
    );
  }, [form]);

  const toggleEtc = (v: (typeof ETC)[number]) => {
    setForm((p) => ({
      ...p,
      etc: p.etc.includes(v) ? p.etc.filter((x) => x !== v) : [...p.etc, v],
    }));
  };

  const onNext = () => {
    if (!isValid) return;
    writeJSON(KO_TRIP_STEP2_KEY, form);
    router.push("/travel/ko-trip/info/loading");
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
          <StepProgress total={3} current={3} />
          <div className="mt-6 text-sm font-bold">동행자 관련 정보</div>

          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">성별</div>
            <div className="flex gap-2 flex-wrap">
              {GENDER.map((v) => (
                <Chip
                  key={v}
                  active={form.gender === v}
                  onClick={() => setForm((p) => ({ ...p, gender: v }))}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">연령대</div>
            <div className="flex gap-2 flex-wrap">
              {AGE.map((v) => (
                <Chip
                  key={v}
                  active={form.age === v}
                  onClick={() => setForm((p) => ({ ...p, age: v }))}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">MBTI</div>
            <input
              value={form.mbti}
              onChange={(e) => setForm((p) => ({ ...p, mbti: e.target.value }))}
              className="w-full h-11 rounded-xl border px-3 text-sm"
              placeholder="예: ENFP"
            />
          </div>

          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">기상 시간</div>
            <div className="flex gap-2 flex-wrap">
              {WAKE.map((v) => (
                <Chip
                  key={v}
                  active={form.wake === v}
                  onClick={() => setForm((p) => ({ ...p, wake: v }))}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">음식 취향</div>
            <div className="flex gap-2 flex-wrap">
              {FOOD.map((v) => (
                <Chip
                  key={v}
                  active={form.food === v}
                  onClick={() => setForm((p) => ({ ...p, food: v }))}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-neutral-500 mb-2">기타 사항</div>
            <div className="flex gap-2 flex-wrap">
              {ETC.map((v) => (
                <Chip
                  key={v}
                  active={form.etc.includes(v)}
                  onClick={() => toggleEtc(v)}
                >
                  {v}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 bg-white px-5 py-4 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-1/2 h-12 rounded-2xl bg-neutral-200 text-neutral-700 font-bold cursor-pointer"
          >
            이전
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={onNext}
            className={[
              "w-1/2 h-12 rounded-2xl font-bold",
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
