import { Router } from "express";

const router = Router();

type ScryfallCardResponse = {
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  image_uris?: {
    normal?: string;
  };
  card_faces?: {
    name: string;
    mana_cost?: string;
    type_line?: string;
    oracle_text?: string;
    image_uris?: {
      normal?: string;
    };
  }[];
};

router.get("/:name", async (req, res) => {
  try {
    const cardName = req.params.name;

    const response = await fetch(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: `Could not find card: ${cardName}`,
      });
    }

    const data = (await response.json()) as ScryfallCardResponse;

    const imageUrl =
      data.image_uris?.normal ?? data.card_faces?.[0]?.image_uris?.normal ?? "";

    res.json({
      name: data.name,
      manaCost: data.mana_cost ?? data.card_faces?.[0]?.mana_cost ?? "",
      typeLine: data.type_line,
      oracleText: data.oracle_text ?? data.card_faces?.[0]?.oracle_text ?? "",
      imageUrl,
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch card from Scryfall",
    });
  }
});

export default router;