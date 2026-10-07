export type DeckId =
  | "programs"
  | "secondary_benefits"
  | "karmic_lessons"
  | "world_signs"
  | "higher_self";

export interface GameCard {
  id: string;
  deck: DeckId;
  title: string;
  epigraph: string;
  description: string;
  question: string;
}

export type CubeFaceId =
  | "mirror"
  | "flow"
  | "key"
  | "challenge"
  | "sign"
  | "silence";

export interface CubeFace {
  id: CubeFaceId;
  name: string;
  tagline: string;
  deck?: DeckId;
}

export type LevelId = 3 | 4 | 5 | 6;

export interface LevelMeta {
  id: LevelId;
  name: string;
  archetype: string;
  motto: string;
  transitionTo?: {
    cost: number;
    requirement: "program_named" | "new_belief" | "mission";
    requirementHint: string;
    ceremonyQuestion: string;
    ceremonyHint: string;
  };
}

export type DiaryEntryType =
  | "request"
  | "program"
  | "benefit"
  | "lesson"
  | "sign"
  | "insight"
  | "new_belief"
  | "higher_self"
  | "mission"
  | "letter"
  | "intention"
  | "well"
  | "silence"
  | "flow"
  | "checkin";

export interface DiaryEntry {
  id: string;
  type: DiaryEntryType;
  level: LevelId;
  cardTitle?: string;
  prompt: string;
  text: string;
  insight?: string;
  at: number;
}

export type Stage = "request" | "mode" | "board" | "finale" | "done";

export type TurnPhase =
  | "idle"
  | "rolling"
  | "fate" // показ выпавшей грани
  | "card" // карта открывается
  | "silence" // минута тишины
  | "flow" // шаг в Потоке
  | "well" // зеркальный колодец
  | "higher"; // голос высшего я

export interface TurnState {
  phase: TurnPhase;
  face: CubeFaceId | null;
  card: GameCard | null;
}

export interface GameFlags {
  programNamed: boolean;
  newBelief: boolean;
  mission: boolean;
  letterDone: boolean;
  intentionDone: boolean;
}

export interface GameState {
  version: 1;
  hydrated?: boolean;
  seed: number;
  stage: Stage;
  request: string;
  mode: "solo" | "group" | null;
  level: LevelId;
  tokens: number;
  tokensEarned: number;
  seenCardIds: string[];
  wellVisits: number;
  diary: DiaryEntry[];
  turn: TurnState;
  flags: GameFlags;
  createdAt: number;
  finishedAt: number | null;
}
