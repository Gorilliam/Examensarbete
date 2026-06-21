import { useState } from "react";
import type {
  CardData,
  BattlefieldCard,
  ManaColor,
  ManaPool,
} from "../../../shared/types";
import { emptyManaPool } from "../../../shared/types";

type UseManaProps = {
  cardData: Record<string, CardData>;
};

export function useMana({ cardData }: UseManaProps) {
  const [manaPool, setManaPool] = useState<ManaPool>(emptyManaPool);
  const [tappedCards, setTappedCards] = useState<string[]>([]);
  const [pendingManaSource, setPendingManaSource] =
    useState<BattlefieldCard | null>(null);

  function addMana(color: ManaColor, amount = 1) {
    setManaPool((currentPool) => ({
      ...currentPool,
      [color]: currentPool[color] + amount,
    }));
  }

  function getProducedMana(cardName: string, oracleText: string) {
    if (cardName === "Sol Ring") {
      return { color: "C" as ManaColor, amount: 2 };
    }

    const matches = oracleText.match(/\{([WUBRGC])\}/g);

    if (!matches) {
      return null;
    }

    const symbol = matches[0].replace("{", "").replace("}", "") as ManaColor;

    return {
      color: symbol,
      amount: matches.length,
    };
  }

  function tapForMana(card: BattlefieldCard) {
    if (tappedCards.includes(card.id)) {
      return;
    }

    const cardInfo = cardData[card.name];

    if (!cardInfo) {
      return;
    }

    const oracleText = cardInfo.oracleText;

    if (oracleText.toLowerCase().includes("any color")) {
      setPendingManaSource(card);
      return;
    }

    const producedMana = getProducedMana(card.name, oracleText);

    if (!producedMana) {
      return;
    }

    addMana(producedMana.color, producedMana.amount);

    setTappedCards((currentTappedCards) => [
      ...currentTappedCards,
      card.id,
    ]);
  }

  function chooseManaColor(color: Exclude<ManaColor, "C">) {
    if (!pendingManaSource) {
      return;
    }

    addMana(color, 1);

    setTappedCards((currentTappedCards) => [
      ...currentTappedCards,
      pendingManaSource.id,
    ]);

    setPendingManaSource(null);
  }

  function resetMana() {
    setManaPool(emptyManaPool);
    setTappedCards([]);
    setPendingManaSource(null);
  }

  function canPayManaCost(manaCost: string) {
    const cost = parseManaCost(manaCost);
    const poolCopy = { ...manaPool };

    for (const color of ["W", "U", "B", "R", "G"] as const) {
      if (poolCopy[color] < cost[color]) {
        return false;
      }

      poolCopy[color] -= cost[color];
    }

    const availableGenericMana =
      poolCopy.W +
      poolCopy.U +
      poolCopy.B +
      poolCopy.R +
      poolCopy.G +
      poolCopy.C;

    return availableGenericMana >= cost.generic;
  }

  function payManaCost(manaCost: string) {
    if (!canPayManaCost(manaCost)) {
      return false;
    }

    const cost = parseManaCost(manaCost);

    setManaPool((currentPool) => {
      const updatedPool = { ...currentPool };

      for (const color of ["W", "U", "B", "R", "G"] as const) {
        updatedPool[color] -= cost[color];
      }

      let genericToPay = cost.generic;

      for (const color of ["C", "W", "U", "B", "R", "G"] as const) {
        const amountToSpend = Math.min(updatedPool[color], genericToPay);
        updatedPool[color] -= amountToSpend;
        genericToPay -= amountToSpend;

        if (genericToPay === 0) {
          break;
        }
      }

      return updatedPool;
    });

    return true;
  }

  return {
    manaPool,
    tappedCards,
    pendingManaSource: pendingManaSource?.name ?? null,
    tapForMana,
    chooseManaColor,
    resetMana,
    canPayManaCost,
    payManaCost,
  };
}

function parseManaCost(manaCost: string) {
  const cost = {
    generic: 0,
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
  };

  const matches = manaCost.match(/\{[^}]+\}/g) ?? [];

  matches.forEach((symbol) => {
    const value = symbol.replace("{", "").replace("}", "");

    if (/^\d+$/.test(value)) {
      cost.generic += Number(value);
      return;
    }

    if (value === "W") cost.W += 1;
    if (value === "U") cost.U += 1;
    if (value === "B") cost.B += 1;
    if (value === "R") cost.R += 1;
    if (value === "G") cost.G += 1;
  });

  return cost;
}