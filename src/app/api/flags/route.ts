import { NextRequest, NextResponse } from "next/server";
import { hashReporter, getClientIp } from "@/lib/utils/ip-hash";
import {
  checkRateLimits,
  insertSubmission,
  recomputeAggregate,
  checkAnomalies,
  getFlag,
} from "@/lib/supabase/flags";
import { FLAG_REASONS } from "@/lib/constants";

const validReasons = FLAG_REASONS.map((r) => r.value);

/**
 * POST /api/flags — Submit a flag for an aircraft
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.tail_number || typeof body.tail_number !== "string") {
      return NextResponse.json(
        { error: "tail_number is required" },
        { status: 400 }
      );
    }

    if (!body.reason || !validReasons.includes(body.reason)) {
      return NextResponse.json(
        { error: "Invalid reason. Must be one of: " + validReasons.join(", ") },
        { status: 400 }
      );
    }

    if (body.reporter_notes && body.reporter_notes.length > 500) {
      return NextResponse.json(
        { error: "Notes must be 500 characters or fewer" },
        { status: 400 }
      );
    }

    // Hash reporter IP
    const ip = getClientIp(request);
    const reporterHash = hashReporter(ip);

    // Check rate limits
    const rateCheck = await checkRateLimits(
      reporterHash,
      body.tail_number
    );

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.reason },
        { status: 429 }
      );
    }

    // Insert submission
    const inserted = await insertSubmission({
      tail_number: body.tail_number,
      icao_hex: body.icao_hex,
      reporter_hash: reporterHash,
      reason: body.reason,
      reporter_notes: body.reporter_notes,
      latitude: body.latitude,
      longitude: body.longitude,
      altitude_ft: body.altitude_ft,
      suspicion_score: body.suspicion_score,
    });

    if (!inserted) {
      return NextResponse.json(
        { error: "Failed to record flag" },
        { status: 500 }
      );
    }

    // Run anomaly checks (async, don't block response)
    checkAnomalies(reporterHash, body.tail_number, body.suspicion_score).catch(
      (err) => console.error("Anomaly check error:", err)
    );

    // Recompute aggregate
    const flag = await recomputeAggregate(body.tail_number);

    return NextResponse.json({
      success: true,
      threat_level: flag?.threat_level || "low",
      unique_reporters: flag?.unique_reporters || 1,
      message: "Flag recorded. Thank you for helping document aircraft activity.",
    });
  } catch (err) {
    console.error("Flag submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/flags?tail=N12345 — Get flag data for a specific aircraft
 */
export async function GET(request: NextRequest) {
  const tail = request.nextUrl.searchParams.get("tail");

  if (!tail) {
    return NextResponse.json(
      { error: "tail parameter is required" },
      { status: 400 }
    );
  }

  const flag = await getFlag(tail);

  if (!flag) {
    return NextResponse.json({
      tail_number: tail.toUpperCase(),
      flag_count: 0,
      unique_reporters: 0,
      threat_level: "none",
      first_flagged_at: null,
      last_flagged_at: null,
    });
  }

  return NextResponse.json({
    tail_number: flag.tail_number,
    flag_count: flag.flag_count,
    unique_reporters: flag.unique_reporters,
    threat_level: flag.threat_level,
    first_flagged_at: flag.first_flagged_at,
    last_flagged_at: flag.last_flagged_at,
  });
}
