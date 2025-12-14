export default function MobileFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-neutral-100 flex justify-center">
      <div className="w-full max-w-107.5 min-h-dvh bg-white shadow-sm">
        {children}
      </div>
    </div>
  );
}
