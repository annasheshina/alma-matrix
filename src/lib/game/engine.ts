import { CUBE_FACE_ORDER } from "@/data/cube";
import { DECKS } from "@/data/decks";
import { LEVELS } from "@/data/levels";
import { mulberry32 } from "./random";
import type {
  CubeFaceId,
  DeckId,
  DiaryEntryType,
  GameCard,
  GameState,
  LevelId,
} from "./types";

export function drawCubeFace(state: GameState): CubeFaceId {
  const rng = mulberry32(state.seed + state.diary.length * 7919 + state.tokensEarned * 131);
  return CUBE_FACE_ORDER[Math.floor(rng() * CUBE_FACE_ORDER.length)];
}

/** Pick a card preferring unseen ones; reshuffles when the deck is exhausted. */
export function drawCard(state: GameState, deck: DeckId): GameCard {
  const cards = DECKS[deck];
  const unseen = cards.filter((c) => !state.seenCardIds.includes(c.id));
  const pool = unseen.length > 0 ? unseen : cards;
  const rng = mulberry32(state.seed ^ (state.diary.length * 2654435761 + deck.length * 97));
  return pool[Math.floor(rng() * pool.length)];
}

export interface AdvanceCheck {
  ok: boolean;
  cost: number;
  missingTokens: number;
  requirementMet: boolean;
  requirementHint: string;
  to: LevelId | null;
}

export function checkAdvance(state: GameState): AdvanceCheck | null {
  const meta = LEVELS[state.level];
  if (!meta.transitionTo) return null;
  const t = meta.transitionTo;
  const to = (state.level + 1) as LevelId;
  // program_named must be earned on the board before transitioning;
  // new_belief / mission are produced by the transition ceremony itself.
  const requirementMet =
    t.requirement === "program_named" ? state.flags.programNamed : true;

  return {
    ok: state.tokens >= t.cost && requirementMet,
    cost: t.cost,
    missingTokens: Math.max(0, t.cost - state.tokens),
    requirementMet,
    requirementHint: t.requirementHint,
    to,
  };
}

export function higherSelfAvailable(state: GameState): boolean {
  return state.level >= 5 && state.tokens >= 5;
}

export function entryTypeForDeck(deck: DeckId): DiaryEntryType {
  switch (deck) {
    case "programs":
      return "program";
    case "secondary_benefits":
      return "benefit";
    case "karmic_lessons":
      return "lesson";
    case "world_signs":
      return "sign";
    case "higher_self":
      return "higher_self";
  }
}

export function entryTitle(type: DiaryEntryType): string {
  const titles: Record<DiaryEntryType, string> = {
    request: "Мой запрос",
    program: "Мои программы",
    benefit: "Мои выгоды",
    lesson: "Мои уроки",
    sign: "Мои знаки",
    insight: "Мои инсайты",
    new_belief: "Мои новые установки",
    higher_self: "Голос Высшего Я",
    mission: "Моя миссия",
    letter: "Моё письмо",
    intention: "Моё намерение",
    well: "Зеркальный колодец",
    silence: "Минута тишины",
    flow: "Шаг в Потоке",
    checkin: "Чек-ин дня",
  };
  return titles[type];
}
