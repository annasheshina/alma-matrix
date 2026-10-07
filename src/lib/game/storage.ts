import type { GameState } from "./types";

/**
 * Storage abstraction: swap this implementation for a backend/auth-backed
 * repository later without touching game logic.
 */
export interface GameStorage {
  load(): GameState | null;
  save(state: GameState): void;
  clear(): void;
}

const KEY = "alma-matrix:game:v1";

class LocalGameStorage implements GameStorage {
  load(): GameState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.version !== 1) return null;
      return parsed as GameState;
    } catch {
      return null;
    }
  }

  save(state: GameState): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // storage full / private mode — session keeps working in memory
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(KEY);
  }
}

export const gameStorage: GameStorage = new LocalGameStorage();
