"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTravelProfile } from "@/hooks/useTravelProfile";
import MobileFrame from "@/components/mobile/MobileFrame";
import MateRequirementModal from "@/components/travel/MateRequirementModal";
import { TravelProfile } from "@/types/profile";
import RegionCarousel from "@/components/travel/RegionCarousel";

function Avatar({ seed }: { seed: string }) {
  const initials = seed?.slice(0, 1).toUpperCase() || "";
  return (
    <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-700">
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

  const hasProfile = profile !== null;
  const profileOk = hasProfile;

  // 프로필 없으면 모달 / 있으면 원하는 곳으로 이동
  const openModalOrGo = (whenHasProfile: () => void) => {
    if (profileOk) {
      whenHasProfile();
      return;
    }
    setOpenReq(true);
  };

  return (
    <MobileFrame>
      {/* 프로필 없을 때만 의미 있는 모달 */}
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
            <div className="h-16">
              {hasProfile ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/40">
                  <Image
                    src="/images/profile.png"
                    alt="profile"
                    fill
                    sizes="40px"
                    className="object-contain"
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

        <section className="px-5 py-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black">
              당신에게 딱 맞는
              <br />
              국내 여행지 코스를 추천받아 보세요
            </div>

            {/* ko-trip: 프로필 없으면 모달 / 있으면 /travel/ko-trip */}
            <button
              type="button"
              onClick={() =>
                openModalOrGo(() => router.push("/travel/ko-trip"))
              }
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              ko-trip 시작하기
            </button>
          </div>

          <div className="mt-4">
            <RegionCarousel
              slides={[
                { src: "/images/seoul.png", label: "Seoul" },
                { src: "/images/daejeon.png", label: "Daejeon" },
                { src: "/images/busan.png", label: "Busan" },
                { src: "/images/daegu.png", label: "Daegu" },
                { src: "/images/gangwon.png", label: "Gangwon" },
                { src: "/images/jeju.png", label: "Jeju" },
              ]}
              height={190}
              slideBasis={0.95}
            />
          </div>
        </section>

        <section className="px-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">
                혼자 여행은 좋지만, 혼밥은 싫다면 ?
              </div>
              <div className="text-lg font-black">여행 메이트 구하기</div>
            </div>

            {/* ✅ ko-mate: 프로필 없으면 모달 / 있으면 /travel/recommend/input */}
            <button
              type="button"
              onClick={() =>
                openModalOrGo(() => router.push("/travel/recommend/input"))
              }
              className="cursor-pointer rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-900 shadow"
            >
              ko-mate 시작하기
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-40 rounded-2xl bg-neutral-200" />
            <div className="h-40 rounded-2xl bg-neutral-200 border-2 border-purple-500" />
          </div>
        </section>
      </div>
    </MobileFrame>
  );
}
