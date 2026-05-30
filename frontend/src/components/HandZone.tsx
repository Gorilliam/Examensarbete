import type { CardData } from "../../../shared/types";

type HandZoneProps = {
  cards: string[];
  cardData?: Record<string, CardData>;
  onPlayCard: (cardName: string) => void;
};

export function HandZone({ cards, cardData = {}, onPlayCard }: HandZoneProps) {
  return (
    <div className="hand-zone">
      {cards.map((card, index) => {
        const data = cardData[card];

        const middle = (cards.length - 1) / 2;
        const offset = index - middle;
        const rotation = offset * 6;

        return (
          <div
            className="hand-card"
            key={`${card}-${index}`}
            onClick={() => onPlayCard(card)}
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