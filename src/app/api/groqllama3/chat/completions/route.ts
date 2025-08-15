/*
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const apiKey =
    (await headersList).get("x-api-key") ||
    "";

  console.log(apiKey);

  if (!apiKey) {
    return NextResponse.json({ error: "No API key provided" }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  const requestHeadersObject = Object.fromEntries(requestHeaders.entries());

  const body = await req.json();
  const groqResp = await fetch("https://api.groq.com/openai/v1", {
    method: "POST",
    headers: {
      // accept: requestHeadersObject["accept"],
      // "accept-encoding": "gzip, deflate, br, zstd",
      // "accept-language": "en-US,en;q=0.9",
      // "anthropic-version": requestHeadersObject["anthropic-version"],
      // connection: requestHeadersObject["connection"],
      // "content-type": "application/json",
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      ...body,
      stream: true,
    }),
  });

  if (!groqResp.ok || !groqResp.body) {
    return NextResponse.json(
      { error: "Failed to connect to Groq API" },
      { status: 500 }
    );
  }

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const reader = groqResp.body?.getReader();

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const pump = async () => {
    const { value, done } = await reader!.read();
    if (done) {
      writer.close();
      return;
    }

    const chunk = decoder.decode(value, { stream: true });
    writer.write(encoder.encode(chunk));
    pump();
  };

  pump();

  return new NextResponse(stream.readable, {
    headers: {
      "Transfer-Encoding": "chunked",
      charset: "utf-8",
      "Content-Type": "text/plain",
    },
  });
}
*/

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headersList = headers();
  const apiKey =
    (await headersList).get("x-api-key") || process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "No API key provided" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const groqResp = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      // "http://127.0.0.1:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...body,
          stream: true,
        }),
      }
    );

    if (!groqResp.ok || !groqResp.body) {
      const errorText = await groqResp.text();
      console.error("Groq API Error Response:", errorText);

      return NextResponse.json(
        { error: "Failed to connect to Groq API" },
        { status: 500 }
      );
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const reader = groqResp.body.getReader();

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const pump = async () => {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        await writer.write(encoder.encode(chunk));
      }
      writer.close();
    };

    pump();

    return new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        // "Transfer-Encoding": "chunked",
        // charset: "utf-8",
        // "Content-Type": "text/plain",
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
