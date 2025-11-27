import mongoose from "mongoose";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { Prompt } from "../models/prompt.model.js";
import pkg from "stream-json";
import StreamArrayPkg from "stream-json/streamers/StreamArray.js";

dotenv.config();

const { parser } = pkg;
const { streamArray } = StreamArrayPkg;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://revealprompt:revealprompt@prompt-dataset.w9tzabq.mongodb.net/?appName=Prompt-Dataset";

async function loadPrompts() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // -------- CLEAR DATABASE --------
  await Prompt.deleteMany({});
  console.log("Cleared Prompt collection");

  let count = 0;

  const jsonStream = fs
    .createReadStream("./dataset.json")
    .pipe(parser())
    .pipe(streamArray());

  for await (const { value } of jsonStream) {
    if (count >= 100) { 
      console.log("Reached 100 prompts — stopping import.");
      break;
    }

    try {
      // Random createdAt within last 4 weeks
      const daysAgo = Math.floor(Math.random() * 28); // 0 to 27
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      // Random views between 0–500
      const views = Math.floor(Math.random() * 501);

      const promptWithExtras = {
        ...value,
        id: count + 1,
        views,
        createdAt,
        updatedAt: createdAt,
      };

      await Prompt.create(promptWithExtras);
      count++;

      console.log(`Inserted prompt ${count}:`, promptWithExtras.short_prompt, "| views:", views, "| createdAt:", createdAt.toDateString());
    } catch (err) {
      console.error("Error inserting prompt:", err);
    }
  }

  console.log("Import completed!");
  await mongoose.disconnect();
}

loadPrompts();
