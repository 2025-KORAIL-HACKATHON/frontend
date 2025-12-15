"use client";

import Modal from "@/components/common/Modal";

function RequirementRow({
  icon,
  titleKo,
  titleEn,
  done,
  onClick,
}: {
  icon: React.ReactNode;
  titleKo: string;
  titleEn: string;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "cursor-pointer w-full text-left flex items-center gap-4 rounded-2xl border p-4",
        done
          ? "border-emerald-400 bg-emerald-50"
          : "border-rose-300 bg-rose-50",
      ].join(" ")}
    >
      <div
        className={[
          "h-10 w-10 rounded-xl flex items-center justify-center text-xl",
          done ? "text-emerald-600" : "text-rose-500",
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="flex flex-col">
        <div className="font-bold text-neutral-900">{titleKo}</div>
        <div className="text-sm text-neutral-500">{titleEn}</div>
      </div>

      <span
        className={[
          "ml-auto text-xs font-bold px-2 py-1 rounded-full",
          done ? "bg-emerald-600 text-white" : "bg-rose-500 text-white",
        ].join(" ")}
      >
        {done ? "완료" : "필수"}
      </span>
    </button>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  profileOk: boolean;

  onGoPurchase: () => void;
  onGoVerify: () => void;
  onGoProfile: () => void;

  onConfirm: () => void;
}

export default function MateRequirementModal({
  open,
  onClose,
  profileOk,
  onGoPurchase,
  onGoVerify,
  onGoProfile,
  onConfirm,
}: Props) {
  const allDone = profileOk;

  const InfoIcon = ({ done }: { done: boolean }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={done ? "text-emerald-600" : "text-rose-500"}
      aria-hidden="true"
    >
      {/* circle */}
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* check or ! */}
      {done ? (
        <path
          d="M7.5 12.2l2.7 2.7 6.3-6.3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <path
            d="M12 7v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 17h.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <InfoIcon done={allDone} />
        <span className="font-semibold">
          {allDone
            ? "모든 단계를 완료하셨습니다!"
            : "아직 여행 프로필을 생성하지 않았습니다!"}
        </span>
      </div>

      <button
        type="button"
        disabled={!allDone}
        onClick={() => {
          if (!allDone) return;
          onClose();
          onConfirm();
        }}
        className={[
          "cursor-pointer mt-6 w-full h-12 rounded-full font-bold",
          allDone
            ? "bg-black text-white"
            : "bg-neutral-200 text-neutral-500 cursor-not-allowed",
        ].join(" ")}
      >
        확인
      </button>
    </Modal>
  );
}
