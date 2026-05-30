import type { CardData } from "../../../shared/types";

type HandZoneProps = {
  cards: string[];
  cardData?: Record<string, CardData>;
  onPlayCard: (cardName: string) => void;
  onSelectBottomCard: (cardIndex: number) => void;
  isChoosingBottomCards: boolean;
  selectedBottomCards: number[];
};

export function HandZone({
  cards,
  cardData = {},
  onPlayCard,
  onSelectBottomCard,
  isChoosingBottomCards,
  selectedBottomCards,
}: HandZoneProps) {
  return (
    <div className="hand-zone">
      {cards.map((card, index) => {
        const data = cardData[card];

        const middle = (cards.length - 1) / 2;
        const offset = index - middle;
        const rotation = offset * 6;
        const isSelectedForBottom = selectedBottomCards.includes(index);

        return (
          <div
            className={`hand-card ${isSelectedForBottom ? "selected-bottom-card" : ""}`}
            key={`${card}-${index}`}
            onClick={() => {
              if (isChoosingBottomCards) {
                onSelectBottomCard(index);
                return;
              }

              onPlayCard(card);
            }}
            style={{
              transform: `rotate(${rotation}deg) translateY(${Math.abs(offset) * 6}px)`,
              zIndex: index,
            }}
          >
            {data?.imageUrl ? (
              <img src={data.imageUrl} alt={data.name} className="card-image" />
            ) : (
              <span>{card}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}