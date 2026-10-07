"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DURATION = 60;

export default function SilenceScene({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [left, setLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(iv);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [started]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <p className="eyebrow">Тишина</p>

      {!started ? (
        <>
          <h2 className="font-display mt-8 max-w-md text-center text-3xl leading-snug">
            Одна минута — просто быть.
          </h2>
          <p className="mt-5 text-sm" style={{ color: "var(--ink-dim)" }}>
            Ничего не нужно делать правильно. Просто дыши.
          </p>
          <button className="btn-quiet mt-10" onClick={() => setStarted(true)}>
            Войти в тишину
          </button>
        </>
      ) : left > 0 ? (
        <>
          <div
            className="breathe mt-10 flex h-40 w-40 items-center justify-center rounded-full"
            style={{
              border: "1px solid var(--line)",
              boxShadow: `0 0 80px var(--glow)`,
            }}
          >
            <span className="font-display text-5xl" style={{ color: "var(--ink-dim)" }}>
              {left}
            </span>
          </div>
          <p className="mt-10 text-sm" style={{ color: "var(--ink-dim)" }}>
            вдох&nbsp;·&nbsp;выдох
          </p>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <h2 className="font-display max-w-md text-center text-3xl leading-snug">
            Минута тишины прожита.
          </h2>
          <button className="btn-quiet solid mt-10" onClick={onComplete}>
            Вернуться на поле
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
