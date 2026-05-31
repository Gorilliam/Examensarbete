import { useState } from "react";
import { DeckInput } from "./components/DeckInput";
import { parseDeckList } from "./utils/deckParser";
import { GameBoard } from "./components/GameBoard";
import { fetchCardByName } from "./api/cards";
import { MulliganOverlay } from "./components/MulliganOverlay";
import { useMulligan } from "./hooks/useMulligan";
import { useRamp } from "./hooks/useRamp";
import { useGameActions } from "./hooks/useGameActions";
import {RampSelector} from "./components/RampSelector";
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

  const {
  pendingRampSpell,
  startRampResolution,
  getValidRampTargets,
  resolveRamp,
  resetRamp,
} = useRamp({
  deck,
  cardData,
  setDeck,
  setLands,
  setGraveyard,
});

const {
  drawOpeningHand,
  nextTurn,
  playCard,
} = useGameActions({
  deck,
  originalDeck,
  hand,
  cardData,
  landPlayedThisTurn,
  mulliganPhase,
  pendingRampSpell,
  setDeck,
  setHand,
  setLands,
  setPermanents,
  setGraveyard,
  setTurn,
  setLandPlayedThisTurn,
  startMulliganFlow,
  resetRamp,
  startRampResolution,
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
    resetRamp();

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

      <button disabled={deck.length === 0} onClick={nextTurn}>
        Next turn
      </button>

      <button disabled={originalDeck.length < 7 } onClick={drawOpeningHand}>
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

{pendingRampSpell && (
  <RampSelector
    pendingRampSpell={pendingRampSpell}
    targets={getValidRampTargets()}
    cardData={cardData}
    onSelectTarget={resolveRamp}
  />
)}

      <GameBoard
        hand={hand}
        lands={lands}
        permanents={permanents}
        graveyard={graveyard}
        cardData={cardData}
        onPlayCard={playCard}
        onSelectBottomCard={selectBottomCard}
        isChoosingBottomCards={mulliganPhase === "choosing_bottom"}
        selectedBottomCards={selectedBottomCards}
      />
    </main>
  );
}

export default App;