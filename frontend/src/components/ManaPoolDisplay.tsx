import type { ManaPool } from "../../../shared/types";

type ManaPoolDisplayProps = {
  manaPool: ManaPool;
};

const manaSymbols = [
  { key: "W", label: "⚪" },
  { key: "U", label: "🔵" },
  { key: "B", label: "⚫" },
  { key: "R", label: "🔴" },
  { key: "G", label: "🟢" },
  { key: "C", label: "◇" },
] as const;

export function ManaPoolDisplay({ manaPool }: ManaPoolDisplayProps) {
  return (
    <section className="mana-pool-display">
      {manaSymbols.map((mana) => (
        <div className="mana-pool-item" key={mana.key}>
          <strong>{manaPool[mana.key]}</strong>
          <span>{mana.label}</span>
        </div>
      ))}
    </section>
  );
}