import { loadMainAffix } from "@/lib/loader";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mainAffix = await loadMainAffix();
    return new NextResponse(JSON.stringify(mainAffix), {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load main affix' }, { status: 500 });
  }
}
