import type { CardData } from "../../../shared/types";
import { Battlefield } from "./Battlefield";
import { HandZone } from "./HandZone";

type GameBoardProps = {
  hand: string[];
  lands: string[];
  permanents: string[];
  graveyard: string[];
  cardData: Record<string, CardData>;
  onPlayCard: (cardName: string) => void;
  onSelectBottomCard: (cardIndex: number) => void;
  isChoosingBottomCards: boolean;
  selectedBottomCards: number[];
};

export function GameBoard({
  hand,
  lands,
  permanents,
  graveyard,
  cardData,
  onPlayCard,
  onSelectBottomCard,
  isChoosingBottomCards,
  selectedBottomCards,
}: GameBoardProps) {
  return (
    <section className="game-board">
      <Battlefield lands={lands} permanents={permanents} graveyard={graveyard} cardData={cardData} />

      <HandZone
        cards={hand}
        cardData={cardData}
        onPlayCard={onPlayCard}
        onSelectBottomCard={onSelectBottomCard}
        isChoosingBottomCards={isChoosingBottomCards}
        selectedBottomCards={selectedBottomCards}
      />
    </section>
  );
}