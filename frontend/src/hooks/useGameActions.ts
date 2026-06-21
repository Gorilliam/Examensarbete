import type { Dispatch, SetStateAction } from "react";
import type { CardData, BattlefieldCard } from "../../../shared/types";
import { shuffle } from "../utils/shuffle";
import { getDrawAmount, getRampTargetTypes } from "../utils/cardEffects";
import type { MulliganPhase } from "./useMulligan";
import type { RampTargetType } from "../utils/cardEffects";

type UseGameActionsProps = {
  deck: string[];
  originalDeck: string[];
  hand: string[];
  cardData: Record<string, CardData>;
  landPlayedThisTurn: boolean;
  mulliganPhase: MulliganPhase;
  pendingRampSpell: string | null;
  canPayManaCost: (manaCost: string) => boolean;
  payManaCost: (manaCost: string) => boolean;

  setDeck: Dispatch<SetStateAction<string[]>>;
  setHand: Dispatch<SetStateAction<string[]>>;
  setLands: Dispatch<SetStateAction<BattlefieldCard[]>>;
  setPermanents: Dispatch<SetStateAction<string[]>>;
  setGraveyard: Dispatch<SetStateAction<string[]>>;
  setTurn: Dispatch<SetStateAction<number>>;
  setLandPlayedThisTurn: Dispatch<SetStateAction<boolean>>;

  startMulliganFlow: () => void;
  resetRamp: () => void;
  resetMana: () => void;
  startRampResolution: (
    spellName: string,
    targetTypes: RampTargetType[]
  ) => void;
};

export function useGameActions({
  deck,
  originalDeck,
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
  resetMana,
  startRampResolution,
  canPayManaCost,
  payManaCost,
}: UseGameActionsProps) {
  function drawOpeningHand() {
    const shuffledDeck = shuffle(originalDeck);

    setHand(shuffledDeck.slice(0, 7));
    setDeck(shuffledDeck.slice(7));
    setLands([]);
    setPermanents([]);
    setGraveyard([]);
    setTurn(1);
    setLandPlayedThisTurn(false);
    resetRamp();
    resetMana();
    startMulliganFlow();
  }

  function nextTurn() {
    if (deck.length === 0) {
      return;
    }

    const [drawnCard, ...remainingDeck] = deck;

    setHand((currentHand) => [...currentHand, drawnCard]);
    setDeck(remainingDeck);
    setTurn((currentTurn) => currentTurn + 1);
    setLandPlayedThisTurn(false);
    resetMana();
  }

  function playCard(cardName: string) {
    if (mulliganPhase !== "complete" || pendingRampSpell) {
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

    if (!isLand && !canPayManaCost(card.manaCost)) {
      alert("Not enough mana.");
      return;
    }

    if (!isLand) {
      const paymentSuccessful = payManaCost(card.manaCost);

      if (!paymentSuccessful) {
        return;
      }
    }

    setHand((currentHand) => {
      const cardIndex = currentHand.findIndex((name) => name === cardName);

      if (cardIndex === -1) {
        return currentHand;
      }

      return currentHand.filter((_, index) => index !== cardIndex);
    });

    if (isLand) {
      setLands((currentLands) => [
        ...currentLands,
        {
          id: crypto.randomUUID(),
          name: cardName,
        },
      ]);

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
        setGraveyard((currentGraveyard) => [...currentGraveyard, cardName]);
        return;
      }

      const rampTargetTypes = getRampTargetTypes(card.oracleText);

      if (rampTargetTypes) {
        startRampResolution(cardName, rampTargetTypes);
        return;
      }

      setGraveyard((currentGraveyard) => [...currentGraveyard, cardName]);
      return;
    }

    setPermanents((currentPermanents) => [...currentPermanents, cardName]);
  }

  return {
    drawOpeningHand,
    nextTurn,
    playCard,
  };
}