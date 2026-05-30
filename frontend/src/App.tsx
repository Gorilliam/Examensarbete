import { useState } from "react";
import { DeckInput } from "./components/DeckInput";
import { parseDeckList } from "./utils/deckParser";
import { shuffle } from "./utils/shuffle";
import { GameBoard } from "./components/GameBoard";
import { fetchCardByName } from "./api/cards";
import { MulliganOverlay } from "./components/MulliganOverlay";
import { useMulligan } from "./hooks/useMulligan";
import {getDrawAmount} from "./utils/cardEffects";
import "./App.css";

import type { CardData } from "../../shared/types";

function App() {
  const [deckText, setDeckText] = useState("");
  const [deck, setDeck] = useState<string[]>([]);
  const [originalDeck, setOriginalDeck] = useState<string[]>([]);
  const [importedDeckSize, setImportedDeckSize] = useState(0);
  const [hand, setHand] = useState<string[]>([]);
  const [cardData, setCardData] = useState<Record<string, CardData>>({});
  const [lands, setLands] = useState<string[]>([]);
  const [permanents, setPermanents] = useState<string[]>([]);
  const [graveyard, setGraveyard] = useState<string[]>([]);
  const [turn, setTurn] = useState(1);
  const [landPlayedThisTurn, setLandPlayedThisTurn] = useState(false);
  

  const {
    mulliganPhase,
    mulliganCount,
    selectedBottomCards,
    selectBottomCard,
    confirmBottomCards,
    startMulliganFlow,
    resetMulliganFlow,
    takeMulligan,
    keepHand,
  } = useMulligan({
    deck,
    hand,
    setDeck,
    setHand,
  });

  async function handleImportDeck() {
    const parsedDeck = parseDeckList(deckText);

    setDeck(parsedDeck);
    setOriginalDeck(parsedDeck);
    setImportedDeckSize(parsedDeck.length);
    setHand([]);
    setLands([]);
    setPermanents([]);
    setGraveyard([]);
    setTurn(1);
    setLandPlayedThisTurn(false);
    resetMulliganFlow();

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
    const shuffledDeck = shuffle(originalDeck);

    const openingHand = shuffledDeck.slice(0, 7);
    const remainingLibrary = shuffledDeck.slice(7);

    setHand(openingHand);
    setDeck(remainingLibrary);
    setTurn(1);
    setLands([]);
    setPermanents([]);
    setGraveyard([]);
    setLandPlayedThisTurn(false);
    startMulliganFlow();
  }

  function handleNextTurn() {
    if (deck.length > 0) {
      const [drawnCard, ...remainingDeck] = deck;

      setHand((currentHand) => [...currentHand, drawnCard]);
      setDeck(remainingDeck);
    }

    setTurn((currentTurn) => currentTurn + 1);
    setLandPlayedThisTurn(false);
  }

function handlePlayCard(cardName: string) {
  if (mulliganPhase !== "complete") {
    return;
  }

  const card = cardData[cardName];

  if (!card) {
    return;
  }

  const typeLine = card.typeLine.toLowerCase();

  const isLand = typeLine.includes("land");
  const isInstantOrSorcery =
    typeLine.includes("instant") || typeLine.includes("sorcery");

  if (isLand && landPlayedThisTurn) {
    alert("You can only play one land per turn.");
    return;
  }

  setHand((currentHand) => {
    const cardIndex = currentHand.findIndex((name) => name === cardName);

    if (cardIndex === -1) {
      return currentHand;
    }

    return currentHand.filter((_, index) => index !== cardIndex);
  });

  if (isLand) {
    setLands((currentLands) => [...currentLands, cardName]);
    setLandPlayedThisTurn(true);
    return;
  }

if (isInstantOrSorcery) {
  const drawAmount = getDrawAmount(card.oracleText);

  if (drawAmount) {
    const drawnCards = deck.slice(0, drawAmount);
    const remainingDeck = deck.slice(drawAmount);

    setHand((currentHand) => [...currentHand, ...drawnCards]);
    setDeck(remainingDeck);
  }

  setGraveyard((currentGraveyard) => [...currentGraveyard, cardName]);
  return;
}

  setPermanents((currentPermanents) => [...currentPermanents, cardName]);
}

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Magic Deck Simulator</h1>

      <DeckInput
        value={deckText}
        onChange={setDeckText}
        onImport={handleImportDeck}
      />

      <p>Imported cards: {importedDeckSize}</p>
      <p>Turn: {turn}</p>
      <p>Cards in library: {deck.length}</p>
      <p>Land played this turn: {landPlayedThisTurn ? "Yes" : "No"}</p>

      <button disabled={deck.length === 0} onClick={handleNextTurn}>
        Next turn
      </button>

      <button disabled={originalDeck.length < 7 } onClick={handleDrawOpeningHand}>
        Draw opening hand
      </button>

      {mulliganPhase !== "not_started" && mulliganPhase !== "complete" && (
      <MulliganOverlay
        phase={mulliganPhase}
        mulliganCount={mulliganCount}
        selectedBottomCards={selectedBottomCards}
        onMulligan={takeMulligan}
        onKeep={keepHand}
        onConfirmBottomCards={confirmBottomCards}
      />
      )}

      <GameBoard
        hand={hand}
        lands={lands}
        permanents={permanents}
        graveyard={graveyard}
        cardData={cardData}
        onPlayCard={handlePlayCard}
        onSelectBottomCard={selectBottomCard}
        isChoosingBottomCards={mulliganPhase === "choosing_bottom"}
        selectedBottomCards={selectedBottomCards}
      />
    </main>
  );
}

export default App;