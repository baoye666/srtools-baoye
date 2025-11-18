import { NextRequest, NextResponse } from 'next/server'
import { loadMonster } from '@/lib/loader'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string, locale: string }> }
) {

  const { id, locale } = await params
  const monsterData = await loadMonster([id], locale)
  const monster = monsterData[id]

  if (!monster) {
    return NextResponse.json({ error: 'Monster info not found' }, { status: 404 })
  }
  return new NextResponse(JSON.stringify(monster), {
    headers: { "Content-Type": "application/json" }
  });
}
