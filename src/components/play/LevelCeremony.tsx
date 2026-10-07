"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LEVELS } from "@/data/levels";
import AnswerField from "./AnswerField";
import type { LevelId } from "@/lib/game/types";

export default function LevelCeremony({
  from,
  to,
  cost,
  onConfirm,
  onClose,
}: {
  from: LevelId;
  to: LevelId;
  cost: number;
  onConfirm: (input: string) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const meta = LEVELS[from].transitionTo!;
  const next = LEVELS[to];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-md text-center">
        <p className="eyebrow">Переход уровня</p>

        <div className="mt-8 flex items-center justify-center gap-5 font-display text-2xl">
          <span style={{ color: "var(--ink-dim)" }}>{LEVELS[from].name}</span>
          <span style={{ color: "var(--accent)" }}>→</span>
          <span>{next.name}</span>
        </div>
        <p className="mt-3 font-display text-3xl sm:text-4xl">{next.archetype}</p>
        <p className="mt-2 text-sm italic font-display text-lg" style={{ color: "var(--ink-dim)" }}>
          «{next.motto}»
        </p>

        <div className="my-8 h-px" style={{ background: "var(--line)" }} />

        <p className="font-display text-xl leading-snug">{meta.ceremonyQuestion}</p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
          {meta.ceremonyHint}
        </p>

        <div className="mt-7 text-left">
          <AnswerField
            value={input}
            onChange={setInput}
            rows={3}
            placeholder="Одна честная фраза…"
          />
        </div>

        <div className="mt-9 flex flex-col items-center gap-5">
          <button
            className="btn-quiet solid"
            disabled={!input.trim()}
            onClick={() => onConfirm(input)}
          >
            Перейти на {next.name} · −{cost} жетонов
          </button>
          <button
            className="text-[11px] uppercase tracking-[0.25em] cursor-pointer"
            style={{ color: "var(--ink-dim)" }}
            onClick={onClose}
          >
            ещё рано — вернуться
          </button>
        </div>
      </div>
    </motion.div>
  );
}
