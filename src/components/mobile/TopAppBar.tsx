"use client";

import useAppStore from "@/stores/appStore";

const TopAppBar = () => {
  const { lang, toggleLang } = useAppStore();
  return (
    <header className="h-14 bg-[#0B3A5B] text-white flex items-center px-4 justify-between">
      <button className="p-2 -ml-2" aria-label="chat">
        <span className="text-xl">💬</span>
      </button>

      <div className="font-bold tracking-wide">KORAIL</div>

      <div className="flex items-center gap-2">
        <button className="p-2" aria-label="menu">
          <span className="text-xl">☰</span>
        </button>
      </div>
    </header>
  );
};
export default TopAppBar;
