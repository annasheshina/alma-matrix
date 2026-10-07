"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CUBE_FACE_ORDER, CUBE_FACES } from "@/data/cube";
import { FaceGlyph } from "../Glyph";
import { useGame } from "@/lib/game/GameProvider";

export default function IntentionCube() {
  const { state, dispatch } = useGame();
  const rolling = state.turn.phase === "rolling";
  const [spinIdx, setSpinIdx] = useState(0);

  useEffect(() => {
    if (!rolling) return;
    const iv = setInterval(
      () => setSpinIdx((i) => (i + 1) % CUBE_FACE_ORDER.length),
      140,
    );
    const done = setTimeout(() => dispatch({ type: "roll_done" }), 1900);
    return () => {
      clearInterval(iv);
      clearTimeout(done);
    };
  }, [rolling, dispatch]);

  return (
    <div className="flex flex-col items-center">
      <motion.button
        onClick={() => dispatch({ type: "roll" })}
        disabled={rolling}
        whileHover={rolling ? undefined : { scale: 1.04 }}
        whileTap={rolling ? undefined : { scale: 0.97 }}
        className="relative flex h-28 w-28 items-center justify-center rounded-[26%] cursor-pointer sm:h-32 sm:w-32"
        style={{
          border: "1px solid var(--line)",
          background: "var(--card)",
          boxShadow: rolling ? `0 0 70px var(--glow)` : `0 0 34px var(--glow)`,
          transition: "box-shadow 0.8s",
        }}
        aria-label="Бросить Куб Намерения"
      >
        <motion.div
          animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.08, 1, 1.08, 1] } : { rotate: 0 }}
          transition={rolling ? { duration: 1.9, ease: "easeInOut" } : { duration: 0.6 }}
          className="flex items-center justify-center"
        >
          <FaceGlyph
            face={rolling ? CUBE_FACE_ORDER[spinIdx] : "sign"}
            size={36}
            strokeWidth={1}
            className="transition-all"
          />
        </motion.div>
      </motion.button>
      <p className="eyebrow mt-6">
        {rolling ? "Куб выбирает…" : "Куб Намерения"}
      </p>
      {!rolling && (
        <p className="mt-2 text-xs" style={{ color: "var(--ink-dim)" }}>
          {Object.values(CUBE_FACES)
            .map((f) => f.name)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}
