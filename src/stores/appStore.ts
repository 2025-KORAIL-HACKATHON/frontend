import { create } from "zustand";
export type TabKey = "home" | "benefit" | "travel" | "myticket";

interface AppState {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
  lang: "KO" | "EN";
  toggleLang: () => void;
}

const useAppStore = create<AppState>((set) => ({
  tab: "travel",
  setTab: (tab) => set({ tab }),
  lang: "KO",
  toggleLang: () => set((s) => ({ lang: s.lang === "KO" ? "EN" : "KO" })),
}));
export default useAppStore;
