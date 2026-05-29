import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Magic Deck Simulator Backend");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});