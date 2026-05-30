import type { CardData } from "../../../shared/types";
import { Battlefield } from "./Battlefield";
import { HandZone } from "./HandZone";

type GameBoardProps = {
  hand: string[];
  lands: string[];
  permanents: string[];
  cardData: Record<string, CardData>;
  onPlayCard: (cardName: string) => void;
  onSelectBottomCard: (cardName: string) => void;
  isChoosingBottomCards: boolean;
};

export function GameBoard({
  hand,
  lands,
  permanents,
  cardData,
  onPlayCard,
  onSelectBottomCard,
  isChoosingBottomCards,
}: GameBoardProps) {
  return (
    <section className="game-board">
      <Battlefield lands={lands} permanents={permanents} cardData={cardData} />

      <HandZone
        cards={hand}
        cardData={cardData}
        onPlayCard={onPlayCard}
        onSelectBottomCard={onSelectBottomCard}
        isChoosingBottomCards={isChoosingBottomCards}
      />
    </section>
  );
}