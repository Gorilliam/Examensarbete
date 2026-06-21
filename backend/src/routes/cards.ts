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

    async function fetchFromScryfall(mode: "exact" | "fuzzy") {
      return fetch(
        `https://api.scryfall.com/cards/named?${mode}=${encodeURIComponent(cardName)}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "MagicDeckSimulator/1.0",
          },
        }
      );
    }

    let response = await fetchFromScryfall("exact");

    if (!response.ok) {
      response = await fetchFromScryfall("fuzzy");
    }

    const data = await response.json();

    if (!response.ok) {
      console.log("Scryfall error:", data);

      return res.status(response.status).json({
        message: data.details ?? `Could not find card: ${cardName}`,
      });
    }

    const imageUrl =
      data.image_uris?.normal ??
      data.card_faces?.[0]?.image_uris?.normal ??
      "";

    res.json({
      name: data.name,
      manaCost: data.mana_cost ?? data.card_faces?.[0]?.mana_cost ?? "",
      typeLine: data.type_line,
      oracleText: data.oracle_text ?? data.card_faces?.[0]?.oracle_text ?? "",
      imageUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch card from Scryfall",
    });
  }
});

export default router;