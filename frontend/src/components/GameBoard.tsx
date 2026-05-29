import { Battlefield } from "./Battlefield";
import { HandZone } from "./HandZone";

type GameBoardProps = {
  hand: string[];
  lands: string[];
  permanents: string[];
};

export function GameBoard({ hand, lands, permanents }: GameBoardProps) {
  return (
    <section className="game-board">
      <Battlefield lands={lands} permanents={permanents} />
      <HandZone cards={hand} />
    </section>
  );
}