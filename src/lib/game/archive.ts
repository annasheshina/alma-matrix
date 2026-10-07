import { entryTitle } from "./engine";
import type { DiaryEntry, GameState } from "./types";

/**
 * Сохранённые путешествия — архив пройденных игр.
 * Живёт отдельно от текущей игры: «начать путь заново» его не стирает.
 * Позже тот же контраст легко заменить на backend/аккаунт.
 */
export interface SavedJourney {
  id: string;
  savedAt: number;
  level: number;
  request: string;
  entries: DiaryEntry[];
}

const ARCHIVE_KEY = "alma-matrix:archive:v1";

export function loadArchive(): SavedJourney[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ARCHIVE_KEY);
    return raw ? (JSON.parse(raw) as SavedJourney[]) : [];
  } catch {
    return [];
  }
}

/** Сохраняет снимок текущего пути. Не дублирует уже сохранённый снимок. */
export function saveJourney(state: GameState): SavedJourney[] {
  const archive = loadArchive();
  const lastId = state.diary[state.diary.length - 1]?.id;
  const alreadySaved = archive.some(
    (j) =>
      j.entries.length === state.diary.length &&
      j.entries[j.entries.length - 1]?.id === lastId,
  );
  if (!alreadySaved) {
    archive.push({
      id: `j-${Date.now().toString(36)}`,
      savedAt: Date.now(),
      level: state.level,
      request: state.request,
      entries: state.diary,
    });
    try {
      window.localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
    } catch {
      // storage full / private mode
    }
  }
  return archive;
}

/** Текстовая выгрузка путешествия — чтобы инсайты можно было хранить и перечитывать вне приложения. */
export function journeyToText(j: SavedJourney): string {
  const date = new Date(j.savedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const lines: string[] = [
    "МАТРИЦА СОЗДАТЕЛЯ · ALMA CELESTE",
    `Путешествие · сохранено ${date}`,
    `Достигнутый уровень: ${j.level}D`,
    "",
  ];
  for (const e of j.entries) {
    lines.push(`· ${entryTitle(e.type)}`);
    if (e.cardTitle) lines.push(e.cardTitle);
    if (e.prompt) lines.push(e.prompt);
    if (e.text) lines.push(e.text);
    if (e.insight) lines.push(`Инсайт: ${e.insight}`);
    lines.push("");
  }
  lines.push("Я — Создатель. Я — свободен. Я — в потоке.");
  return lines.join("\n");
}
