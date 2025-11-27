import mongoose, { Document } from "mongoose";

export interface IPrompt extends Document {
  id: number;
  image: {
    type: string;
    format: string;
    base64?: string;
  };
  image_description: string;
  long_prompt: string;
  short_prompt: string;
  category?: string;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PromptSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    image: {
      type: {
        type: String,
        required: true,
      },
      format: {
        type: String,
        required: true,
      },
      base64: {
        type: String,
        required: false,
      },
    },
    image_description: {
      type: String,
      required: true,
    },
    long_prompt: {
      type: String,
      required: true,
    },
    short_prompt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export const Prompt = mongoose.model<IPrompt>("Prompt", PromptSchema);
