import type { CubeFace, CubeFaceId } from "@/lib/game/types";

export const CUBE_FACES: Record<CubeFaceId, CubeFace> = {
  mirror: {
    id: "mirror",
    name: "Зеркало",
    tagline: "Открыть карту Программы",
    deck: "programs",
  },
  key: {
    id: "key",
    name: "Ключ",
    tagline: "Открыть карту Вторичной выгоды",
    deck: "secondary_benefits",
  },
  challenge: {
    id: "challenge",
    name: "Вызов",
    tagline: "Открыть карту Кармического урока",
    deck: "karmic_lessons",
  },
  sign: {
    id: "sign",
    name: "Знак",
    tagline: "Открыть карту Подсказки мира",
    deck: "world_signs",
  },
  flow: {
    id: "flow",
    name: "Поток",
    tagline: "Шаг вперёд — без анализа",
  },
  silence: {
    id: "silence",
    name: "Тишина",
    tagline: "Одна минута тишины",
  },
};

export const CUBE_FACE_ORDER: CubeFaceId[] = [
  "mirror",
  "flow",
  "key",
  "challenge",
  "sign",
  "silence",
];
