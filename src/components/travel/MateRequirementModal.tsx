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
  purchaseOk: boolean;
  certifiedOk: boolean;
  profileOk: boolean;

  onGoPurchase: () => void;
  onGoVerify: () => void;
  onGoProfile: () => void;

  onConfirm: () => void;
}

export default function MateRequirementModal({
  open,
  onClose,
  purchaseOk,
  certifiedOk,
  profileOk,
  onGoPurchase,
  onGoVerify,
  onGoProfile,
  onConfirm,
}: Props) {
  const allDone = purchaseOk && certifiedOk && profileOk;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mt-6 flex items-center justify-center text-sm">
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
