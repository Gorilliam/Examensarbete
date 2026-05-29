type HandViewProps = {
  cards: string[];
};

export function HandView({ cards }: HandViewProps) {
  if (cards.length === 0) return null;

  return (
    <section>
      <h2>Öppningshand</h2>

      <ul>
        {cards.map((card, index) => (
          <li key={`${card}-${index}`}>{card}</li>
        ))}
      </ul>
    </section>
  );
}