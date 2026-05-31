export function getDrawAmount(oracleText: string): number | null {
  const lowerText = oracleText.toLowerCase();

  if (lowerText.includes("draw a card")) {
    return 1;
  }

  const digitMatch = lowerText.match(/draw (\d+) cards?/);

  if (digitMatch) {
    return Number(digitMatch[1]);
  }

  const wordNumbers: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
  };

  const wordMatch = lowerText.match(/draw (one|two|three|four|five|six|seven) cards?/);

  if (wordMatch) {
    return wordNumbers[wordMatch[1]];
  }

  return null;
}


export type RampTargetType =
  | "basic-land"
  | "land"
  | "plains"
  | "island"
  | "swamp"
  | "mountain"
  | "forest";

export function getRampTargetTypes(oracleText: string): RampTargetType[] | null {
  const lowerText = oracleText.toLowerCase();

  if (!lowerText.includes("search your library")) {
    return null;
  }

  if (!lowerText.includes("land")) {
    return null;
  }

  if (lowerText.includes("basic land card")) {
    return ["basic-land"];
  }

  const types: RampTargetType[] = [];

  if (lowerText.includes("plains")) types.push("plains");
  if (lowerText.includes("island")) types.push("island");
  if (lowerText.includes("swamp")) types.push("swamp");
  if (lowerText.includes("mountain")) types.push("mountain");
  if (lowerText.includes("forest")) types.push("forest");

  if (types.length > 0) {
    return types;
  }

  if (lowerText.includes("land card")) {
    return ["land"];
  }

  return null;
}