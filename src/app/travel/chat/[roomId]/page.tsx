"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileFrame from "@/components/mobile/MobileFrame";
import { loadChat, saveChat, ChatMessage } from "@/lib/koTripStorage";
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

function IconSend() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 2 11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2 15 22l-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;

  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const title = useMemo(
    () => (roomId === "room-traction" ? "트랙션 팀원" : "닉네임"),
    [roomId]
  );

  // 상단에 보여줄 “모집글 미리보기” 카드(간단 더미)
  const previewPost = mockPosts[0];

  useEffect(() => {
    const existing = loadChat(roomId);
    // 채팅이 한 번도 없으면 예시 대화 넣기
    if (existing.length === 0) {
      const seed: ChatMessage[] = [
        {
          id: "m1",
          roomId,
          from: "other",
          text: "안녕하세요!",
          ts: Date.now() - 1000 * 60 * 60,
        },
        {
          id: "m2",
          roomId,
          from: "me",
          text: "네 안녕하세요 :)",
          ts: Date.now() - 1000 * 60 * 50,
        },
      ];
      saveChat(roomId, seed);
      setMsgs(seed);
      return;
    }
    setMsgs(existing);
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const send = () => {
    const t = text.trim();
    if (!t) return;

    const next: ChatMessage[] = [
      ...msgs,
      { id: crypto.randomUUID(), roomId, from: "me", text: t, ts: Date.now() },
    ];
    setMsgs(next);
    saveChat(roomId, next);
    setText("");
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white flex flex-col">
        {/* 헤더 */}
        <header className="shrink-0 px-4 pt-3 pb-3  bg-white">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="cursor-pointer p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <IconBack />
            </button>
            <div className="font-black">{title}</div>
            <div className="w-10" />
          </div>
        </header>

        {/* 상단 모집글 요약 */}
        <div className="shrink-0 px-4 py-3 border-b border-gray-300 bg-white">
          <div className="flex gap-3">
            <div className="h-14 w-14 rounded-lg bg-neutral-200 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm">{previewPost.title}</div>
              <div className="text-xs text-neutral-600 line-clamp-1">
                {previewPost.desc}
              </div>
              <div className="mt-2 flex gap-2">
                <button className="h-8 px-3 rounded-md border text-xs">
                  동행 신청하기
                </button>
                <button className="h-8 px-3 rounded-md border text-xs">
                  모집글 확인하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-neutral-50 px-4 py-4">
          <div className="flex flex-col gap-3">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={
                  m.from === "me" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={[
                    "max-w-[72%] rounded-2xl px-4 py-3 text-sm",
                    m.from === "me"
                      ? "bg-sky-400 text-white"
                      : "bg-white text-neutral-900",
                  ].join(" ")}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* 입력창 */}
        <div className="shrink-0 px-4 py-3 bg-white border-t">
          <div className="flex items-center gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="메시지 보내기"
              className="flex-1 h-11 rounded-full bg-neutral-100 px-4 text-sm outline-none"
            />
            <button
              type="button"
              onClick={send}
              className="h-11 w-11 rounded-full bg-white border flex items-center justify-center"
              aria-label="전송"
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
