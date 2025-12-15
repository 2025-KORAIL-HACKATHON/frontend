"use client";

export default function StepProgress({
  total = 3,
  current = 1, // 1부터 시작
}: {
  total?: number;
  current: number;
}) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="mt-6 flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold">
        {steps.map((s) => (
          <span
            key={s}
            className={[
              "h-6 w-6 rounded-full inline-flex items-center justify-center",
              s === current ? "bg-white shadow" : "text-neutral-700",
            ].join(" ")}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
