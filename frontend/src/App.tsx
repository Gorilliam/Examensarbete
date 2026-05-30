import { useState } from "react";
import { DeckInput } from "./components/DeckInput";
import { parseDeckList } from "./utils/deckParser";
import { shuffle } from "./utils/shuffle";
import { GameBoard } from "./components/GameBoard";
import { fetchCardByName } from "./api/cards";
import "./App.css";

import type { CardData } from "../../shared/types";


function App() {
  const [deckText, setDeckText] = useState("");
  const [deck, setDeck] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);
  const [cardData, setCardData] = useState<Record<string, CardData>>({});
  const [lands, setLands] = useState<string[]>([]);
  const [permanents, setPermanents] = useState<string[]>([]);

async function handleImportDeck() {
  const parsedDeck = parseDeckList(deckText);
  setDeck(parsedDeck);
  setHand([]);
  setLands([]);
  setPermanents([]);

  const uniqueCardNames = [...new Set(parsedDeck)];

  const fetchedCards = await Promise.all(
    uniqueCardNames.map(async (name) => {
      const card = await fetchCardByName(name);
      return [name, card] as const;
    })
  );

  const mappedCards = Object.fromEntries(fetchedCards);

  console.log("Fetched card data:", mappedCards);

  setCardData(mappedCards);
}

  function handleDrawOpeningHand() {
    const shuffledDeck = shuffle(deck);
    setHand(shuffledDeck.slice(0, 7));
  }


  function handlePlayCard(cardName: string) {
  const card = cardData[cardName];

  if (!card) {
    return;
  }

  setHand((currentHand) => {
    const cardIndex = currentHand.findIndex((name) => name === cardName);

    if (cardIndex === -1) {
      return currentHand;
    }

    return currentHand.filter((_, index) => index !== cardIndex);
  });

  if (card.typeLine.toLowerCase().includes("land")) {
    setLands((currentLands) => [...currentLands, cardName]);
  } else {
    setPermanents((currentPermanents) => [...currentPermanents, cardName]);
  }
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

      <GameBoard
        hand={hand}
        lands={lands}
        permanents={permanents}
        cardData={cardData}
        onPlayCard={handlePlayCard}
      />

    </main>
  );
}

export default App;