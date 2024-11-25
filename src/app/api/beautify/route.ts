import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Use your OpenAI API key
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Recommended model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that beautifies text.",
        },
        {
          role: "user",
          content: `Beautify the following text:\n\n${body.text}`,
        },
      ],
    });

    const beautifiedText = response.choices[0]?.message?.content?.trim();
    if (!beautifiedText) {
      return NextResponse.json(
        { message: "Failed to beautify text" },
        { status: 500 }
      );
    }

    return NextResponse.json({ beautifiedText });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.status === 429) {
      return NextResponse.json(
        {
          message: "Quota exceeded. Please check your OpenAI plan and billing.",
        },
        { status: 429 }
      );
    }
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
