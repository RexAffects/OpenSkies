import { NextRequest } from "next/server";
import { lookupRoute, lookupAircraftByHex, lookupRouteHexDB } from "@/lib/api/adsbdb";
import { lookupTailNumber } from "@/lib/api/faa";
import { fetchAircraftByHex } from "@/lib/api/adsb";
import { getFlag } from "@/lib/supabase/flags";

/**
 * GET /api/flights/detail?hex=A1B2C3&callsign=UAL123&tail=N12345
 *
 * One-stop endpoint that gathers ALL available info for an aircraft:
 * - Live position from ADSB.lol
 * - Route (origin/destination airports) from ADSBDB + HexDB fallback
 * - Aircraft details (owner, type, photo) from ADSBDB
 * - FAA registration from registry.faa.gov
 *
 * All lookups run in parallel for speed.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hex = searchParams.get("hex") || "";
  const callsign = searchParams.get("callsign") || "";
  const tail = searchParams.get("tail") || "";

  if (!hex && !callsign && !tail) {
    return Response.json(
      { error: "At least one of hex, callsign, or tail is required" },
      { status: 400 }
    );
  }

  // Run all lookups in parallel
  const [liveData, routeData, aircraftData, faaData, hexDbRoute] =
    await Promise.all([
      hex ? fetchAircraftByHex(hex).catch(() => null) : Promise.resolve(null),
      callsign ? lookupRoute(callsign).catch(() => null) : Promise.resolve(null),
      hex ? lookupAircraftByHex(hex).catch(() => null) : Promise.resolve(null),
      tail ? lookupTailNumber(tail).catch(() => null) : Promise.resolve(null),
      callsign ? lookupRouteHexDB(callsign).catch(() => null) : Promise.resolve(null),
    ]);

  // Build the complete response
  const result = {
    // Identity
    icao_hex: hex || liveData?.hex || null,
    tail_number:
      tail || liveData?.r || aircraftData?.registration || null,
    callsign: callsign || liveData?.flight?.trim() || null,

    // Aircraft details
    aircraft_type: liveData?.t || aircraftData?.icao_type || null,
    aircraft_description:
      liveData?.desc ||
      (aircraftData
        ? `${aircraftData.manufacturer} ${aircraftData.type}`
        : null),
    aircraft_photo: aircraftData?.url_photo || null,
    aircraft_photo_thumbnail: aircraftData?.url_photo_thumbnail || null,

    // Owner info (prefer FAA, fall back to ADSBDB)
    owner: {
      name:
        faaData?.ownerName || aircraftData?.registered_owner || null,
      city: faaData?.ownerCity || null,
      state: faaData?.ownerState || null,
      country:
        faaData?.ownerCountry ||
        aircraftData?.registered_owner_country_name ||
        null,
      is_known_wx_mod: faaData?.isKnownWeatherMod || false,
      operator_notes: faaData?.operatorNotes || "",
    },

    // FAA registration details
    registration: faaData
      ? {
          make: faaData.make,
          model: faaData.model,
          year: faaData.year,
          serial_number: faaData.serialNumber,
          status: faaData.status,
          type: faaData.registrationType,
        }
      : null,

    // Route info (prefer ADSBDB, fall back to HexDB)
    route: {
      origin: routeData?.origin
        ? {
            icao: routeData.origin.icao,
            iata: routeData.origin.iata,
            name: routeData.origin.name,
            city: routeData.origin.municipality,
            country: routeData.origin.country,
          }
        : hexDbRoute
          ? { icao: hexDbRoute.origin, iata: null, name: null, city: null, country: null }
          : null,
      destination: routeData?.destination
        ? {
            icao: routeData.destination.icao,
            iata: routeData.destination.iata,
            name: routeData.destination.name,
            city: routeData.destination.municipality,
            country: routeData.destination.country,
          }
        : hexDbRoute
          ? { icao: hexDbRoute.destination, iata: null, name: null, city: null, country: null }
          : null,
      airline: routeData?.airline_name || null,
    },

    // Live position
    position: liveData
      ? {
          latitude: liveData.lat,
          longitude: liveData.lon,
          altitude_ft:
            typeof liveData.alt_baro === "number"
              ? liveData.alt_baro
              : liveData.alt_baro === "ground"
                ? 0
                : null,
          altitude_geom_ft: liveData.alt_geom || null,
          speed_kts: liveData.gs || null,
          heading: liveData.track || null,
          squawk: liveData.squawk || null,
          on_ground: liveData.alt_baro === "ground",
          last_seen_seconds: liveData.seen,
        }
      : null,

    // Community flags
    community_flags: null as {
      flag_count: number;
      unique_reporters: number;
      threat_level: string;
      first_flagged_at: string | null;
      last_flagged_at: string | null;
    } | null,

    timestamp: Date.now(),
  };

  // Look up community flags (don't block if it fails)
  const effectiveTail =
    result.tail_number || tail || liveData?.r || null;
  if (effectiveTail) {
    try {
      const flag = await getFlag(effectiveTail);
      if (flag && flag.threat_level !== "none") {
        result.community_flags = {
          flag_count: flag.flag_count,
          unique_reporters: flag.unique_reporters,
          threat_level: flag.threat_level,
          first_flagged_at: flag.first_flagged_at,
          last_flagged_at: flag.last_flagged_at,
        };
      }
    } catch (err) {
      console.error("Error fetching community flags:", err);
    }
  }

  return Response.json(result);
}

