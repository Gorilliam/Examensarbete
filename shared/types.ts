export type CardData = {
  name: string;
  manaCost: string;
  typeLine: string;
  oracleText: string;
  imageUrl: string;
};

export type Deck = {
  cards: string[];
};

export type Hand = {
  cards: string[];
};