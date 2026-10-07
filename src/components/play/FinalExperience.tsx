"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useGame } from "@/lib/game/GameProvider";
import AnswerField from "./AnswerField";

type Step = "arrive" | "summary" | "letter" | "intention" | "final";

export default function FinalExperience() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState<Step>(
    state.stage === "done"
      ? "final"
      : state.flags.letterDone
        ? state.flags.intentionDone
          ? "final"
          : "intention"
        : "arrive",
  );
  const [letter, setLetter] = useState("");
  const [intention, setIntention] = useState("");

  const stats = useMemo(() => {
    const count = (t: string) => state.diary.filter((d) => d.type === t).length;
    return {
      programs: count("program"),
      benefits: count("benefit"),
      lessons: count("lesson"),
      signs: count("sign"),
      insights: count("insight"),
      well: count("well"),
    };
  }, [state.diary]);

  const mission = state.diary.find((d) => d.type === "mission")?.text;
  const newBelief = state.diary.find((d) => d.type === "new_belief")?.text;
  const savedLetter = state.diary.find((d) => d.type === "letter")?.text;
  const savedIntention = state.diary.find((d) => d.type === "intention")?.text;

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 py-16">
      <AnimatePresence mode="wait">
        {step === "arrive" && (
          <motion.div
            key="arrive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6 }}
            className="text-center"
          >
            <p className="eyebrow">6D · Поток</p>
            <h1 className="font-display mt-10 max-w-lg text-4xl sm:text-5xl leading-tight">
              Ты увидел(а) то, что раньше было скрыто.
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1.2 }}
            >
              <button className="btn-quiet mt-14" onClick={() => setStep("summary")}>
                Оглянуться на путь
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md"
          >
            <p className="eyebrow text-center">Твой путь</p>
            <div className="mt-10 space-y-5">
              {[
                ["Исследовано программ", stats.programs],
                ["Признано вторичных выгод", stats.benefits],
                ["Пройдено уроков", stats.lessons],
                ["Замечено знаков", stats.signs],
                ["Найдено инсайтов", stats.insights],
                ["Погружений в Колодец", stats.well],
              ]
                .filter(([, n]) => (n as number) > 0)
                .map(([label, n]) => (
                  <div
                    key={label as string}
                    className="flex items-baseline justify-between"
                    style={{ borderBottom: "1px solid var(--line)", paddingBottom: "0.9rem" }}
                  >
                    <span className="text-sm" style={{ color: "var(--ink-dim)" }}>
                      {label}
                    </span>
                    <span className="font-display text-2xl">{n}</span>
                  </div>
                ))}
            </div>
            {newBelief && (
              <p className="mt-8 text-center font-display text-lg italic" style={{ color: "var(--ink-dim)" }}>
                Новая установка: «{newBelief}»
              </p>
            )}
            {mission && (
              <p className="mt-4 text-center font-display text-xl">
                Миссия: «{mission}»
              </p>
            )}
            <div className="mt-12 text-center">
              <button className="btn-quiet solid" onClick={() => setStep("letter")}>
                Написать письмо себе
              </button>
            </div>
          </motion.div>
        )}

        {step === "letter" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md"
          >
            <p className="eyebrow text-center">Письмо</p>
            <h2 className="font-display mt-6 text-center text-3xl leading-snug">
              Письмо человеку, который прошёл этот путь
            </h2>
            <p className="mt-4 text-center text-sm" style={{ color: "var(--ink-dim)" }}>
              То есть — себе. То, что важно не забыть.
            </p>
            <div className="mt-8">
              <AnswerField
                value={letter}
                onChange={setLetter}
                rows={6}
                placeholder="Дорогой(ая) я…"
              />
            </div>
            <div className="mt-8 text-center">
              <button
                className="btn-quiet solid"
                disabled={!letter.trim()}
                onClick={() => {
                  dispatch({ type: "save_letter", text: letter });
                  setStep("intention");
                }}
              >
                Сохранить письмо
              </button>
            </div>
          </motion.div>
        )}

        {step === "intention" && (
          <motion.div
            key="intention"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-md"
          >
            <p className="eyebrow text-center">Намерение · 7 дней</p>
            <h2 className="font-display mt-6 text-center text-3xl leading-snug">
              Какой один шаг ты сделаешь в реальной жизни?
            </h2>
            <p className="mt-4 text-center text-sm" style={{ color: "var(--ink-dim)" }}>
              Один. Маленький. Реальный — на ближайшую неделю.
            </p>
            <div className="mt-8">
              <AnswerField
                value={intention}
                onChange={setIntention}
                rows={3}
                placeholder="На этой неделе я…"
              />
            </div>
            <div className="mt-8 text-center">
              <button
                className="btn-quiet solid"
                disabled={!intention.trim()}
                onClick={() => {
                  dispatch({ type: "save_intention", text: intention });
                  dispatch({ type: "finish" });
                  setStep("final");
                }}
              >
                Принять намерение
              </button>
            </div>
          </motion.div>
        )}

        {step === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6 }}
            className="w-full max-w-lg text-center"
          >
            <p className="eyebrow">Путешествие завершено</p>

            {(savedIntention || intention) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 font-display text-lg italic"
                style={{ color: "var(--ink-dim)" }}
              >
                Намерение: «{savedIntention ?? intention}»
              </motion.p>
            )}
            {(savedLetter || letter) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-6 text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "var(--ink-dim)" }}
              >
                {savedLetter ?? letter}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.6 }}
              className="font-display mt-14 text-4xl sm:text-5xl leading-tight"
            >
              Я — Создатель.
              <br />
              Я — свободен.
              <br />
              Я — в потоке.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
              className="mt-14 flex flex-col items-center gap-6"
            >
              <Link href="/diary" className="btn-quiet solid">
                Открыть мой Дневник
              </Link>
              <Link
                href="/"
                className="text-[11px] uppercase tracking-[0.25em]"
                style={{ color: "var(--ink-dim)" }}
              >
                на главную
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
