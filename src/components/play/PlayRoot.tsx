"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/game/GameProvider";
import RequestStage from "./RequestStage";
import ModeStage from "./ModeStage";
import GameBoard from "./GameBoard";
import FinalExperience from "./FinalExperience";

export default function PlayRoot() {
  const { state, hydrated } = useGame();

  if (!hydrated) {
    return (
      <main className="scene min-h-dvh flex items-center justify-center" data-level="3">
        <div className="breathe h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
      </main>
    );
  }

  const key =
    state.stage === "board" ? `board-${state.level}` : state.stage;

  return (
    <main className="scene min-h-dvh" data-level={state.level}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-dvh"
        >
          {state.stage === "request" && <RequestStage />}
          {state.stage === "mode" && <ModeStage />}
          {state.stage === "board" && <GameBoard />}
          {(state.stage === "finale" || state.stage === "done") && (
            <FinalExperience />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
