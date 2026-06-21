import type { CardData, BattlefieldCard } from "../../../shared/types";

type BattlefieldProps = {
  lands: BattlefieldCard[];
  permanents: string[];
  graveyard: string[];
  cardData: Record<string, CardData>;
  tappedCards: string[];
  onTapForMana: (card: BattlefieldCard) => void;
};

export function Battlefield({
  lands,
  permanents,
  graveyard,
  cardData,
  tappedCards,
  onTapForMana,
}: BattlefieldProps) {
  function renderLand(card: BattlefieldCard) {
    const data = cardData[card.name];
    const isTapped = tappedCards.includes(card.id);

    return (
      <div
        className={`battlefield-card ${isTapped ? "tapped-card" : ""}`}
        key={card.id}
        onClick={() => onTapForMana(card)}
      >
        {data?.imageUrl ? (
          <img src={data.imageUrl} alt={data.name} className="card-image" />
        ) : (
          <span>{card.name}</span>
        )}
      </div>
    );
  }

  function renderCard(cardName: string, index: number) {
    const data = cardData[cardName];

    return (
      <div className="battlefield-card" key={`${cardName}-${index}`}>
        {data?.imageUrl ? (
          <img src={data.imageUrl} alt={data.name} className="card-image" />
        ) : (
          <span>{cardName}</span>
        )}
      </div>
    );
  }

  return (
    <div className="battlefield">
      <div className="permanents-zone">
        <h3>Permanents</h3>
        <div className="permanent-grid">
          {permanents.map((card, index) => renderCard(card, index))}
        </div>
      </div>

      <div className="lands-zone">
        <h3>Lands</h3>
        <div className="land-grid">{lands.map(renderLand)}</div>
      </div>

      <div className="graveyard-zone">
        <h3>Graveyard</h3>
        <div className="graveyard-grid">
          {graveyard.map((card, index) => renderCard(card, index))}
        </div>
      </div>
    </div>
  );
}