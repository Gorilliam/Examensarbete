import type { CardData } from "../../../shared/types";
import { Battlefield } from "./Battlefield";
import { HandZone } from "./HandZone";

type GameBoardProps = {
  hand: string[];
  lands: string[];
  permanents: string[];
  cardData: Record<string, CardData>;
};

export function GameBoard({
  hand,
  lands,
  permanents,
  cardData,
}: GameBoardProps) {
  return (
    <section className="game-board">
      <Battlefield lands={lands} permanents={permanents} />
      <HandZone cards={hand} cardData={cardData} />
    </section>
  );
}