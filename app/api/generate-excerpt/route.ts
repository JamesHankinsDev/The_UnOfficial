import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    console.log("Generating excerpt with OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a skilled content marketer writing engaging article descriptions. Create a compelling 3-5 sentence overview that hooks readers and makes them excited to read the full article. Focus on the key insights, interesting angles, or valuable takeaways. Be enthusiastic but authentic.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nArticle Content:\n${content.substring(0, 3000)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const excerpt = completion.choices[0]?.message?.content?.trim();

    if (!excerpt) {
      console.error("No excerpt generated from OpenAI");
      return NextResponse.json(
        { error: "Failed to generate excerpt" },
        { status: 500 },
      );
    }

    console.log("Excerpt generated successfully");
    return NextResponse.json({ excerpt });
  } catch (error: any) {
    console.error("Error generating excerpt:", error);
    console.error("Error details:", error.message, error.code, error.type);
    return NextResponse.json(
      {
        error: `Failed to generate excerpt: ${error.message || "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
