import { RecommendState } from "@/types/recommend";
import { create } from "zustand";

export const useRecommendStore = create<RecommendState>((set) => ({
  input: null,
  setInput: (v) => set({ input: v }),

  itinerary: [],
  matchedPackages: [],
  setItinerary: (days) => set({ itinerary: days }),
  setMatchedPackages: (items) => set({ matchedPackages: items }),

  reset: () => set({ input: null, itinerary: [], matchedPackages: [] }),
}));
