export type CardData = {
  name: string;
  manaCost: string;
  typeLine: string;
  oracleText: string;
  imageUrl: string;
};

export type BattlefieldCard = {
  id: string;
  name: string;
};

export type Deck = {
  cards: string[];
};

export type Hand = {
  cards: string[];
};

export type ManaColor = "W" | "U" | "B" | "R" | "G" | "C";

export type ManaPool = Record<ManaColor, number>;

export const emptyManaPool: ManaPool = {
  W: 0,
  U: 0,
  B: 0,
  R: 0,
  G: 0,
  C: 0,
};