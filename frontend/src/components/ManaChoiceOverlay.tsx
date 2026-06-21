import type { ManaColor } from "../../../shared/types";

type ManaChoiceOverlayProps = {
  sourceName: string;
  onChooseColor: (color: Exclude<ManaColor, "C">) => void;
};

const manaChoices = [
  { color: "W", label: "⚪ White" },
  { color: "U", label: "🔵 Blue" },
  { color: "B", label: "⚫ Black" },
  { color: "R", label: "🔴 Red" },
  { color: "G", label: "🟢 Green" },
] as const;

export function ManaChoiceOverlay({
  sourceName,
  onChooseColor,
}: ManaChoiceOverlayProps) {
  return (
    <div className="mana-choice-overlay">
      <div className="mana-choice-modal">
        <h3>{sourceName}</h3>
        <p>Choose one mana color</p>

        <div className="mana-choice-buttons">
          {manaChoices.map((choice) => (
            <button
              key={choice.color}
              onClick={() => onChooseColor(choice.color)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}