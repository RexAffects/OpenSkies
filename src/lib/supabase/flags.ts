import { createServiceClient } from "./server";

export interface FlightFlag {
  id: string;
  tail_number: string;
  icao_hex: string | null;
  reason: string;
  reporter_notes: string | null;
  latitude: number | null;
  longitude: number | null;
  altitude_ft: number | null;
  observation_type: string;
  flag_count: number;
  unique_reporters: number;
  threat_level: "none" | "low" | "medium" | "high";
  lifetime_flag_count: number;
  first_flagged_at: string;
  last_flagged_at: string;
  created_at: string;
}

export interface FlagSubmission {
  tail_number: string;
  icao_hex?: string;
  reporter_hash: string;
  reason: string;
  reporter_notes?: string;
  latitude?: number;
  longitude?: number;
  altitude_ft?: number;
  suspicion_score?: number;
}

// ============================================================
// SUBMISSIONS (service-role only)
// ============================================================

export async function insertSubmission(
  submission: FlagSubmission
): Promise<boolean> {
  const supabase = createServiceClient();

  const { error } = await supabase.from("flag_submissions").insert({
    tail_number: submission.tail_number.toUpperCase(),
    icao_hex: submission.icao_hex?.toUpperCase() || null,
    reporter_hash: submission.reporter_hash,
    reason: submission.reason,
    reporter_notes: submission.reporter_notes || null,
    latitude: submission.latitude || null,
    longitude: submission.longitude || null,
    altitude_ft: submission.altitude_ft || null,
    suspicion_score: submission.suspicion_score || null,
  });

  if (error) {
    console.error("Error inserting flag submission:", error);
    return false;
  }
  return true;
}

// ============================================================
// RATE LIMITING
// ============================================================

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

export async function checkRateLimits(
  reporterHash: string,
  tailNumber: string
): Promise<RateLimitResult> {
  const supabase = createServiceClient();
  const now = new Date();

  // 1. Check: 1 flag per IP per aircraft per 24 hours
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const { count: perAircraftCount } = await supabase
    .from("flag_submissions")
    .select("*", { count: "exact", head: true })
    .eq("reporter_hash", reporterHash)
    .eq("tail_number", tailNumber.toUpperCase())
    .gte("created_at", dayAgo);

  if ((perAircraftCount ?? 0) >= 1) {
    return {
      allowed: false,
      reason: "You have already flagged this aircraft in the last 24 hours.",
    };
  }

  // 2. Check: 5 total flags per IP per hour
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const { count: hourlyCount } = await supabase
    .from("flag_submissions")
    .select("*", { count: "exact", head: true })
    .eq("reporter_hash", reporterHash)
    .gte("created_at", hourAgo);

  if ((hourlyCount ?? 0) >= 5) {
    return {
      allowed: false,
      reason: "Rate limit reached. You can flag up to 5 aircraft per hour.",
    };
  }

  // 3. Check: 20 total flags per IP per day
  const { count: dailyCount } = await supabase
    .from("flag_submissions")
    .select("*", { count: "exact", head: true })
    .eq("reporter_hash", reporterHash)
    .gte("created_at", dayAgo);

  if ((dailyCount ?? 0) >= 20) {
    return {
      allowed: false,
      reason: "Daily limit reached. You can flag up to 20 aircraft per day.",
    };
  }

  return { allowed: true };
}

// ============================================================
// AGGREGATE RECOMPUTATION
// ============================================================

function computeThreatLevel(uniqueReporters: number): "none" | "low" | "medium" | "high" {
  if (uniqueReporters >= 5) return "high";
  if (uniqueReporters >= 3) return "medium";
  if (uniqueReporters >= 1) return "low";
  return "none";
}

export async function recomputeAggregate(tailNumber: string): Promise<FlightFlag | null> {
  const supabase = createServiceClient();
  const tail = tailNumber.toUpperCase();

  // Count unique reporters in last 90 days (public-facing)
  const ninetyDaysAgo = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: recentSubmissions } = await supabase
    .from("flag_submissions")
    .select("reporter_hash")
    .eq("tail_number", tail)
    .gte("created_at", ninetyDaysAgo);

  const uniqueReporters = new Set(
    (recentSubmissions || []).map((s: { reporter_hash: string }) => s.reporter_hash)
  ).size;

  // Count ALL submissions ever (lifetime, never decays)
  const { count: lifetimeCount } = await supabase
    .from("flag_submissions")
    .select("*", { count: "exact", head: true })
    .eq("tail_number", tail);

  // Get the most recent submission for reason/notes
  const { data: latestSubmission } = await supabase
    .from("flag_submissions")
    .select("reason, reporter_notes, latitude, longitude, altitude_ft, icao_hex")
    .eq("tail_number", tail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const threatLevel = computeThreatLevel(uniqueReporters);

  // Upsert into flight_flags
  const { data: existing } = await supabase
    .from("flight_flags")
    .select("id")
    .eq("tail_number", tail)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("flight_flags")
      .update({
        flag_count: lifetimeCount ?? 0,
        unique_reporters: uniqueReporters,
        threat_level: threatLevel,
        lifetime_flag_count: lifetimeCount ?? 0,
        last_flagged_at: new Date().toISOString(),
        reason: latestSubmission?.reason || "suspicious_activity",
        reporter_notes: latestSubmission?.reporter_notes || null,
        icao_hex: latestSubmission?.icao_hex || null,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating flight_flags:", error);
      return null;
    }
    return data as FlightFlag;
  }

  // Create new
  const { data, error } = await supabase
    .from("flight_flags")
    .insert({
      tail_number: tail,
      icao_hex: latestSubmission?.icao_hex || null,
      reason: latestSubmission?.reason || "suspicious_activity",
      reporter_notes: latestSubmission?.reporter_notes || null,
      latitude: latestSubmission?.latitude || null,
      longitude: latestSubmission?.longitude || null,
      altitude_ft: latestSubmission?.altitude_ft || null,
      flag_count: lifetimeCount ?? 1,
      unique_reporters: uniqueReporters,
      threat_level: threatLevel,
      lifetime_flag_count: lifetimeCount ?? 1,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating flight_flags:", error);
    return null;
  }
  return data as FlightFlag;
}

// ============================================================
// READS (used by frontend via API routes)
// ============================================================

export async function getFlag(tailNumber: string): Promise<FlightFlag | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("flight_flags")
    .select("*")
    .eq("tail_number", tailNumber.toUpperCase())
    .maybeSingle();

  if (error) {
    console.error("Error fetching flag:", error);
    return null;
  }
  return data as FlightFlag | null;
}

export async function getActiveFlags(): Promise<FlightFlag[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("flight_flags")
    .select("*")
    .in("threat_level", ["medium", "high"])
    .order("unique_reporters", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching active flags:", error);
    return [];
  }
  return data as FlightFlag[];
}

export async function getAllFlags(): Promise<FlightFlag[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("flight_flags")
    .select("*")
    .order("lifetime_flag_count", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching all flags:", error);
    return [];
  }
  return data as FlightFlag[];
}

// ============================================================
// ANOMALY DETECTION
// ============================================================

export async function logAnomaly(
  type: "burst" | "scatter_bomb" | "low_score_target" | "ip_cluster",
  details: Record<string, unknown>,
  tailNumber?: string,
  reporterHash?: string
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase.from("flag_anomalies").insert({
    anomaly_type: type,
    details,
    tail_number: tailNumber || null,
    reporter_hash: reporterHash || null,
  });

  if (error) {
    console.error("Error logging anomaly:", error);
  }
}

export async function checkAnomalies(
  reporterHash: string,
  tailNumber: string,
  suspicionScore?: number
): Promise<void> {
  const supabase = createServiceClient();
  const now = new Date();
  const tail = tailNumber.toUpperCase();

  // 1. Burst detection: 10+ flags on one aircraft within 1 hour
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const { count: burstCount } = await supabase
    .from("flag_submissions")
    .select("*", { count: "exact", head: true })
    .eq("tail_number", tail)
    .gte("created_at", hourAgo);

  if ((burstCount ?? 0) >= 10) {
    await logAnomaly("burst", {
      message: `${burstCount} flags on ${tail} in the last hour`,
      tail_number: tail,
    }, tail);
  }

  // 2. Scatter bomb: one IP flags 15+ different aircraft in a day
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const { data: scatterData } = await supabase
    .from("flag_submissions")
    .select("tail_number")
    .eq("reporter_hash", reporterHash)
    .gte("created_at", dayAgo);

  const uniqueTails = new Set(
    (scatterData || []).map((s: { tail_number: string }) => s.tail_number)
  ).size;

  if (uniqueTails >= 15) {
    await logAnomaly("scatter_bomb", {
      message: `Reporter flagged ${uniqueTails} different aircraft in 24h`,
      reporter_hash: reporterHash,
      unique_aircraft: uniqueTails,
    }, undefined, reporterHash);
  }

  // 3. Low-score target: aircraft with suspicion score < 2 gets 5+ flags
  if (suspicionScore !== undefined && suspicionScore < 2) {
    const { count: lowScoreCount } = await supabase
      .from("flag_submissions")
      .select("*", { count: "exact", head: true })
      .eq("tail_number", tail);

    if ((lowScoreCount ?? 0) >= 5) {
      await logAnomaly("low_score_target", {
        message: `Low-suspicion aircraft ${tail} (score ${suspicionScore}) has ${lowScoreCount} flags`,
        suspicion_score: suspicionScore,
        flag_count: lowScoreCount,
      }, tail);
    }
  }
}
