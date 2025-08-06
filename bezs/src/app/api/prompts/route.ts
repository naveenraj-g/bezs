import { roles } from "@/modules/ai-hub/lib/prompts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, resp: NextResponse) {
  return NextResponse.json({ prompts: roles });
}
