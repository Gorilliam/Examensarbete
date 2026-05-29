type DeckInputProps = {
  value: string;
  onChange: (value: string) => void;
  onImport: () => void;
};

export function DeckInput({ value, onChange, onImport }: DeckInputProps) {
  return (
    <section>
      <h2>Import deck</h2>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={12}
        cols={50}
        placeholder={`1 Sol Ring\n1 Arcane Signet\n1 Nature's Lore`}
      />

      <br />

      <button onClick={onImport}>Import deck</button>
    </section>
  );
}