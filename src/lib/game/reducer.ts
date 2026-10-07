import { newSeed } from "./random";
import { drawCard, drawCubeFace, entryTypeForDeck } from "./engine";
import { WELL_TOKEN_REWARD, INSIGHT_TOKEN_REWARD } from "@/data/levels";
import { CUBE_FACES } from "@/data/cube";
import type {
  DiaryEntry,
  DiaryEntryType,
  GameState,
  LevelId,
} from "./types";

export type GameAction =
  | { type: "hydrate"; state: GameState | null }
  | { type: "set_request"; request: string }
  | { type: "set_mode"; mode: "solo" | "group" }
  | { type: "roll" }
  | { type: "roll_done" }
  | { type: "open_card" }
  | { type: "complete_card"; answer: string; insight: string }
  | { type: "complete_flow"; text: string }
  | { type: "complete_silence" }
  | { type: "open_well" }
  | { type: "complete_well"; question: string; answer: string }
  | { type: "open_higher" }
  | { type: "complete_higher"; answer: string; insight: string }
  | { type: "advance"; input: string }
  | { type: "enter_finale" }
  | { type: "save_letter"; text: string }
  | { type: "save_intention"; text: string }
  | { type: "finish" }
  | { type: "add_checkin"; text: string }
  | { type: "cancel_turn" }
  | { type: "reset" };

let counter = 0;
function uid(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}`;
}

function entry(
  state: GameState,
  e: Omit<DiaryEntry, "id" | "at" | "level"> & { level?: LevelId },
): DiaryEntry {
  return { id: uid(), at: Date.now(), level: state.level, ...e };
}

const idleTurn = { phase: "idle" as const, face: null, card: null };

export function freshState(seed = 0, createdAt = 0): GameState {
  return {
    version: 1,
    seed,
    stage: "request",
    request: "",
    mode: null,
    level: 3,
    tokens: 0,
    tokensEarned: 0,
    seenCardIds: [],
    wellVisits: 0,
    diary: [],
    turn: idleTurn,
    flags: {
      programNamed: false,
      newBelief: false,
      mission: false,
      letterDone: false,
      intentionDone: false,
    },
    createdAt,
    finishedAt: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "hydrate":
      return { ...(action.state ?? state), hydrated: true };

    case "set_request": {
      const request = action.request.trim();
      const diary =
        request && request !== state.request
          ? [
              ...state.diary.filter((d) => d.type !== "request"),
              entry(state, { type: "request", prompt: "С чем ты пришёл(ла) сегодня?", text: request }),
            ]
          : state.diary;
      return { ...state, request, diary, stage: "mode" };
    }

    case "set_mode":
      return { ...state, mode: action.mode, stage: "board" };

    case "roll":
      return {
        ...state,
        turn: { phase: "rolling", face: null, card: null },
      };

    case "roll_done": {
      const face = drawCubeFace(state);
      return { ...state, turn: { phase: "fate", face, card: null } };
    }

    case "open_card": {
      const face = state.turn.face;
      if (!face) return state;
      const deck = CUBE_FACES[face].deck;
      if (!deck) {
        const phase = face === "silence" ? "silence" : "flow";
        return { ...state, turn: { ...state.turn, phase } };
      }
      const card = drawCard(state, deck);
      return {
        ...state,
        turn: { ...state.turn, phase: "card", card },
      };
    }

    case "complete_card": {
      const card = state.turn.card;
      if (!card) return state;
      const type = entryTypeForDeck(card.deck);
      const base = entry(state, {
        type,
        cardTitle: card.title,
        prompt: card.question,
        text: action.answer.trim(),
        insight: action.insight.trim() || undefined,
      });
      const entries = [base];
      if (action.insight.trim()) {
        entries.push(
          entry(state, {
            type: "insight",
            cardTitle: card.title,
            prompt: "Инсайт",
            text: action.insight.trim(),
          }),
        );
      }
      const tokens = action.insight.trim() ? INSIGHT_TOKEN_REWARD + 1 : INSIGHT_TOKEN_REWARD;
      return {
        ...state,
        tokens: state.tokens + tokens,
        tokensEarned: state.tokensEarned + tokens,
        seenCardIds: [...state.seenCardIds, card.id],
        diary: [...state.diary, ...entries],
        flags: {
          ...state.flags,
          programNamed: state.flags.programNamed || card.deck === "programs",
        },
        turn: idleTurn,
      };
    }

    case "complete_flow":
      return {
        ...state,
        diary: [
          ...state.diary,
          entry(state, {
            type: "flow",
            prompt: "Поток: шаг без анализа",
            text: action.text.trim() || "Сделан шаг вперёд — без анализа.",
          }),
        ],
        turn: idleTurn,
      };

    case "complete_silence":
      return {
        ...state,
        diary: [
          ...state.diary,
          entry(state, {
            type: "silence",
            prompt: "Минута тишины",
            text: "Я был(а) в тишине одну минуту.",
          }),
        ],
        turn: idleTurn,
      };

    case "open_well":
      return { ...state, turn: { ...state.turn, phase: "well" } };

    case "complete_well":
      return {
        ...state,
        tokens: state.tokens + WELL_TOKEN_REWARD,
        tokensEarned: state.tokensEarned + WELL_TOKEN_REWARD,
        wellVisits: state.wellVisits + 1,
        diary: [
          ...state.diary,
          entry(state, { type: "well", prompt: action.question, text: action.answer.trim() }),
        ],
        turn: idleTurn,
      };

    case "open_higher": {
      const card = drawCard(state, "higher_self");
      return { ...state, turn: { phase: "higher", face: null, card } };
    }

    case "complete_higher": {
      const card = state.turn.card;
      if (!card) return state;
      const entries = [
        entry(state, {
          type: "higher_self",
          cardTitle: card.title,
          prompt: card.question,
          text: action.answer.trim(),
        }),
      ];
      if (action.insight.trim()) {
        entries.push(
          entry(state, { type: "insight", cardTitle: card.title, prompt: "Инсайт", text: action.insight.trim() }),
        );
      }
      return {
        ...state,
        tokens: state.tokens + INSIGHT_TOKEN_REWARD,
        tokensEarned: state.tokensEarned + INSIGHT_TOKEN_REWARD,
        seenCardIds: [...state.seenCardIds, card.id],
        diary: [...state.diary, ...entries],
        turn: idleTurn,
      };
    }

    case "advance": {
      const t = state.level;
      if (t >= 6) return state;
      const to = (t + 1) as LevelId;
      const cost = to === 6 ? 5 : 3;
      let flagType: DiaryEntryType | null = null;
      let prompt = "";
      if (t === 3) {
        flagType = "program";
        prompt = "Какая программа теряет надо мной власть?";
      } else if (t === 4) {
        flagType = "new_belief";
        prompt = "Новая установка вместо старой";
      } else if (t === 5) {
        flagType = "mission";
        prompt = "Моя миссия";
      }
      const diary = [...state.diary];
      if (flagType && action.input.trim()) {
        diary.push(entry(state, { type: flagType, prompt, text: action.input.trim(), level: t }));
      }
      return {
        ...state,
        level: to,
        tokens: state.tokens - cost,
        diary,
        flags: {
          ...state.flags,
          newBelief: state.flags.newBelief || t === 4,
          mission: state.flags.mission || t === 5,
        },
        stage: to === 6 ? "finale" : "board",
        turn: idleTurn,
      };
    }

    case "enter_finale":
      return { ...state, stage: "finale" };

    case "save_letter":
      return {
        ...state,
        diary: [
          ...state.diary.filter((d) => d.type !== "letter"),
          entry(state, { type: "letter", prompt: "Письмо себе", text: action.text.trim() }),
        ],
        flags: { ...state.flags, letterDone: true },
      };

    case "save_intention":
      return {
        ...state,
        diary: [
          ...state.diary.filter((d) => d.type !== "intention"),
          entry(state, {
            type: "intention",
            prompt: "Намерение на 7 дней: какой один шаг ты сделаешь в реальной жизни?",
            text: action.text.trim(),
          }),
        ],
        flags: { ...state.flags, intentionDone: true },
      };

    case "finish":
      return { ...state, stage: "done", finishedAt: Date.now() };

    case "add_checkin":
      return {
        ...state,
        diary: [
          ...state.diary,
          entry(state, {
            type: "checkin",
            prompt: "Что сегодня показала тебе твоя реальность?",
            text: action.text.trim(),
          }),
        ],
      };

    case "cancel_turn":
      return { ...state, turn: idleTurn };

    case "reset":
      return freshState(newSeed(), Date.now());

    default:
      return state;
  }
}
