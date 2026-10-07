"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { WELL_INVITATION, WELL_QUESTIONS } from "@/data/well";
import AnswerField from "./AnswerField";

export default function MirrorWell({
  seed,
  visits,
  onComplete,
  onClose,
}: {
  seed: number;
  visits: number;
  onComplete: (question: string, answer: string) => void;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const question = useMemo(
    () => WELL_QUESTIONS[(seed + visits) % WELL_QUESTIONS.length],
    [seed, visits],
  );

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center px-6"
      style={{ background: "#0e0d11" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* отражающее сияние */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,178,147,0.10) 0%, rgba(200,178,147,0.03) 45%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md text-center text-[#e8e2d6]">
        <p className="eyebrow" style={{ color: "rgba(232,226,214,0.45)" }}>
          Зеркальный колодец
        </p>

        <h2 className="font-display mt-10 text-3xl sm:text-4xl leading-snug">
          {WELL_INVITATION}
        </h2>

        <motion.p
          key={question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 font-display text-xl italic leading-relaxed"
          style={{ color: "rgba(232,226,214,0.75)" }}
        >
          {question}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-10 text-left"
        >
          <AnswerField
            value={answer}
            onChange={setAnswer}
            rows={4}
            placeholder="Смотри внутрь — и записывай, что видишь…"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-5"
        >
          <button
            className="btn-quiet solid"
            style={{ background: "#e8e2d6", color: "#0e0d11", borderColor: "#e8e2d6" }}
            disabled={!answer.trim()}
            onClick={() => onComplete(question, answer)}
          >
            Оставить в Колодце · +2 жетона
          </button>
          <button
            className="text-[11px] uppercase tracking-[0.25em] cursor-pointer"
            style={{ color: "rgba(232,226,214,0.4)" }}
            onClick={onClose}
          >
            выйти, не отвечая
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
