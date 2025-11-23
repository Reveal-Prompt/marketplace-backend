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
      // ✅ Add incremental numeric id
      const promptWithId = {
        ...value,
        id: count + 1, // start from 1
      };

      await Prompt.create(promptWithId);
      count++;
      console.log(`Inserted prompt ${count}:`, promptWithId.short_prompt);
    } catch (err) {
      console.error("Error inserting prompt:", err);
    }
  }

  console.log("Import completed!");
  await mongoose.disconnect();
}

loadPrompts();
