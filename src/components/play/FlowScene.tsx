"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnswerField from "./AnswerField";

export default function FlowScene({
  onComplete,
}: {
  onComplete: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
      <div className="w-full max-w-md text-center">
        <p className="eyebrow">Поток</p>
        <h2 className="font-display mt-8 text-3xl sm:text-4xl leading-snug">
          Шаг вперёд — без анализа
        </h2>
        <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
          Не думай. Не оценивай. Какое первое действие хочет случиться через тебя?
        </p>
        <div className="mt-8 text-left">
          <AnswerField
            value={text}
            onChange={setText}
            rows={2}
            placeholder="Можно оставить пустым — шаг уже сделан…"
          />
        </div>
        <button
          className="btn-quiet solid mt-8"
          onClick={() => onComplete(text)}
        >
          Сделать шаг
        </button>
      </div>
    </motion.div>
  );
}
