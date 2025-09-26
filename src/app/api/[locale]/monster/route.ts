import { loadMonster } from "@/lib/loader";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  try {
    const body = await request.json();
    const monsterIds = body.monsterIds as string[];
    const { locale } = await params;
    
    if (!Array.isArray(monsterIds) || monsterIds.some(id => typeof id !== 'string')) {
      return NextResponse.json({ error: 'Invalid monsterIds' }, { status: 400 });
    }

    const monsterData = await loadMonster(monsterIds, locale);

    return NextResponse.json(monsterData);
  } catch {
    return NextResponse.json({ error: 'Failed to load monster data' }, { status: 500 });
  }
}
