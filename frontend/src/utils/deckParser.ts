export function parseDeckList(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const match = line.match(/^(\d+)\s+(.+)$/);

      if (!match) {
         return []; 
      }

      const quantity = Number(match[1]);
      const cardName = match[2].trim();

      return Array(quantity).fill(cardName);
    });
}