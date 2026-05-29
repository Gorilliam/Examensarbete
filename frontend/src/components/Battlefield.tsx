type BattlefieldProps = {
  lands: string[];
  permanents: string[];
};

export function Battlefield({ lands, permanents }: BattlefieldProps) {
  return (
    <div className="battlefield">
      <div className="permanents-zone">
        <h3>Permanents</h3>

        <div className="permanent-grid">
          {permanents.map((card, index) => (
            <div className="battlefield-card" key={`${card}-${index}`}>
              {card}
            </div>
          ))}
        </div>
      </div>

      <div className="lands-zone">
        <h3>Lands</h3>

        <div className="land-grid">
          {lands.map((card, index) => (
            <div className="battlefield-card land-card" key={`${card}-${index}`}>
              {card}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}