import { NextResponse } from "next/server";
import { getActiveFlags } from "@/lib/supabase/flags";

/**
 * GET /api/flags/active — All aircraft with medium or high threat level.
 * Used by the flight list to show threat badges without per-aircraft queries.
 */
export async function GET() {
  const flags = await getActiveFlags();

  const result = flags.map((f) => ({
    tail_number: f.tail_number,
    icao_hex: f.icao_hex,
    unique_reporters: f.unique_reporters,
    threat_level: f.threat_level,
  }));

  return NextResponse.json(result);
}
