import type { LevelId, LevelMeta } from "@/lib/game/types";

export const LEVELS: Record<LevelId, LevelMeta> = {
  3: {
    id: 3,
    name: "3D",
    archetype: "Персонаж",
    motto: "Со мной это происходит",
    transitionTo: {
      cost: 3,
      requirement: "program_named",
      requirementHint: "признай хотя бы одну программу (карта Программ с инсайтом)",
      ceremonyQuestion: "Какая программа теряет над тобой власть прямо сейчас?",
      ceremonyHint: "Назови её вслух — или запиши здесь. Названная программа уже не управляет тенью.",
    },
  },
  4: {
    id: 4,
    name: "4D",
    archetype: "Наблюдатель",
    motto: "Я вижу свои программы и паттерны",
    transitionTo: {
      cost: 3,
      requirement: "new_belief",
      requirementHint: "сформулируй новую установку вместо старой",
      ceremonyQuestion: "Какую новую установку ты выбираешь вместо старой?",
      ceremonyHint: "Одна фраза, которую ты готов(а) попробовать на себе — вместо старого «нельзя», «надо», «не получится».",
    },
  },
  5: {
    id: 5,
    name: "5D",
    archetype: "Создатель",
    motto: "Я могу выбирать и создавать",
    transitionTo: {
      cost: 5,
      requirement: "mission",
      requirementHint: "сформулируй миссию одним предложением",
      ceremonyQuestion: "Твоя миссия — одним предложением",
      ceremonyHint: "Не «правильная» формулировка, а живая: что через тебя хочет случиться в мире?",
    },
  },
  6: {
    id: 6,
    name: "6D",
    archetype: "Поток",
    motto: "Я есть поток",
  },
};

export const HIGHER_SELF_TOKEN_THRESHOLD = 5;
export const WELL_TOKEN_REWARD = 2;
export const INSIGHT_TOKEN_REWARD = 1;
