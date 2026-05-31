import type { CardData } from "../../../shared/types";

type RampSelectorProps = {
  pendingRampSpell: string;
  targets: string[];
  cardData: Record<string, CardData>;
  onSelectTarget: (cardName: string) => void;
};

export function RampSelector({
  pendingRampSpell,
  targets,
  cardData,
  onSelectTarget,
}: RampSelectorProps) {
  return (
    <div className="ramp-selector">
      <h3>Resolve {pendingRampSpell}</h3>
      <p>Choose a land from your library</p>

      <div className="ramp-targets">
        {targets.map((target, index) => {
          const data = cardData[target];

          return (
            <button
              className="ramp-target-card"
              key={`${target}-${index}`}
              onClick={() => onSelectTarget(target)}
            >
              {data?.imageUrl ? (
                <img src={data.imageUrl} alt={data.name} />
              ) : (
                target
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}