"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { checkAdvance, higherSelfAvailable } from "@/lib/game/engine";
import { tokenSuffix } from "@/lib/plural";
import { useGame } from "@/lib/game/GameProvider";
import { LEVELS } from "@/data/levels";
import type { LevelId } from "@/lib/game/types";
import IntentionCube from "./IntentionCube";
import CardScene from "./CardScene";
import SilenceScene from "./SilenceScene";
import FlowScene from "./FlowScene";
import MirrorWell from "./MirrorWell";
import FateOverlay from "./FateOverlay";
import LevelCeremony from "./LevelCeremony";

const NODE_POS: Record<LevelId, { x: number; y: number }> = {
  3: { x: 50, y: 100 },
  4: { x: 0, y: 50 },
  5: { x: 50, y: 0 },
  6: { x: 100, y: 50 },
};

export default function GameBoard() {
  const { state, dispatch } = useGame();
  const [ceremonyOpen, setCeremonyOpen] = useState(false);
  const meta = LEVELS[state.level];
  const advance = checkAdvance(state);
  const higherOpen = higherSelfAvailable(state);
  const phase = state.turn.phase;

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* верхняя строка */}
      <header className="flex items-start justify-between px-5 pt-6 sm:px-8">
        <div>
          <p className="eyebrow">
            {meta.name} · {meta.archetype}
          </p>
          <p className="mt-1 font-display text-lg italic" style={{ color: "var(--ink-dim)" }}>
            «{meta.motto}»
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span className="text-sm tracking-[0.15em]">
              {state.tokens} жетон{tokenSuffix(state.tokens)}
            </span>
          </div>
          <Link
            href="/diary"
            className="text-[11px] uppercase tracking-[0.25em] underline-offset-4 hover:underline"
            style={{ color: "var(--ink-dim)" }}
          >
            Дневник
          </Link>
        </div>
      </header>

      {/* запрос */}
      {state.request && (
        <p
          className="mx-auto mt-4 max-w-xs text-center text-xs leading-relaxed"
          style={{ color: "var(--ink-dim)" }}
        >
          «{state.request}»
        </p>
      )}

      {/* поле: орбита уровней + колодец */}
      <div className="flex flex-1 items-center justify-center py-6">
        <div className="relative h-[300px] w-[300px] sm:h-[360px] sm:w-[360px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid var(--line)" }}
          />
          <div
            className="absolute inset-[18%] rounded-full"
            style={{ border: "1px solid var(--line)", opacity: 0.5 }}
          />

          {([3, 4, 5, 6] as LevelId[]).map((lv) => {
            const pos = NODE_POS[lv];
            const isCurrent = lv === state.level;
            const isPassed = lv < state.level;
            return (
              <div
                key={lv}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div
                  className="mx-auto flex items-center justify-center rounded-full"
                  style={{
                    width: isCurrent ? 22 : 14,
                    height: isCurrent ? 22 : 14,
                    border: `1px solid ${isCurrent ? "var(--accent)" : "var(--line)"}`,
                    background: isPassed || isCurrent ? "var(--accent)" : "transparent",
                    boxShadow: isCurrent ? `0 0 26px var(--glow)` : "none",
                    transition: "all 1s var(--ease-slow)",
                  }}
                />
                <p
                  className="mt-2 whitespace-nowrap text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: isCurrent ? "var(--ink)" : "var(--ink-dim)" }}
                >
                  {LEVELS[lv].name} · {LEVELS[lv].archetype}
                </p>
              </div>
            );
          })}

          {/* Зеркальный колодец */}
          <button
            onClick={() => dispatch({ type: "open_well" })}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            aria-label="Войти в Зеркальный колодец"
          >
            <motion.div
              className="breathe flex h-24 w-24 flex-col items-center justify-center rounded-full sm:h-28 sm:w-28"
              style={{
                border: "1px solid var(--line)",
                background:
                  "radial-gradient(circle at 50% 30%, var(--card) 0%, transparent 80%)",
                boxShadow: `inset 0 0 30px var(--glow), 0 0 40px var(--glow)`,
              }}
            >
              <span className="font-display text-sm leading-tight">
                Зеркальный
                <br />
                колодец
              </span>
            </motion.div>
          </button>
        </div>
      </div>

      {/* нижняя зона действий */}
      <div className="flex flex-col items-center gap-8 pb-12">
        {higherOpen && (
          <button
            onClick={() => dispatch({ type: "open_higher" })}
            className="eyebrow cursor-pointer underline-offset-4 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            ✦ Голос Высшего Я
          </button>
        )}

        <IntentionCube />

        {advance && (
          <div className="text-center">
            <button
              className="btn-quiet solid"
              disabled={!advance.ok}
              onClick={() => setCeremonyOpen(true)}
            >
              Перейти на {advance.to}D · {advance.cost} жетонов
            </button>
            {!advance.ok && (
              <p className="mt-3 max-w-xs text-xs leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {advance.missingTokens > 0 &&
                  `Нужно ещё ${advance.missingTokens} жетон${tokenSuffix(advance.missingTokens)} осознанности. `}
                {!advance.requirementMet && advance.requirementHint}
              </p>
            )}
          </div>
        )}
      </div>

      {/* оверлеи хода */}
      <AnimatePresence>
        {phase === "fate" && state.turn.face && (
          <FateOverlay
            key="fate"
            face={state.turn.face}
            onDone={() => dispatch({ type: "open_card" })}
          />
        )}
        {phase === "card" && state.turn.card && (
          <CardScene
            key="card"
            card={state.turn.card}
            onComplete={(answer, insight) =>
              dispatch({ type: "complete_card", answer, insight })
            }
            onClose={() => dispatch({ type: "cancel_turn" })}
          />
        )}
        {phase === "silence" && (
          <SilenceScene
            key="silence"
            onComplete={() => dispatch({ type: "complete_silence" })}
            onClose={() => dispatch({ type: "cancel_turn" })}
          />
        )}
        {phase === "flow" && (
          <FlowScene
            key="flow"
            onComplete={(text) => dispatch({ type: "complete_flow", text })}
            onClose={() => dispatch({ type: "cancel_turn" })}
          />
        )}
        {phase === "well" && (
          <MirrorWell
            key="well"
            seed={state.seed}
            visits={state.wellVisits}
            onComplete={(question, answer) =>
              dispatch({ type: "complete_well", question, answer })
            }
            onClose={() => dispatch({ type: "cancel_turn" })}
          />
        )}
        {phase === "higher" && state.turn.card && (
          <CardScene
            key="higher"
            card={state.turn.card}
            sacred
            onComplete={(answer, insight) =>
              dispatch({ type: "complete_higher", answer, insight })
            }
            onClose={() => dispatch({ type: "cancel_turn" })}
          />
        )}
        {ceremonyOpen && advance?.to && (
          <LevelCeremony
            key="ceremony"
            from={state.level}
            to={advance.to}
            cost={advance.cost}
            onClose={() => setCeremonyOpen(false)}
            onConfirm={(input) => {
              setCeremonyOpen(false);
              dispatch({ type: "advance", input });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
