import mongoose from "mongoose";
import { format } from "path";

// "image": {
//       "type": "image",
//       "format": "JPEG",
            // "base64":''
//     },
//     "image_description": "The image presents a captivating digital art piece featuring a white wolf. The wolf, with its head turned to the side, exudes a sense of calm and tranquility. Its fur, rendered in a soft white, is adorned with a rainbow gradient that adds a touch of whimsy to the otherwise realistic depiction. The wolf's body is draped in a flowing, transparent fabric that cascades down, creating an ethereal effect. The background is a stark black, which serves to highlight the wolf and its vibrant colors. The overall composition of the image suggests a blend of natural beauty and artistic imagination.",
//     "long_prompt": "An ethereal, detailed digital illustration of a serene white wolf. Its fur, a pure white, is enhanced by a rainbow gradient and a flowing, see-through fabric. The stark black background highlights the wolf's ethereal beauty and adds a fantasy element.",
//     "short_prompt": "A serene white wolf, its fur a rainbow kaleidoscope, poised in black emptiness."
export interface IPrompt extends Document {
    image: {
        type : string,
        format: string,
        base64: string
    };
    image_description: string;
    long_prompt: string;
    short_prompt: string;
}


const PromptSchema = new mongoose.Schema({
    image: {
      type: {
        type: String,          
        required: true
      },
      format: {
        type: String,          
        required: true
      },
      base64: {
        type: String,          
        required: false
      }
    },
    image_description: {
      type: String,
      required: true
    },
    long_prompt: {
      type: String,
      required: true
    },
    short_prompt: {
      type: String,
      required: true
    }


})


export const Prompt = mongoose.model<IPrompt>("Prompt", PromptSchema);