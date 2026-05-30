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