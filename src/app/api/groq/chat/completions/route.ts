import { prismaAiHub } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { model: modelId, ...rest } = body;

  if (!body.model) {
    return NextResponse.json(
      { error: "Model ID is required" },
      { status: 400 }
    );
  }

  const dbModel = await prismaAiHub.aiModel.findUnique({
    where: {
      id: modelId,
    },
  });

  if (!dbModel) {
    return NextResponse.json({ error: "Invalid model id" }, { status: 400 });
  }

  try {
    const groqResp = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dbModel.secretKey}`,
        },
        body: JSON.stringify({
          model: dbModel?.modelName,
          ...rest,
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
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
