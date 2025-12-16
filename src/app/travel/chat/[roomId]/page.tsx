"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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

function pickReply(userText: string) {
  const t = userText.trim();
  if (/안녕|하이|반가/i.test(t)) return "안녕하세요! 😊";
  if (/가능|되나요|되요|돼요|괜찮/i.test(t))
    return "네 가능해요! 일정만 맞춰보면 좋을 것 같아요.";
  if (/시간|언제|몇시|날짜/i.test(t))
    return "저는 그 날짜 괜찮아요! 몇 시쯤 만나면 좋을까요?";
  if (/장소|어디|역|만나/i.test(t))
    return "저는 역 근처에서 만나도 좋아요. 편한 곳 있으세요?";
  if (/감사|고마/i.test(t)) return "저도 감사합니다 :)";

  const pool = [
    "좋아요! 자세히 얘기해볼까요?",
    "오케이 👍 그럼 계획 조금 더 공유해주실래요?",
    "저도 그 코스 관심 있었어요!",
    "그럼 채팅으로 일정 조율해봐요 🙂",
    "완전 좋네요. 저는 무리 없는 일정 선호해요!",
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const searchParams = useSearchParams();
  const otherUsername = searchParams.get("otherUsername")?.trim() || "닉네임";

  // 헤더 타이틀
  const title = useMemo(() => otherUsername, [otherUsername]);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // IME 조합 상태 추적 (중요)
  const isComposingRef = useRef(false);

  // 상대방 자동응답 타이머 정리용
  const replyTimerRef = useRef<number | null>(null);

  const previewPost = mockPosts[0];

  useEffect(() => {
    const existing = loadChat(roomId);
    setMsgs(existing);
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current != null) {
        window.clearTimeout(replyTimerRef.current);
        replyTimerRef.current = null;
      }
    };
  }, []);

  const send = () => {
    const t = text.trim();
    if (!t) return;

    const myMsg: ChatMessage = {
      id: crypto.randomUUID(),
      roomId,
      from: "me",
      text: t,
      ts: Date.now(),
    };

    const afterMy = [...msgs, myMsg];
    setMsgs(afterMy);
    saveChat(roomId, afterMy);

    // 먼저 비우기
    setText("");

    // 2) 상대방 자동 답장
    const delay = 800 + Math.floor(Math.random() * 800);
    if (replyTimerRef.current != null)
      window.clearTimeout(replyTimerRef.current);

    replyTimerRef.current = window.setTimeout(() => {
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        roomId,
        from: "other",
        text: pickReply(t),
        ts: Date.now(),
      };

      setMsgs((prev) => {
        const next = [...prev, reply];
        saveChat(roomId, next);
        return next;
      });

      replyTimerRef.current = null;
    }, delay);
  };

  return (
    <MobileFrame showTopBar={false} showBottomBar={false}>
      <div className="h-full bg-white flex flex-col">
        {/* 헤더 */}
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
                <button
                  type="button"
                  className="h-8 px-3 rounded-md border text-xs"
                >
                  동행 신청하기
                </button>
                <button
                  type="button"
                  className="h-8 px-3 rounded-md border text-xs"
                >
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
              // ✅ IME 조합 시작/끝 추적
              onCompositionStart={() => {
                isComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                isComposingRef.current = false;
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;

                // ✅ 조합 중 Enter는 "확정" 용도라 전송 금지
                if (isComposingRef.current) return;

                e.preventDefault();
                send();
              }}
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
