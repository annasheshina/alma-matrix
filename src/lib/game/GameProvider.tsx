"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { freshState, gameReducer, type GameAction } from "./reducer";
import { newSeed } from "./random";
import { gameStorage } from "./storage";
import type { GameState } from "./types";

interface GameContextValue {
  state: GameState;
  hydrated: boolean;
  dispatch: (a: GameAction) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, freshState);
  const hydrated = state.hydrated === true;

  useEffect(() => {
    const saved = gameStorage.load();
    dispatch({
      type: "hydrate",
      state: saved ?? freshState(newSeed(), Date.now()),
    });
  }, []);

  useEffect(() => {
    if (hydrated) gameStorage.save(state);
  }, [state, hydrated]);

  const value = useMemo(
    () => ({ state, hydrated, dispatch }),
    [state, hydrated],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
