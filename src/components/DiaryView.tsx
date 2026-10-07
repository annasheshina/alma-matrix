"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { entryTitle } from "@/lib/game/engine";
import { useGame } from "@/lib/game/GameProvider";
import {
  journeyToText,
  loadArchive,
  saveJourney,
  type SavedJourney,
} from "@/lib/game/archive";
import { LEVELS } from "@/data/levels";
import type { DiaryEntry, DiaryEntryType } from "@/lib/game/types";

const SECTION_ORDER: DiaryEntryType[] = [
  "request",
  "program",
  "benefit",
  "lesson",
  "sign",
  "insight",
  "new_belief",
  "higher_self",
  "mission",
  "letter",
  "intention",
];

const MOMENT_TYPES: DiaryEntryType[] = ["well", "silence", "flow", "checkin"];

function EntryArticle({ e }: { e: DiaryEntry }) {
  return (
    <article className="pl-5" style={{ borderLeft: "1px solid var(--line)" }}>
      {e.cardTitle && <p className="font-display text-lg">{e.cardTitle}</p>}
      <p className="mt-1 text-xs" style={{ color: "var(--ink-dim)" }}>
        {e.prompt}
      </p>
      <p className="mt-3 font-display text-xl leading-relaxed whitespace-pre-line">
        {e.text}
      </p>
      {e.insight && (
        <p className="mt-2 text-sm italic" style={{ color: "var(--accent)" }}>
          Инсайт: {e.insight}
        </p>
      )}
      <p
        className="mt-2 text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--ink-dim)" }}
      >
        {LEVELS[e.level].name} ·{" "}
        {new Date(e.at).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
        })}
      </p>
    </article>
  );
}

function JourneySections({ entries }: { entries: DiaryEntry[] }) {
  const sections = SECTION_ORDER.map((t) => ({
    type: t,
    title: entryTitle(t),
    items: entries.filter((e) => e.type === t),
  })).filter((s) => s.items.length > 0);

  const moments = entries.filter((e) => MOMENT_TYPES.includes(e.type));

  return (
    <>
      {sections.map((section, si) => (
        <motion.section
          key={section.type}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * si, duration: 0.9 }}
          className="mt-14"
        >
          <p className="eyebrow">{section.title}</p>
          <div className="mt-5 space-y-6">
            {section.items.map((e) => (
              <EntryArticle key={e.id} e={e} />
            ))}
          </div>
        </motion.section>
      ))}

      {moments.length > 0 && (
        <section className="mt-14">
          <p className="eyebrow">Моменты пути</p>
          <div className="mt-5 space-y-6">
            {moments.map((e) => (
              <article
                key={e.id}
                className="pl-5"
                style={{ borderLeft: "1px solid var(--line)" }}
              >
                <p className="mt-1 text-xs" style={{ color: "var(--ink-dim)" }}>
                  {entryTitle(e.type)} · {e.prompt}
                </p>
                <p className="mt-3 font-display text-xl leading-relaxed whitespace-pre-line">
                  {e.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function downloadJourney(j: SavedJourney) {
  const blob = new Blob([journeyToText(j)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `matrica-put-${new Date(j.savedAt).toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DiaryView() {
  const { state, hydrated, dispatch } = useGame();
  const [checkin, setCheckin] = useState("");
  const [archive, setArchive] = useState<SavedJourney[]>(() => loadArchive());
  const [openJourneyId, setOpenJourneyId] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <main
        className="scene min-h-dvh flex items-center justify-center"
        data-level="5"
      >
        <div
          className="breathe h-2 w-2 rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </main>
    );
  }

  const entries = state.diary;
  const finished = state.stage === "done";
  const lastId = entries[entries.length - 1]?.id;
  const saved =
    lastId !== undefined &&
    archive.some(
      (j) =>
        j.entries.length === entries.length &&
        j.entries[j.entries.length - 1]?.id === lastId,
    );

  const handleSave = () => {
    setArchive(saveJourney(state));
  };

  return (
    <main className="scene min-h-dvh" data-level={Math.min(state.level, 5)}>
      <div className="mx-auto max-w-xl px-6 py-14">
        <header className="flex items-start justify-between">
          <div>
            <p className="eyebrow">Дневник игрока</p>
            <h1 className="font-display mt-4 text-4xl sm:text-5xl">Мой путь</h1>
          </div>
          <Link
            href="/play"
            className="text-[11px] uppercase tracking-[0.25em] underline-offset-4 hover:underline"
            style={{ color: "var(--ink-dim)" }}
          >
            {state.stage === "board" ? "к полю" : "в игру"}
          </Link>
        </header>

        {entries.length === 0 && (
          <p
            className="mt-16 text-center text-sm"
            style={{ color: "var(--ink-dim)" }}
          >
            Дневник пока пуст. Он начнёт заполняться с первого шага игры.
          </p>
        )}

        <JourneySections entries={entries} />

        {finished && entries.length > 0 && (
          <section className="mt-16 text-center">
            {saved ? (
              <p className="text-sm" style={{ color: "var(--ink-dim)" }}>
                Инсайты сохранены — они останутся здесь,
                <br />
                даже если ты начнёшь путь заново.
              </p>
            ) : (
              <button className="btn-quiet solid" onClick={handleSave}>
                Сохранить инсайты
              </button>
            )}
          </section>
        )}

        {finished && (
          <section className="mt-16">
            <p className="eyebrow">Чек-ин дня</p>
            <p className="mt-4 font-display text-xl">
              Что сегодня показала тебе твоя реальность?
            </p>
            <textarea
              className="input-quiet mt-5"
              rows={3}
              placeholder="Замечание дня…"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
            />
            <div className="mt-6">
              <button
                className="btn-quiet"
                disabled={!checkin.trim()}
                onClick={() => {
                  dispatch({ type: "add_checkin", text: checkin });
                  setCheckin("");
                }}
              >
                Записать
              </button>
            </div>
          </section>
        )}

        {archive.length > 0 && (
          <section className="mt-20">
            <p className="eyebrow">Сохранённые путешествия</p>
            <div className="mt-6 space-y-4">
              {archive.map((j) => {
                const open = openJourneyId === j.id;
                return (
                  <div
                    key={j.id}
                    className="pl-5"
                    style={{ borderLeft: "1px solid var(--line)" }}
                  >
                    <button
                      onClick={() =>
                        setOpenJourneyId(open ? null : j.id)
                      }
                      className="w-full text-left cursor-pointer"
                    >
                      <p className="font-display text-lg">
                        {new Date(j.savedAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p
                        className="mt-1 text-xs"
                        style={{ color: "var(--ink-dim)" }}
                      >
                        {j.request
                          ? `«${j.request}» · `
                          : ""}
                        {j.level}D · {j.entries.length} записей
                      </p>
                    </button>
                    {open && (
                      <div className="mt-4">
                        <JourneySections entries={j.entries} />
                        <button
                          onClick={() => downloadJourney(j)}
                          className="mt-6 text-[11px] uppercase tracking-[0.25em] cursor-pointer underline-offset-4 hover:underline"
                          style={{ color: "var(--ink-dim)" }}
                        >
                          скачать текстом
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {entries.length > 0 && (
          <footer className="mt-20 pb-6 text-center">
            <button
              className="text-[11px] uppercase tracking-[0.25em] cursor-pointer"
              style={{ color: "var(--ink-dim)" }}
              onClick={() => {
                if (
                  window.confirm(
                    "Начать путешествие заново? Текущий дневник будет очищен — сохранённые путешествия останутся.",
                  )
                ) {
                  dispatch({ type: "reset" });
                }
              }}
            >
              начать путь заново
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
