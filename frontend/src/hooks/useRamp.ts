import { useState, type Dispatch, type SetStateAction } from "react";
import type { CardData } from "../../../shared/types";
import type { RampTargetType } from "../utils/cardEffects";

type UseRampProps = {
  deck: string[];
  cardData: Record<string, CardData>;
  setDeck: Dispatch<SetStateAction<string[]>>;
  setLands: Dispatch<SetStateAction<string[]>>;
  setGraveyard: Dispatch<SetStateAction<string[]>>;
};

export function useRamp({
  deck,
  cardData,
  setDeck,
  setLands,
  setGraveyard,
}: UseRampProps) {
  const [pendingRampSpell, setPendingRampSpell] = useState<string | null>(null);
  const [rampTargetTypes, setRampTargetTypes] = useState<RampTargetType[]>([]);

  function startRampResolution(
    spellName: string,
    targetTypes: RampTargetType[]
  ) {
    setPendingRampSpell(spellName);
    setRampTargetTypes(targetTypes);
  }

  function getValidRampTargets() {
    return deck.filter((cardName) => {
      const card = cardData[cardName];

      if (!card) {
        return false;
      }

      const typeLine = card.typeLine.toLowerCase();

      if (!typeLine.includes("land")) {
        return false;
      }

      if (rampTargetTypes.includes("land")) {
        return true;
      }

      if (
        rampTargetTypes.includes("basic-land") &&
        typeLine.includes("basic")
      ) {
        return true;
      }

      return rampTargetTypes.some((targetType) =>
        typeLine.includes(targetType)
      );
    });
  }

  function resolveRamp(targetCardName: string) {
    if (!pendingRampSpell) {
      return;
    }

    const targetIndex = deck.findIndex(
      (cardName) => cardName === targetCardName
    );

    if (targetIndex === -1) {
      return;
    }

    const targetCard = deck[targetIndex];

    setDeck((currentDeck) =>
      currentDeck.filter((_, index) => index !== targetIndex)
    );

    setLands((currentLands) => [...currentLands, targetCard]);
    setGraveyard((currentGraveyard) => [
      ...currentGraveyard,
      pendingRampSpell,
    ]);

    setPendingRampSpell(null);
    setRampTargetTypes([]);
  }

  function resetRamp() {
    setPendingRampSpell(null);
    setRampTargetTypes([]);
  }

  return {
    pendingRampSpell,
    startRampResolution,
    getValidRampTargets,
    resolveRamp,
    resetRamp,
  };
}