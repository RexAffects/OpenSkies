"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import type { FlightTrail } from "./map-container";

interface FlightData {
  icao_hex: string;
  tail_number: string | null;
  callsign: string | null;
  aircraft_type: string | null;
  aircraft_description: string | null;
  latitude: number;
  longitude: number;
  altitude_ft: number;
  speed_kts: number;
  heading: number;
  distance_nm: number;
  is_known_wx_mod: boolean;
  operator_notes: string;
  squawk: string | null;
  suspicion_score: number;
  suspicion_reasons: string[];
}

// Aircraft type codes commonly used for cloud seeding (turboprops, small props)
const SUSPECT_AIRCRAFT_TYPES = new Set([
  "BE20", "BE9L", "BE99", "BE10", "B200", "B300", // Beechcraft King Air variants
  "C208", "C206", "C210", "C182", "C172", // Cessna singles
  "C340", "C402", "C414", "C421", // Cessna twins
  "PA31", "PA34", "PA46", // Piper (Cheyenne, Navajo, etc.)
  "P180", // Piaggio Avanti
  "DHC6", // Twin Otter
  "BN2P", // Islander
  "AC68", "AC69", // Aero Commander
  "SW4", "SW3", // Swearingen Metroliner
]);

// Airline callsign prefixes — if it starts with these, it's a commercial flight
const AIRLINE_PREFIXES = [
  "AAL", "DAL", "UAL", "SWA", "JBU", "NKS", "FFT", "ASA", "HAL",
  "SKW", "RPA", "ENY", "PDT", "PSA", "CPZ", "JIA", "EDV", "GJS",
  "FDX", "UPS", // cargo
];

function isAirlineCallsign(callsign: string | null): boolean {
  if (!callsign) return false;
  const upper = callsign.toUpperCase().trim();
  return AIRLINE_PREFIXES.some((prefix) => upper.startsWith(prefix));
}

function isSuspectAircraftType(type: string | null): boolean {
  if (!type) return false;
  return SUSPECT_AIRCRAFT_TYPES.has(type.toUpperCase().trim());
}

/**
 * Score how suspicious a flight is for potential weather modification.
 * Higher score = more worth watching. Max ~5.
 */
function scoreSuspicion(flight: {
  altitude_ft: number;
  callsign: string | null;
  aircraft_type: string | null;
  speed_kts: number;
  is_known_wx_mod: boolean;
}): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Known WX mod operator — instant max score
  if (flight.is_known_wx_mod) {
    return { score: 5, reasons: ["Known weather modification operator"] };
  }

  // At cloud seeding altitude
  const band = getAltitudeBand(flight.altitude_ft);
  if (band === "cloud_seeding") {
    score += 1;
    reasons.push("Cloud seeding altitude");
  }

  // NOT a commercial airline (no airline callsign prefix)
  if (!isAirlineCallsign(flight.callsign)) {
    score += 1;
    reasons.push("Non-commercial flight");
  }

  // Suspect aircraft type (turboprop, small prop)
  if (isSuspectAircraftType(flight.aircraft_type)) {
    score += 1.5;
    reasons.push("Small prop/turboprop aircraft");
  }

  // Slow speed (cloud seeding planes typically fly 100-200 kts, not 400+)
  if (flight.speed_kts > 0 && flight.speed_kts < 250 && band === "cloud_seeding") {
    score += 0.5;
    reasons.push("Low speed at seeding altitude");
  }

  // Uses tail number as callsign (not an airline code)
  if (
    flight.callsign &&
    flight.callsign.startsWith("N") &&
    /^N\d/.test(flight.callsign)
  ) {
    score += 0.5;
    reasons.push("Using tail number as callsign");
  }

  return { score, reasons };
}

type AltitudeBand = "cloud_seeding" | "high_altitude" | "ground" | "normal";

function getAltitudeBand(alt: number): AltitudeBand {
  if (alt <= 500) return "ground";
  if (alt >= 3000 && alt <= 20000) return "cloud_seeding";
  if (alt >= 25000 && alt <= 45000) return "high_altitude";
  return "normal";
}

const TRAIL_COLORS: Record<AltitudeBand, string> = {
  cloud_seeding: "#f97316",
  high_altitude: "#a855f7",
  normal: "#3b82f6",
  ground: "#9ca3af",
};

const ALTITUDE_TAGS: Record<
  AltitudeBand,
  { label: string; className: string; sortPriority: number }
> = {
  cloud_seeding: {
    label: "Cloud Seeding Alt",
    className:
      "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700",
    sortPriority: 0,
  },
  high_altitude: {
    label: "High Altitude",
    className:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
    sortPriority: 1,
  },
  ground: {
    label: "Ground",
    className:
      "bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600",
    sortPriority: 3,
  },
  normal: {
    label: "",
    className: "",
    sortPriority: 2,
  },
};

interface FlightLayerProps {
  mapCenter: { lat: number; lng: number } | null;
  radius?: number;
  onFlightSelect?: (flight: FlightData) => void;
  onTrailsUpdate?: (trails: FlightTrail[]) => void;
}

const MAX_TRAIL_POINTS = 180;

export function FlightLayer({
  mapCenter,
  radius = 50,
  onFlightSelect,
  onTrailsUpdate,
}: FlightLayerProps) {
  const [allFlights, setAllFlights] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Filters
  const [showCloudSeeding, setShowCloudSeeding] = useState(true);
  const [showHighAltitude, setShowHighAltitude] = useState(true);
  const [showOther, setShowOther] = useState(true);
  const [showGround, setShowGround] = useState(true);
  const [showAltitudeOnMap, setShowAltitudeOnMap] = useState(false);
  const [watchOnly, setWatchOnly] = useState(false);

  const trailsRef = useRef<
    Map<string, { positions: [number, number][]; tail_number: string | null }>
  >(new Map());

  const fetchFlights = useCallback(async () => {
    if (!mapCenter) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/flights/nearby?lat=${mapCenter.lat}&lon=${mapCenter.lng}&radius=${radius}`
      );
      if (!res.ok) throw new Error("Failed to fetch flights");
      const data = await res.json();

      const transformed: FlightData[] = (data.flights || [])
        .filter((f: { lat?: number; lon?: number }) => f.lat && f.lon)
        .map(
          (f: {
            hex: string;
            r?: string;
            flight?: string;
            t?: string;
            desc?: string;
            lat: number;
            lon: number;
            alt_baro?: number | string;
            gs?: number;
            track?: number;
            squawk?: string;
          }) => ({
            icao_hex: f.hex,
            tail_number: f.r || null,
            callsign: f.flight?.trim() || null,
            aircraft_type: f.t || null,
            aircraft_description: f.desc || null,
            latitude: f.lat,
            longitude: f.lon,
            altitude_ft: typeof f.alt_baro === "number" ? f.alt_baro : 0,
            speed_kts: f.gs || 0,
            heading: f.track || 0,
            distance_nm: 0,
            is_known_wx_mod: false,
            operator_notes: "",
            squawk: f.squawk || null,
            suspicion_score: 0,
            suspicion_reasons: [] as string[],
          }))
        .map((flight: FlightData) => {
          const { score, reasons } = scoreSuspicion(flight);
          return { ...flight, suspicion_score: score, suspicion_reasons: reasons };
        });

      // Accumulate trail positions
      for (const flight of transformed) {
        const existing = trailsRef.current.get(flight.icao_hex);
        const newPos: [number, number] = [flight.latitude, flight.longitude];

        if (existing) {
          const lastPos = existing.positions[existing.positions.length - 1];
          if (
            !lastPos ||
            lastPos[0] !== newPos[0] ||
            lastPos[1] !== newPos[1]
          ) {
            existing.positions.push(newPos);
            if (existing.positions.length > MAX_TRAIL_POINTS) {
              existing.positions.shift();
            }
          }
          existing.tail_number = flight.tail_number;
        } else {
          trailsRef.current.set(flight.icao_hex, {
            positions: [newPos],
            tail_number: flight.tail_number,
          });
        }
      }

      // Sort by suspicion score (highest first), then altitude band
      transformed.sort((a, b) => {
        // Suspicion score first
        if (a.suspicion_score !== b.suspicion_score) {
          return b.suspicion_score - a.suspicion_score;
        }
        // Then altitude band priority
        const bandA = getAltitudeBand(a.altitude_ft);
        const bandB = getAltitudeBand(b.altitude_ft);
        if (
          ALTITUDE_TAGS[bandA].sortPriority !==
          ALTITUDE_TAGS[bandB].sortPriority
        ) {
          return (
            ALTITUDE_TAGS[bandA].sortPriority -
            ALTITUDE_TAGS[bandB].sortPriority
          );
        }
        return b.altitude_ft - a.altitude_ft;
      });

      setAllFlights(transformed);
      setLastFetch(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [mapCenter, radius]);

  // Apply filters
  const isVisible = useCallback(
    (band: AltitudeBand) => {
      switch (band) {
        case "cloud_seeding":
          return showCloudSeeding;
        case "high_altitude":
          return showHighAltitude;
        case "ground":
          return showGround;
        case "normal":
          return showOther;
      }
    },
    [showCloudSeeding, showHighAltitude, showOther, showGround]
  );

  const filteredFlights = allFlights.filter((f) => {
    if (!isVisible(getAltitudeBand(f.altitude_ft))) return false;
    if (watchOnly && f.suspicion_score < 2) return false;
    return true;
  });

  // Update trails for map (only filtered flights)
  useEffect(() => {
    const trails: FlightTrail[] = filteredFlights
      .filter((f) => {
        const trail = trailsRef.current.get(f.icao_hex);
        return trail && trail.positions.length >= 2;
      })
      .map((f) => {
        const trail = trailsRef.current.get(f.icao_hex)!;
        const band = getAltitudeBand(f.altitude_ft);
        return {
          icao_hex: f.icao_hex,
          tail_number: f.tail_number,
          positions: [...trail.positions],
          color: f.is_known_wx_mod ? "#ef4444" : TRAIL_COLORS[band],
          altitude_ft: f.altitude_ft,
          showAltitude: showAltitudeOnMap,
        };
      });

    onTrailsUpdate?.(trails);
  }, [filteredFlights, onTrailsUpdate, showAltitudeOnMap]);

  useEffect(() => {
    trailsRef.current.clear();
    fetchFlights();
    const interval = setInterval(fetchFlights, 10000);
    return () => clearInterval(interval);
  }, [fetchFlights]);

  // Band counts (from all flights, not filtered)
  const bandCounts = allFlights.reduce(
    (acc, f) => {
      const band = getAltitudeBand(f.altitude_ft);
      acc[band] = (acc[band] || 0) + 1;
      return acc;
    },
    {} as Record<AltitudeBand, number>
  );

  const trailCount = filteredFlights.filter((f) => {
    const trail = trailsRef.current.get(f.icao_hex);
    return trail && trail.positions.length >= 2;
  }).length;

  return (
    <div className="space-y-3">
      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>
            {loading
              ? "Scanning..."
              : `${filteredFlights.length} of ${allFlights.length} aircraft shown`}
          </span>
          {trailCount > 0 && (
            <span>
              ({trailCount} trail{trailCount !== 1 ? "s" : ""})
            </span>
          )}
          {error && <span className="text-red-500">{error}</span>}
        </div>
        {lastFetch > 0 && (
          <span>Updated {new Date(lastFetch).toLocaleTimeString()}</span>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Filters
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showCloudSeeding}
              onChange={(e) => setShowCloudSeeding(e.target.checked)}
              className="rounded accent-orange-500"
            />
            <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
            Cloud Seeding Alt
            {bandCounts.cloud_seeding > 0 && (
              <span className="text-muted-foreground">
                ({bandCounts.cloud_seeding})
              </span>
            )}
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showHighAltitude}
              onChange={(e) => setShowHighAltitude(e.target.checked)}
              className="rounded accent-purple-500"
            />
            <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
            High Altitude
            {bandCounts.high_altitude > 0 && (
              <span className="text-muted-foreground">
                ({bandCounts.high_altitude})
              </span>
            )}
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showOther}
              onChange={(e) => setShowOther(e.target.checked)}
              className="rounded accent-blue-500"
            />
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            Other
            {bandCounts.normal > 0 && (
              <span className="text-muted-foreground">
                ({bandCounts.normal})
              </span>
            )}
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showGround}
              onChange={(e) => setShowGround(e.target.checked)}
              className="rounded accent-gray-500"
            />
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
            Ground
            {bandCounts.ground > 0 && (
              <span className="text-muted-foreground">
                ({bandCounts.ground})
              </span>
            )}
          </label>
        </div>
        <div className="border-t border-border pt-2 mt-1 space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={watchOnly}
              onChange={(e) => setWatchOnly(e.target.checked)}
              className="rounded accent-red-500"
            />
            Show only flagged aircraft (Watch + WX MOD)
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showAltitudeOnMap}
              onChange={(e) => setShowAltitudeOnMap(e.target.checked)}
              className="rounded"
            />
            Show altitude labels on map
          </label>
        </div>
      </div>

      {/* Flight list */}
      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {filteredFlights.map((flight) => {
          const band = getAltitudeBand(flight.altitude_ft);
          const tag = ALTITUDE_TAGS[band];
          const trail = trailsRef.current.get(flight.icao_hex);
          const hasTrail = trail && trail.positions.length >= 2;

          return (
            <button
              key={flight.icao_hex}
              onClick={() => onFlightSelect?.(flight)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                band === "cloud_seeding"
                  ? "border-orange-200 bg-orange-50/50 hover:bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20 dark:hover:bg-orange-950/40"
                  : band === "high_altitude"
                    ? "border-purple-200 bg-purple-50/50 hover:bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20 dark:hover:bg-purple-950/40"
                    : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-medium text-sm">
                      {flight.tail_number || flight.icao_hex}
                    </span>
                    {flight.callsign && (
                      <span className="text-xs text-muted-foreground">
                        ({flight.callsign})
                      </span>
                    )}
                    {flight.is_known_wx_mod && (
                      <Badge variant="destructive" className="text-xs">
                        WX MOD
                      </Badge>
                    )}
                    {!flight.is_known_wx_mod && flight.suspicion_score >= 3 && (
                      <span className="text-xs px-1.5 py-0.5 rounded border font-medium bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700">
                        Watch
                      </span>
                    )}
                    {!flight.is_known_wx_mod && flight.suspicion_score >= 2 && flight.suspicion_score < 3 && (
                      <span className="text-xs px-1.5 py-0.5 rounded border font-medium bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700">
                        Interest
                      </span>
                    )}
                    {tag.label && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border font-medium ${tag.className}`}
                      >
                        {tag.label}
                      </span>
                    )}
                    {hasTrail && (
                      <span className="text-xs text-muted-foreground">
                        {trail.positions.length} pts
                      </span>
                    )}
                  </div>
                  {flight.aircraft_description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {flight.aircraft_description}
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0 ml-2">
                  <p className="font-medium">
                    {flight.altitude_ft.toLocaleString()} ft
                  </p>
                  <p>{Math.round(flight.speed_kts)} kts</p>
                </div>
              </div>
              {flight.operator_notes && (
                <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                  {flight.operator_notes}
                </p>
              )}
              {flight.suspicion_reasons.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {flight.suspicion_reasons.join(" · ")}
                </p>
              )}
            </button>
          );
        })}

        {filteredFlights.length === 0 && !loading && allFlights.length > 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No aircraft match your current filters. Try enabling more altitude
            bands above.
          </p>
        )}

        {allFlights.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No aircraft detected in this area. Try zooming out or panning to a
            different location.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="border-t border-border pt-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Tags &amp; Trail Colors
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">WX</span>
            Known weather mod operator
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold border border-red-300">Watch</span>
            Multiple suspicion signals
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[10px] font-bold border border-yellow-300">Interest</span>
            Some suspicion signals
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400" />
            Cloud Seeding Alt (3-20K ft)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-400" />
            High Altitude (25-45K ft)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
            Other / Transit
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground/70">
          Scoring: non-commercial + small aircraft + seeding altitude + low speed + tail number callsign. Airlines passing through are scored low.
        </p>
      </div>

      {/* Learn More */}
      <LearnMoreSection />
    </div>
  );
}

function LearnMoreSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-border pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        Learn More: How We Flag &amp; Score Aircraft
      </button>

      {expanded && (
        <div className="mt-3 space-y-4 text-xs text-muted-foreground leading-relaxed">
          {/* Cloud Seeding */}
          <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400" />
              <p className="font-semibold text-foreground">
                Cloud Seeding Altitude (3,000 - 20,000 ft)
              </p>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded border border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300">
                High Confidence
              </span>
            </div>
            <p>
              <strong>What it is:</strong> Cloud seeding is the most common and
              well-documented form of weather modification. Operators fly into or
              just below existing clouds and release silver iodide, dry ice, or
              other nucleating agents to trigger or enhance precipitation (rain
              or snow).
            </p>
            <p className="mt-2">
              <strong>Why this altitude:</strong> The clouds targeted for seeding
              &mdash; convective cumulus and orographic clouds &mdash; typically
              form between 3,000 and 20,000 feet depending on geography and
              weather conditions. The aircraft must fly at cloud level to inject
              the seeding material directly. In mountainous regions (like Idaho,
              Utah, Colorado), operations can happen as low as 3,000 ft. In
              flatter terrain, cloud bases are typically higher (6,000-12,000 ft).
            </p>
            <p className="mt-2">
              <strong>How we know:</strong> This altitude range comes from
              published operational data from Weather Modification International
              (the world&apos;s largest operator), state weather modification
              permits (Texas, North Dakota, Idaho), Bureau of Reclamation
              program reports, and peer-reviewed atmospheric science research.
              The operators themselves file NOAA reports documenting their
              operational altitudes.
            </p>
            <p className="mt-2">
              <strong>Aircraft types:</strong> Cloud seeding is typically done by
              twin-turboprop aircraft (Beechcraft King Air, Piper Cheyenne) or
              single-engine planes. If you see a small turboprop at 8,000-12,000
              ft in an area with active weather modification permits, that is a
              strong signal.
            </p>
            <p className="mt-2">
              <strong>Limitation:</strong> Many normal flights also operate in
              this altitude range &mdash; small private planes, regional
              commuters, helicopters. Being at cloud seeding altitude does NOT
              mean an aircraft is cloud seeding. The altitude band is a filter to
              help you focus attention, not a conclusion. Cross-reference with
              the aircraft owner (click to see FAA registration) and check if
              they are a known weather modification operator.
            </p>
          </div>

          {/* High Altitude */}
          <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-400" />
              <p className="font-semibold text-foreground">
                High Altitude (25,000 - 45,000 ft)
              </p>
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded border border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                Moderate Confidence
              </span>
            </div>
            <p>
              <strong>What happens here:</strong> This is the standard cruising
              altitude for commercial jets. At these altitudes, temperatures drop
              below -40&deg;C, which is where persistent contrails form &mdash;
              the white lines that linger in the sky for minutes to hours. This
              is confirmed atmospheric physics: jet exhaust contains water vapor
              that freezes into ice crystals in cold, humid air.
            </p>
            <p className="mt-2">
              <strong>Why we flag it:</strong> Proposed stratospheric aerosol
              injection (SAI) programs would operate in this altitude range or
              higher. While large-scale SAI has not been confirmed as deployed,
              research programs exist (Harvard SCoPEx was proposed at 60,000+ ft
              but cancelled; Cornell/Indiana University received NSF funding for
              SAI research). The one known private SAI operator, Make Sunsets,
              uses balloons rather than aircraft.
            </p>
            <p className="mt-2">
              <strong>Limitation:</strong> The vast majority of aircraft at this
              altitude are commercial airlines on normal routes. This band is
              flagged because it&apos;s where persistent contrails form and where
              proposed geoengineering would occur, but seeing a plane here is
              not unusual. Again, click to check the owner &mdash; a commercial
              airline is routine; an unregistered aircraft or one owned by a
              research institution would be more noteworthy.
            </p>
          </div>

          {/* Tags Explained */}
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-3">
            <p className="font-semibold text-foreground mb-2">
              Tags: WX MOD, Watch, Interest
            </p>
            <p>
              Every aircraft gets automatically scored based on how closely it
              matches the profile of a weather modification flight. The tags help
              you cut through the noise and focus on what matters.
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 inline-block px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">
                  WX MOD
                </span>
                <p>
                  <strong>Known operator.</strong> The aircraft is registered to
                  a company we&apos;ve confirmed does weather modification
                  (Weather Modification International, Idaho Power, Rainmaker,
                  Make Sunsets, etc.). These are flagged from FAA registration
                  records. Automatic top priority.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold border border-red-300">
                  Watch
                </span>
                <p>
                  <strong>Score 3+.</strong> Multiple signals match the cloud
                  seeding profile. Worth clicking to investigate the owner.
                  These are non-commercial, small aircraft at seeding altitude
                  flying slow &mdash; the exact profile of an active cloud
                  seeding flight.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 inline-block px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[10px] font-bold border border-yellow-300">
                  Interest
                </span>
                <p>
                  <strong>Score 2-3.</strong> Some signals present but not the
                  full profile. Could be a private plane, a training flight, or
                  something worth a second look.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 text-muted-foreground text-[10px]">
                  No tag
                </span>
                <p>
                  <strong>Score under 2.</strong> Likely a commercial airline or
                  normal traffic. An American Airlines flight at 8,000 ft going
                  from Nashville to New York scores low because it has an
                  airline callsign &mdash; it&apos;s just climbing through the
                  altitude band, not operating there.
                </p>
              </div>
            </div>
          </div>

          {/* How Scoring Works */}
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="font-semibold text-foreground mb-2">
              How the Score Is Calculated
            </p>
            <p className="mb-3">
              Each aircraft is scored on 5 signals. The more signals that match,
              the higher the score and the more likely it&apos;s worth
              investigating.
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span>At cloud seeding altitude (3-20K ft)</span>
                <span className="font-mono font-bold">+1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Non-commercial (no airline callsign)</span>
                <span className="font-mono font-bold">+1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Small prop or turboprop aircraft type</span>
                <span className="font-mono font-bold">+1.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Flying slow at seeding altitude (&lt;250 kts)</span>
                <span className="font-mono font-bold">+0.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Using tail number as callsign (N-number)</span>
                <span className="font-mono font-bold">+0.5</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-1.5 mt-1.5">
                <span className="font-medium">Maximum possible</span>
                <span className="font-mono font-bold">4.5</span>
              </div>
            </div>
            <p className="mt-3">
              <strong>Example:</strong> A Beechcraft King Air (turboprop) at
              9,000 ft flying 160 knots with callsign N400WM scores 4.5 and
              gets a red &quot;Watch&quot; tag. A Delta 737 at 8,000 ft going
              450 knots with callsign DAL1234 scores 0. Both are at the same
              altitude, but the scoring separates them instantly.
            </p>
          </div>

          {/* Important context */}
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="font-semibold text-foreground mb-2">
              Important Context
            </p>
            <p>
              Scoring is a tool for prioritizing attention, not drawing
              conclusions. A high score means the aircraft matches the profile
              &mdash; it does not prove it&apos;s doing anything. Always click
              to check the owner. A &quot;Watch&quot; aircraft owned by Weather
              Modification International is a much stronger signal than a
              &quot;Watch&quot; aircraft owned by a flight school.
            </p>
            <p className="mt-2">
              <strong>Sources:</strong> Aircraft types from FAA registry and
              ADS-B type codes. Operator data from NOAA reports, state permits,
              and company filings. Altitude ranges from published operational
              data and atmospheric science research.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
