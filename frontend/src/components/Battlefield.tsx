import type { CardData } from "../../../shared/types";

type BattlefieldProps = {
  lands: string[];
  permanents: string[];
  graveyard: string[];
  cardData: Record<string, CardData>;
};

export function Battlefield({ lands, permanents, graveyard, cardData }: BattlefieldProps) {
  function renderCard(card: string, index: number) {
    const data = cardData[card];

    return (
      <div className="battlefield-card" key={`${card}-${index}`}>
        {data?.imageUrl ? (
          <img src={data.imageUrl} alt={data.name} className="card-image" />
        ) : (
          <span>{card}</span>
        )}
      </div>
    );
  }

  return (
    <div className="battlefield">
      <div className="permanents-zone">
        <h3>Permanents</h3>
        <div className="permanent-grid">
          {permanents.map(renderCard)}
        </div>
      </div>
    
      <div className="lands-zone">
        <h3>Lands</h3>
        <div className="land-grid">
          {lands.map(renderCard)}
        </div>
      </div>
      <div className="graveyard-zone">
        <h3>Graveyard</h3>
        <div className="graveyard-grid">
          {graveyard.map(renderCard)}
        </div>
      </div>
    </div>
  );
}