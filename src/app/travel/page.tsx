"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTravelProfile } from "@/hooks/useTravelProfile";
import MobileFrame from "@/components/mobile/MobileFrame";
import MateRequirementModal from "@/components/travel/MateRequirementModal";
import { TravelProfile } from "@/types/profile";

// mock 상태(나중에 API/스토어로 교체)
const PURCHASE_KEY = "korail.purchaseHistory.v1";
const CERT_KEY = "korail.certified.v1";

function getBool(key: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

function Avatar({ seed }: { seed: string }) {
  const initials = seed?.slice(0, 1).toUpperCase() || "";
  return (
    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-700">
      {initials}
    </div>
  );
}

export default function TravelPage() {
  const router = useRouter();
  const { profile, ready } = useTravelProfile();

  const [openReq, setOpenReq] = useState(false);
  const seed = (profile as TravelProfile | null)?.avatarSeed ?? "";

  if (!ready) return null;

  // 타입 좁히기: profile이 있으면 true
  const hasProfile = profile !== null;
  const profileOk = hasProfile;

  const openModal = () => {
    setOpenReq(true);
  };

  return (
    <MobileFrame>
      <MateRequirementModal
        open={openReq}
        onClose={() => setOpenReq(false)}
        profileOk={profileOk}
        onConfirm={() => router.push("/travel/recommend/input")}
      />

      <div className="bg-white">
        <section className="relative h-56">
          <Image
            src="/images/travel-hero.jpg"
            alt="travel hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute left-5 top-14 text-white">
            <div className="text-3xl font-black leading-tight">
              Explore the
              <br />
              korail today
            </div>
            <div className="mt-2 text-sm opacity-90">
              {hasProfile
                ? "코레일과 함께 여행을 즐겨보세요!"
                : "여행 프로필을 먼저 설정해주세요."}
            </div>
          </div>

          <div className="absolute right-4 top-14 flex flex-col items-center gap-2">
            {/* 아바타/이미지 분기 */}
            <div>
              {hasProfile ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/40">
                  <Image
                    src="/images/profile.png"
                    alt="profile"
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <Avatar seed={seed} />
              )}
            </div>

            <button
              type="button"
              onClick={() => router.push("/travel/profile")}
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              {hasProfile ? "여행 프로필 수정" : "여행 프로필 만들기"}
            </button>
          </div>
        </section>

        <section className="px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">
                혼자 여행은 좋지만, 혼밥은 싫다면 ?
              </div>
              <div className="text-lg font-black">여행 메이트 구하기</div>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              여행 메이트 구하기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-40 rounded-2xl bg-neutral-200" />
            <div className="h-40 rounded-2xl bg-neutral-200 border-2 border-purple-500" />
          </div>
        </section>

        <section className="px-5 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black">
              당신에게 딱 맞는
              <br />
              국내 여행지 코스를 추천받아 보세요
            </div>
            <button
              onClick={openModal}
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              맞춤 일정 추천받기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-40 rounded-2xl bg-neutral-200 flex items-end p-3 font-bold">
              Seoul
            </div>
            <div className="h-40 rounded-2xl bg-neutral-200 flex items-end p-3 font-bold">
              Daejeon
            </div>
          </div>
        </section>
      </div>
    </MobileFrame>
  );
}
