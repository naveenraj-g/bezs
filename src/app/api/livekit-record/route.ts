import { EgressClient, RoomCompositeEgressRequest } from "livekit-server-sdk";
import { NextResponse } from "next/server";

// Initialize LiveKit client
const livekitHost = process.env.NEXT_PUBLIC_LIVEKIT_URL!;
const apiKey = process.env.LIVEKIT_API_KEY!;
const apiSecret = process.env.LIVEKIT_API_SECRET!;
const egressClient = new EgressClient(livekitHost, apiKey, apiSecret);

export async function POST(request: Request) {
  const { roomName } = await request.json();

  if (!roomName) {
    return NextResponse.json({ error: "Missing roomName" }, { status: 400 });
  }

  try {
    const result = await egressClient.startRoomCompositeEgress(
      roomName,
      {
        preset: "h264-720p", // Using preset for better compatibility
        filepath: `recordings/${roomName}-${Date.now()}.mp4`,
      },
      {
        layout: "grid",
        audioOnly: false,
        videoOnly: false,
        recordParticipants: true,
        width: 1280,
        height: 720,
        customBaseUrl: process.env.NEXT_PUBLIC_APP_URL,
      }
    );

    return NextResponse.json({
      success: true,
      egressId: result.egressId,
      status: result.status,
    });
  } catch (error: any) {
    // console.error("Failed to start recording:", error);
    // return NextResponse.json(
    //   { error: error.message || "Failed to start recording" },
    //   { status: 500 }
    // );
    return NextResponse.json((error as Error).message);
  }
}

// Stop recording endpoint
export async function DELETE(request: Request) {
  const { egressId } = await request.json();

  if (!egressId) {
    return NextResponse.json({ error: "Missing egressId" }, { status: 400 });
  }

  try {
    await egressClient.stopEgress(egressId);
    return NextResponse.json({ success: true, message: "Recording stopped" });
  } catch (error: any) {
    console.error("Failed to stop recording:", error);
    return NextResponse.json(
      { error: error.message || "Failed to stop recording" },
      { status: 500 }
    );
  }
}
