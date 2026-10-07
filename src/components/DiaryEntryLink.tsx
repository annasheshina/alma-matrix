"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

function hasJourneyData(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const game = JSON.parse(
      window.localStorage.getItem("alma-matrix:game:v1") ?? "null",
    );
    const archive = JSON.parse(
      window.localStorage.getItem("alma-matrix:archive:v1") ?? "null",
    );
    return (
      (game?.diary?.length ?? 0) > 0 || (Array.isArray(archive) && archive.length > 0)
    );
  } catch {
    return false;
  }
}

const subscribe = () => () => {};

/** Кнопка «Мой дневник» на лендинге — видна только если уже есть записи. */
export default function DiaryEntryLink() {
  const has = useSyncExternalStore(
    subscribe,
    hasJourneyData,
    () => false,
  );
  if (!has) return null;
  return (
    <div className="anim-fade-up mt-8">
      <Link
        href="/diary"
        className="text-[11px] uppercase tracking-[0.25em] underline-offset-4 hover:underline"
        style={{ color: "var(--ink-dim)" }}
      >
        Мой дневник
      </Link>
    </div>
  );
}
