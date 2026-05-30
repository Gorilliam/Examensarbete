import type { CardData } from "../../../shared/types";

export async function fetchCardByName(name: string): Promise<CardData> {
  const response = await fetch(
    `http://localhost:3001/cards/${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error(`Could not fetch card: ${name}`);
  }

  return response.json();
}