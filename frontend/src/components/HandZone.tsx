type HandZoneProps = {
  cards: string[];
};

export function HandZone({ cards }: HandZoneProps) {
  return (
    <div className="hand-zone">
      {cards.map((card, index) => {
        const middle = (cards.length - 1) / 2;
        const offset = index - middle;
        const rotation = offset * 6;

        return (
          <div
            className="hand-card"
            key={`${card}-${index}`}
            style={{
              transform: `rotate(${rotation}deg) translateY(${Math.abs(offset) * 6}px)`,
              zIndex: index,
            }}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
}