import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {},
});

export async function POST(req: NextRequest) {
  const { imgURL } = await req.json();
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-image-preview:free",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this image.",
          },
          {
            type: "image_url",
            image_url: {
              url: imgURL,
            },
          },
        ],
      },
    ],
  });
  console.log("AI Response:", completion.choices[0].message.content);
  return NextResponse.json({ message: completion.choices[0].message.content });
}
