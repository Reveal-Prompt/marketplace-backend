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
    origin: ["http://localhost:3000", "https://subnet-marketplace.vercel.app",  "https://*.vercel.app", "https://app.revealprompt.com/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Fetch all prompts
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip =(page - 1) * limit;

    const prompts = await Prompt.find()
      .skip(skip)
      .limit(limit)
      .sort({createdAt: -1});

    const total = await Prompt.countDocuments();
    const totalPages = Math.ceil(total / limit);



    res.json({
      total,
      page,
      limit,
      totalPages,
      data: prompts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching prompts", error: err });
  }
});




router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const prompt = await Prompt.findById( id ).sort();
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
