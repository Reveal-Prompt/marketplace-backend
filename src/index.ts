import express, { type Request, type Response } from "express";
import http from "http";
import { connectDB } from "./config/db.js";
import { Prompt } from "./models/prompt.model.js";
import cors from 'cors';

const app = express();
const router = express.Router();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Fetch all prompts
router.get("/", async (req: Request, res: Response) => {
  try {
    const prompts = await Prompt.find();
    const total = await Prompt.countDocuments();

    res.json({
      total,
      data: prompts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching prompts", error: err });
  }
});

// Fetch a single prompt by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    
    const prompt = await Prompt.findById( id );

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    res.json(prompt);
  } catch (err) {
    res.status(500).json({ message: "Error fetching prompt", error: err });
  }
});

app.use("/api/prompts", router);

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  server.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
  });
};

startServer();
