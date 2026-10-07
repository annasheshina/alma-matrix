import {
  Eye,
  Waves,
  KeyRound,
  Zap,
  Sparkles,
  Feather,
  BookOpen,
  Coins,
  HandHeart,
  Compass,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { CubeFaceId, DeckId } from "@/lib/game/types";

const FACE_ICONS: Record<CubeFaceId, LucideIcon> = {
  mirror: Eye,
  flow: Waves,
  key: KeyRound,
  challenge: Zap,
  sign: Sparkles,
  silence: Feather,
};

const DECK_ICONS: Record<DeckId, LucideIcon> = {
  programs: Eye,
  secondary_benefits: Coins,
  karmic_lessons: Compass,
  world_signs: Star,
  higher_self: Sparkles,
};

export function FaceGlyph({
  face,
  size = 28,
  strokeWidth = 1.2,
  className,
}: {
  face: CubeFaceId;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = FACE_ICONS[face];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
}

export function DeckGlyph({
  deck,
  size = 28,
  strokeWidth = 1.2,
  className,
}: {
  deck: DeckId;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = DECK_ICONS[deck];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
}

export function WellGlyph({ size = 28 }: { size?: number }) {
  return <BookOpen size={size} strokeWidth={1.1} />;
}

export function SupportGlyph({ size = 20 }: { size?: number }) {
  return <HandHeart size={size} strokeWidth={1.2} />;
}
