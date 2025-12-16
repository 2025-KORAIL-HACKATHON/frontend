"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import type { TripPost } from "@/lib/koTripMock";
import { mockPosts } from "@/lib/koTripMock";

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

function ProfileModal({
  open,
  onClose,
  post,
}: {
  open: boolean;
  onClose: () => void;
  post: TripPost;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-neutral-200 overflow-hidden" />
              <div>
                <div className="font-black">{post.nickname}</div>
                <div className="text-xs text-neutral-500">
                  {post.ageGroup} | {post.gender}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full hover:bg-neutral-100 flex items-center justify-center"
              aria-label="닫기"
              type="button"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-2 text-sm">
            <div className="inline-flex items-center gap-2">
              <span className="h-6 px-3 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center">
                본인인증 완료 사용자
              </span>
            </div>
            <div className="text-xs text-neutral-700">
              최근 3회 동행 이력 존재
            </div>

            <div className="mt-3 rounded-xl border p-3 text-xs text-neutral-600">
              {post.desc}
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {["#아침형", "#한식", "#enfp", "#금연"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-neutral-100 text-xs text-neutral-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KoTripDetailPage() {
  const router = useRouter();
  const params = useParams();

  const postIdRaw = (params as { postId?: string | string[] })?.postId;
  const postId = Array.isArray(postIdRaw) ? postIdRaw[0] : postIdRaw;

  const post = useMemo(() => {
    if (!postId) return mockPosts[0];
    return mockPosts.find((p) => p.id === postId) ?? mockPosts[0];
  }, [postId]);

  const [openProfile, setOpenProfile] = useState(false);

  // 목록 페이지와 동일한 썸네일 규칙
  const thumb =
    post.purposeImages?.[Number(post.id) % (post.purposeImages?.length ?? 1)];

  const chips = useMemo(() => {
    const arr: string[] = [];
    arr.push(`${post.start} ~ ${post.end} ${post.daysText}`);
    arr.push("2명 모집"); // 더미
    arr.push("중간"); // 더미
    arr.push("인당 30만원대"); // 더미
    // purposeImages가 9장이라면 "목적 3개" 같은 더미도 가능
    arr.push("여행 목적"); // 더미
    return arr;
  }, [post]);

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <ProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        post={post}
      />

      <div className="h-full bg-white flex flex-col">
        <header className="shrink-0 px-4 pt-3 pb-3 bg-white">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <IconBack />
            </button>
            <div className="font-black">상세</div>
            <div className="w-10" />
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5">
          {/* 상단 이미지 */}
          <div className="relative h-44 rounded-2xl bg-neutral-200 overflow-hidden">
            {thumb ? (
              <Image
                src={thumb}
                alt="여행 목적 이미지"
                fill
                sizes="(max-width: 480px) 92vw, 520px"
                className="object-cover"
                priority
              />
            ) : null}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* 제목/설명 */}
          <div className="mt-4 text-2xl font-black">{post.title}</div>
          <div className="mt-2 text-sm text-neutral-700">{post.desc}</div>

          {/* 기간 */}
          <div className="mt-3 flex items-center gap-2 text-sm text-neutral-700">
            <span className="h-2 w-2 rounded-full bg-neutral-800" />
            <span>
              {post.start} ~ {post.end} {post.daysText}
            </span>
          </div>

          {/* chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="px-3 py-1 rounded-md shadow text-xs text-neutral-700 bg-white"
              >
                {c}
              </span>
            ))}
          </div>

          {/* 매칭 점수 */}
          <div className="mt-6">
            <div className="font-black mb-2">매칭 점수</div>
            <div className="flex flex-col gap-2">
              {["여행 상품 1건 동일", "여행 취향 3건 동일"].map((t) => (
                <div
                  key={t}
                  className="h-10 rounded-xl shadow px-3 flex items-center gap-2 text-sm"
                >
                  <span className="h-5 w-5 rounded-full bg-neutral-200" />
                  <span className="flex-1">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="font-black mb-2">동행자 관련 정보</div>
            <div className="rounded-xl shadow p-4 text-sm text-neutral-600">
              동행자 조건/취향 요약이 들어갑니다.
            </div>
          </div>

          {/* 작성자 */}
          <div className="mt-6">
            <div className="font-black mb-2">작성자 관련 정보</div>
            <button
              type="button"
              onClick={() => setOpenProfile(true)}
              className="w-full rounded-xl cursor-pointer p-4 flex gap-4 items-center text-left"
            >
              <div className="h-14 w-14 rounded-full bg-neutral-200 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-neutral-500">
                  {post.nickname} | {post.ageGroup} | {post.gender}
                </div>
                <div className="mt-1 text-sm text-neutral-700 line-clamp-2">
                  {post.desc}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="shrink-0 px-5 py-4 bg-white flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer flex-1 h-12 rounded-2xl bg-neutral-100 text-neutral-600 font-bold"
          >
            뒤로가기
          </button>
          <button
            type="button"
            onClick={() => router.push(`/travel/ko-trip/${post.id}/matched`)}
            className="cursor-pointer flex-1 h-12 rounded-2xl bg-sky-500 text-white font-black"
          >
            매칭 신청하기
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
