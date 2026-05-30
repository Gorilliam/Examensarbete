import { useState } from "react";
import { shuffle } from "../utils/shuffle";

export type MulliganPhase =
  | "not_started"
  | "reviewing_hand"
  | "choosing_bottom"
  | "complete";

type UseMulliganProps = {
  deck: string[];
  hand: string[];
  setDeck: React.Dispatch<React.SetStateAction<string[]>>;
  setHand: React.Dispatch<React.SetStateAction<string[]>>;
};

export function useMulligan({
  deck,
  hand,
  setDeck,
  setHand,
}: UseMulliganProps) {
  const [mulliganPhase, setMulliganPhase] =
    useState<MulliganPhase>("not_started");

  const [mulliganCount, setMulliganCount] = useState(0);
  const [selectedBottomCards, setSelectedBottomCards] = useState<number[]>([]);

  function startMulliganFlow() {
    setMulliganCount(0);
    setSelectedBottomCards([]);
    setMulliganPhase("reviewing_hand");
  }

  function resetMulliganFlow() {
    setMulliganCount(0);
    setSelectedBottomCards([]);
    setMulliganPhase("not_started");
  }

  function takeMulligan() {
    if (mulliganCount >= 6) {
      return;
    }

    const reshuffledDeck = shuffle([...deck, ...hand]);

    setHand(reshuffledDeck.slice(0, 7));
    setDeck(reshuffledDeck.slice(7));
    setMulliganCount((currentCount) => currentCount + 1);
    setSelectedBottomCards([]);
    setMulliganPhase("reviewing_hand");
  }

  function keepHand() {
    if (mulliganCount === 0) {
      setMulliganPhase("complete");
      return;
    }

    setMulliganPhase("choosing_bottom");
  }

function selectBottomCard(cardIndex: number) {
  if (mulliganPhase !== "choosing_bottom") {
    return;
  }

  setSelectedBottomCards((currentIndexes) => {
    const alreadySelected = currentIndexes.includes(cardIndex);

    if (alreadySelected) {
      return currentIndexes.filter((index) => index !== cardIndex);
    }

    if (currentIndexes.length >= mulliganCount) {
      return currentIndexes;
    }

    return [...currentIndexes, cardIndex];
  });
}

function confirmBottomCards() {
  if (selectedBottomCards.length !== mulliganCount) {
    return;
  }

  const bottomCards = selectedBottomCards.map((index) => hand[index]);

  const updatedHand = hand.filter(
    (_, index) => !selectedBottomCards.includes(index)
  );

  setHand(updatedHand);
  setDeck((currentDeck) => [...currentDeck, ...bottomCards]);
  setSelectedBottomCards([]);
  setMulliganPhase("complete");
}

  return {
    mulliganPhase,
    mulliganCount,
    selectedBottomCards,
    startMulliganFlow,
    resetMulliganFlow,
    takeMulligan,
    keepHand,
    selectBottomCard,
    confirmBottomCards,
  };
}