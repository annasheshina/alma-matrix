"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { CUBE_FACES } from "@/data/cube";
import { FaceGlyph } from "../Glyph";
import type { CubeFaceId } from "@/lib/game/types";

export default function FateOverlay({
  face,
  onDone,
}: {
  face: CubeFaceId;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  const meta = CUBE_FACES[face];

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onDone}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-32 w-32 items-center justify-center rounded-[26%]"
        style={{
          border: "1px solid var(--accent)",
          boxShadow: `0 0 80px var(--glow)`,
          background: "var(--card)",
        }}
      >
        <FaceGlyph face={face} size={44} strokeWidth={0.9} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="font-display mt-8 text-4xl"
      >
        {meta.name}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-3 text-sm"
        style={{ color: "var(--ink-dim)" }}
      >
        {meta.tagline}
      </motion.p>
    </motion.div>
  );
}
