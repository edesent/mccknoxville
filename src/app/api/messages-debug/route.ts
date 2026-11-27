import { NextResponse } from "next/server";
import { fetchFeed } from "@/lib/messages";

// A live look at the YouTube feed, since the Watch page itself is cached.
export const dynamic = "force-dynamic";

export async function GET() {
  const { status, entries } = await fetchFeed();
  return NextResponse.json({ status, count: entries.length, newest: entries[0] ?? null });
}
