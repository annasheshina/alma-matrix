import { GameProvider } from "@/lib/game/GameProvider";
import PlayRoot from "@/components/play/PlayRoot";

export default function PlayPage() {
  return (
    <GameProvider>
      <PlayRoot />
    </GameProvider>
  );
}
