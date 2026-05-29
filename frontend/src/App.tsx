import { useState } from "react";
import { DeckInput } from "./components/DeckInput";
import { HandView } from "./components/HandView";
import { parseDeckList } from "./utils/deckParser";
import { shuffle } from "./utils/shuffle";

function App() {
  const [deckText, setDeckText] = useState("");
  const [deck, setDeck] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);

  function handleImportDeck() {
    const parsedDeck = parseDeckList(deckText);
    setDeck(parsedDeck);
    setHand([]);
  }

  function handleDrawOpeningHand() {
    const shuffledDeck = shuffle(deck);
    setHand(shuffledDeck.slice(0, 7));
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Magic Deck Simulator</h1>

      <DeckInput
        value={deckText}
        onChange={setDeckText}
        onImport={handleImportDeck}
      />

      <p>Imported cards: {deck.length}</p>

      <button disabled={deck.length < 7} onClick={handleDrawOpeningHand}>
        Draw opening hand
      </button>

      <HandView cards={hand} />

    </main>
  );
}

export default App;