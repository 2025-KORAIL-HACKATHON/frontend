"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { mockPosts } from "@/lib/koTripMock";
import Image from "next/image";

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

export default function MatchedPage() {
  const router = useRouter();
  const params = useParams();

  // postId 안전하게 파싱
  const postIdRaw = (params as { postId?: string | string[] })?.postId;
  const postId = Array.isArray(postIdRaw) ? postIdRaw[0] : postIdRaw;

  // post 찾아서 작성자 닉네임 가져오기
  const post = useMemo(() => {
    if (!postId) return mockPosts[0];
    return mockPosts.find((p) => p.id === postId) ?? mockPosts[0];
  }, [postId]);

  const authorName = post.nickname || "상대방";

  // 상세페이지와 동일한 규칙으로 썸네일(원하면 사용)
  const thumb =
    post.purposeImages?.[Number(post.id) % (post.purposeImages?.length ?? 1)];

  // 매칭 완료 페이지 chips도 post 기반으로
  const chips = useMemo(() => {
    const arr: string[] = [];
    arr.push(`${post.start} ~ ${post.end} ${post.daysText}`);
    arr.push("2명 모집");
    arr.push("중간");
    arr.push("인당 30만원대");
    arr.push("여행 목적");
    return arr;
  }, [post]);

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white">
        <header className="px-4 pt-3 pb-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <IconBack />
            </button>
            <div className="font-black">매칭 완료</div>
            <div className="w-10" />
          </div>
        </header>

        <div className="px-6 py-10">
          <div className="rounded-2xl shadow bg-white p-8 flex flex-col items-center">
            {/* 상단 아이콘 */}
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full bg-neutral-200 overflow-hidden">
                <Image
                  src="/images/profile.png"
                  alt="나"
                  fill
                  className="object-contain p-3"
                />
              </div>

              <div className="relative h-10 w-10 rounded-full bg-sky-200 overflow-hidden">
                <Image
                  src="/icons/connect.svg"
                  alt="매칭"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="relative h-16 w-16 rounded-full bg-neutral-200 overflow-hidden">
                <Image
                  src="/images/profile.png"
                  alt="상대"
                  fill
                  className="object-contain p-3"
                />
              </div>
            </div>

            {/* 여기! 작성자 닉네임 기반 문구 */}
            <div className="mt-6 text-center font-black text-lg">
              {authorName} 님과
              <br />
              매칭이 완료되었습니다.
            </div>

            {/* (선택) 매칭된 모집글 요약 */}
            <div className="mt-3 text-xs text-neutral-600 text-center">
              {post.title}
            </div>

            {/* chips */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {chips.map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="px-3 py-1 rounded-md shadow text-xs text-neutral-700 bg-white"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* 안전 팁 */}
            <div className="mt-6 w-full rounded-2xl shadow p-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center">
                  🛡️
                </div>
                <div className="text-sm text-sky-700 font-bold">
                  안전한 여행을 위한 팁
                </div>
              </div>
              <ul className="mt-2 text-xs text-sky-700 list-disc pl-6 space-y-1">
                <li>첫 만남은 공공장소에서 하세요.</li>
                <li>개인정보는 신중하게 공유하세요.</li>
                <li>여행 일정을 가족/친구와 공유하세요.</li>
              </ul>
            </div>

            {/* 채팅으로 이동 */}
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/travel/chat/room-${
                    post.id
                  }?otherUsername=${encodeURIComponent(authorName)}`
                )
              }
              className="cursor-pointer mt-6 w-full h-12 rounded-2xl bg-sky-500 text-white font-black"
            >
              채팅으로 이동
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
