"use client";

import { useEffect, useState } from "react";
import {
  loadTravelProfile,
  saveTravelProfile,
} from "@/lib/travelProfileStorage";
import { TravelProfile } from "@/types/profile";

export function useTravelProfile() {
  const [profile, setProfile] = useState<TravelProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadTravelProfile());
    setReady(true);
  }, []);

  const upsert = (next: TravelProfile) => {
    saveTravelProfile(next);
    setProfile(next);
  };

  return { profile, ready, upsert };
}
