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
}: Props) {
  const allDone = purchaseOk && certifiedOk && profileOk;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-2xl font-black leading-snug">
        What is essential
        <br />
        for 여행메이트 ...
      </div>

      <div className="mt-6 space-y-3">
        <RequirementRow
          icon="📍"
          titleKo="승차권 구매 이력"
          titleEn="Purchase History"
          done={purchaseOk}
          onClick={onGoPurchase}
        />
        <RequirementRow
          icon="🔳"
          titleKo="본인인증 완료자"
          titleEn="Certified user"
          done={certifiedOk}
          onClick={onGoVerify}
        />
        <RequirementRow
          icon="👤"
          titleKo="여행 프로필 생성"
          titleEn="Create Profile"
          done={profileOk}
          onClick={onGoProfile}
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <span className="font-semibold">
          {allDone
            ? "모든 단계를 완료하셨습니다!"
            : "필수 단계를 완료해주세요!"}
        </span>
      </div>

      <button
        type="button"
        disabled={!allDone}
        onClick={onClose}
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
