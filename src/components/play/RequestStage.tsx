"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/lib/game/GameProvider";

export default function RequestStage() {
  const { state, dispatch } = useGame();
  const [value, setValue] = useState(state.request);

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <p className="eyebrow">Вход в Матрицу</p>
        <h1 className="font-display mt-8 text-4xl sm:text-5xl leading-tight">
          С чем ты пришёл(ла) сегодня?
        </h1>
        <p className="mt-6 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
          Один живой запрос. Ситуация, вопрос, точка, где хочется ясности.
          <br />
          Не «правильная» формулировка — а честная.
        </p>

        <form
          className="mt-12"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) dispatch({ type: "set_request", request: value });
          }}
        >
          <textarea
            className="input-quiet text-center text-lg"
            rows={3}
            autoFocus
            placeholder="Например: отношения, которые стоят на месте…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: value.trim() ? 1 : 0.3 }}
            className="mt-10"
          >
            <button type="submit" className="btn-quiet solid" disabled={!value.trim()}>
              Войти в игру
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
