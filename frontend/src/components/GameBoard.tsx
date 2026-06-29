import type { ReactNode } from "react";
import type { CardData, BattlefieldCard } from "../../../shared/types";
import { Battlefield } from "./Battlefield";
import { HandZone } from "./HandZone";

type GameBoardProps = {
  hud: ReactNode;
  hand: string[];
  lands: BattlefieldCard[];
  permanents: string[];
  graveyard: string[];
  cardData: Record<string, CardData>;
  onPlayCard: (cardName: string) => void;
  onSelectBottomCard: (cardIndex: number) => void;
  isChoosingBottomCards: boolean;
  selectedBottomCards: number[];
  tappedCards: string[];
  onTapForMana: (card: BattlefieldCard) => void;
};

export function GameBoard({
  hud,
  hand,
  lands,
  permanents,
  graveyard,
  cardData,
  onPlayCard,
  onSelectBottomCard,
  isChoosingBottomCards,
  selectedBottomCards,
  tappedCards,
  onTapForMana,
}: GameBoardProps) {
  return (
    <section className="game-board">
      <div className="game-hud">{hud}</div>

      <Battlefield
        lands={lands}
        permanents={permanents}
        graveyard={graveyard}
        cardData={cardData}
        tappedCards={tappedCards}
        onTapForMana={onTapForMana}
      />

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