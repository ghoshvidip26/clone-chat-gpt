import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {},
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    const imageUrl = body.imageUrl;

    // Prepare conversation messages
    const conversationMessages = [
      { role: "system", content: "You are a helpful AI assistant." },
      ...messages,
    ];

    let completion;
    if (imageUrl) {
      // Use Gemini for image analysis
      completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash-image-preview:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: body.message || "Please analyze this image.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });
    } else {
      // Use GPT-3.5 for regular chat
      if (body.message) {
        conversationMessages.push({
          role: "user",
          content: body.message,
        });
      }

      completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: conversationMessages,
      });
    }
    console.log("AI Response:", completion);

    if (!completion.choices?.[0]?.message?.content) {
      console.error("Unexpected API response format:", completion);
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
