"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DECK_META } from "@/data/decks";
import { DeckGlyph } from "../Glyph";
import AnswerField from "./AnswerField";
import type { GameCard } from "@/lib/game/types";

type Step = "closed" | "face" | "question" | "insight" | "closing";

export default function CardScene({
  card,
  sacred = false,
  onComplete,
  onClose,
}: {
  card: GameCard;
  sacred?: boolean;
  onComplete: (answer: string, insight: string) => void;
  onClose?: () => void;
}) {
  const [step, setStep] = useState<Step>("closed");
  const [answer, setAnswer] = useState("");
  const [insight, setInsight] = useState("");
  const meta = DECK_META[card.deck];

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto px-5 py-10"
      style={{ background: "var(--bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <p className="eyebrow mb-8">
          {sacred ? "Голос Высшего Я" : `${meta.name} · ${meta.essence}`}
        </p>

        <AnimatePresence mode="wait">
          {step === "closed" && (
            <motion.button
              key="back"
              onClick={() => setStep("face")}
              className="relative cursor-pointer"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1200 }}
              aria-label="Открыть карту"
            >
              <div
                className="flex h-[26rem] w-72 flex-col items-center justify-between rounded-[1.4rem] p-8 sm:h-[28rem]"
                style={{
                  border: "1px solid var(--line)",
                  background:
                    "linear-gradient(160deg, var(--card) 0%, transparent 70%)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 0 50px var(--glow)",
                }}
              >
                <span className="eyebrow">ALMA CELESTE</span>
                <div className="flex flex-col items-center gap-6">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-full breathe"
                    style={{ border: "1px solid var(--line)" }}
                  >
                    <DeckGlyph deck={card.deck} size={34} strokeWidth={0.9} />
                  </div>
                  <span
                    className="text-[11px] uppercase tracking-[0.3em]"
                    style={{ color: "var(--ink-dim)" }}
                  >
                    прикоснись, чтобы открыть
                  </span>
                </div>
                <span className="eyebrow">МАТРИЦА</span>
              </div>
            </motion.button>
          )}

          {(step === "face" || step === "question" || step === "insight" || step === "closing") && (
            <motion.div
              key="face"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
              style={{ perspective: 1200 }}
            >
              <div
                className="rounded-[1.4rem] p-8 sm:p-10"
                style={{
                  border: "1px solid var(--line)",
                  background:
                    "linear-gradient(170deg, var(--card) 0%, transparent 80%)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.15), 0 0 50px var(--glow)",
                }}
              >
                <div className="flex items-center justify-between">
                  <DeckGlyph deck={card.deck} size={26} strokeWidth={1} />
                  <span className="eyebrow">{meta.name}</span>
                </div>

                <h2 className="font-display mt-8 text-3xl sm:text-4xl leading-tight">
                  {card.title}
                </h2>
                <p
                  className="mt-4 text-sm italic font-display text-lg"
                  style={{ color: "var(--ink-dim)" }}
                >
                  {card.epigraph}
                </p>
                <div className="my-6 h-px" style={{ background: "var(--line)" }} />
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                  {card.description}
                </p>

                {step === "face" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                  >
                    <button className="btn-quiet" onClick={() => setStep("question")}>
                      Услышать вопрос
                    </button>
                  </motion.div>
                )}

                {step === "question" && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mt-8"
                  >
                    <p className="font-display text-xl leading-snug">
                      {card.question}
                    </p>
                    <div className="mt-6">
                      <AnswerField
                        value={answer}
                        onChange={setAnswer}
                        placeholder="Ответ — только твой. Пиши, как идёт…"
                      />
                    </div>
                    <div className="mt-6 text-center">
                      <button
                        className="btn-quiet solid"
                        disabled={!answer.trim()}
                        onClick={() => setStep("insight")}
                      >
                        Сохранить в Дневник
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "insight" && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mt-8"
                  >
                    <p className="eyebrow">Зафиксировать инсайт</p>
                    <p className="font-display mt-3 text-xl leading-snug">
                      Что ты увидел(а) — одним предложением?
                    </p>
                    <div className="mt-5">
                      <AnswerField
                        value={insight}
                        onChange={setInsight}
                        rows={2}
                        placeholder="Например: я поняла, что…"
                      />
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <button
                        className="btn-quiet solid"
                        onClick={() => {
                          setStep("closing");
                          setTimeout(() => onComplete(answer, insight), 1400);
                        }}
                      >
                        Принять · +{insight.trim() ? 2 : 1} жетон{insight.trim() ? "а" : ""}
                      </button>
                    </div>
                    <p className="mt-4 text-center text-xs" style={{ color: "var(--ink-dim)" }}>
                      Жетон осознанности — за честное видение, не за «правильный» ответ
                    </p>
                  </motion.div>
                )}

                {step === "closing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-10 flex flex-col items-center gap-4"
                  >
                    <div
                      className="breathe h-3 w-3 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    <p className="text-sm" style={{ color: "var(--ink-dim)" }}>
                      Записано в твой Дневник
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {onClose && step !== "closing" && (
          <button
            onClick={onClose}
            className="mt-8 text-[11px] uppercase tracking-[0.25em] cursor-pointer underline-offset-4 hover:underline"
            style={{ color: "var(--ink-dim)" }}
          >
            не сейчас — вернуться
          </button>
        )}
      </div>
    </motion.div>
  );
}
