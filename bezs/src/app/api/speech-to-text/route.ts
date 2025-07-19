import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest, resp: NextResponse) {
  const headersList = headers();
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "No API key provided." }, { status: 401 });
  }

  const body = await req.json();
  const audiobase64 = body.base64;

  const audioBuffer = Buffer.from(audiobase64, "base64");
}
