import type { CardData } from "../../../shared/types";
import { Battlefield } from "./Battlefield";
import { HandZone } from "./HandZone";

type GameBoardProps = {
  hand: string[];
  lands: string[];
  permanents: string[];
  cardData: Record<string, CardData>;
  onPlayCard: (cardName: string) => void;
};

export function GameBoard({
  hand,
  lands,
  permanents,
  cardData,
  onPlayCard,
}: GameBoardProps) {
  return (
    <section className="game-board">
      <Battlefield lands={lands} permanents={permanents} cardData={cardData} />
      <HandZone cards={hand} cardData={cardData} onPlayCard={onPlayCard} />
    </section>
  );
}