import { NextResponse } from "next/server";
import { getLiveStatus } from "@/lib/live";

/** Are we streaming right now? Polled by the homepage so a static page can still flip to "Live now". */
export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getLiveStatus();
  return NextResponse.json(status, { headers: { "Cache-Control": "public, max-age=15, s-maxage=15" } });
}
