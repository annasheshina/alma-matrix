"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import { useGame } from "@/lib/game/GameProvider";

export default function ModeStage() {
  const { dispatch } = useGame();
  const [groupOpen, setGroupOpen] = useState(false);

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        <p className="eyebrow">Как ты хочешь пройти путь?</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <motion.button
            whileHover={{ y: -4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => dispatch({ type: "set_mode", mode: "solo" })}
            className="hairline rounded-3xl p-10 text-left cursor-pointer"
            style={{ background: "var(--card)" }}
          >
            <User size={26} strokeWidth={1.1} style={{ color: "var(--accent)" }} />
            <h2 className="font-display mt-6 text-3xl">Solo</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
              Личное путешествие. Только ты, поле и твои ответы.
            </p>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setGroupOpen(true)}
            className="hairline rounded-3xl p-10 text-left cursor-pointer"
            style={{ background: "var(--card)" }}
          >
            <Users size={26} strokeWidth={1.1} style={{ color: "var(--accent)" }} />
            <h2 className="font-display mt-6 text-3xl">Group</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
              Общее поле: каждый идёт своим путём — и может поддерживать других.
            </p>
          </motion.button>
        </div>

        {groupOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 mx-auto max-w-md hairline rounded-2xl p-8"
            style={{ background: "var(--card)" }}
          >
            <p className="font-display text-2xl">Групповое поле — скоро</p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
              Комнаты по коду и общие кристаллы появятся в следующей версии.
              Сейчас самое глубокое путешествие — твоё собственное.
            </p>
            <button
              className="btn-quiet solid mt-6"
              onClick={() => dispatch({ type: "set_mode", mode: "solo" })}
            >
              Пройти Solo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
