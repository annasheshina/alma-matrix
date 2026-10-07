import { GameProvider } from "@/lib/game/GameProvider";
import DiaryView from "@/components/DiaryView";

export default function DiaryPage() {
  return (
    <GameProvider>
      <DiaryView />
    </GameProvider>
  );
}
