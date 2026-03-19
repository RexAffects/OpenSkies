"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getOperatorSlugFromOwnerName } from "@/lib/data/operators";

interface FlightDetail {
  icao_hex: string | null;
  tail_number: string | null;
  callsign: string | null;
  aircraft_type: string | null;
  aircraft_description: string | null;
  aircraft_photo: string | null;
  aircraft_photo_thumbnail: string | null;
  owner: {
    name: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    is_known_wx_mod: boolean;
    operator_notes: string;
  };
  registration: {
    make: string;
    model: string;
    year: string;
    serial_number: string;
    status: string;
    type: string;
  } | null;
  route: {
    origin: {
      icao: string;
      iata: string | null;
      name: string | null;
      city: string | null;
      country: string | null;
    } | null;
    destination: {
      icao: string;
      iata: string | null;
      name: string | null;
      city: string | null;
      country: string | null;
    } | null;
    airline: string | null;
  };
  position: {
    latitude: number;
    longitude: number;
    altitude_ft: number | null;
    speed_kts: number | null;
    heading: number | null;
    squawk: string | null;
    on_ground: boolean;
  } | null;
}

interface FlightDetailPanelProps {
  hex: string;
  callsign?: string;
  tail?: string;
  onClose: () => void;
}

export function FlightDetailPanel({
  hex,
  callsign,
  tail,
  onClose,
}: FlightDetailPanelProps) {
  const [data, setData] = useState<FlightDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (hex) params.set("hex", hex);
      if (callsign) params.set("callsign", callsign);
      if (tail) params.set("tail", tail);

      try {
        const res = await fetch(`/api/flights/detail?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [hex, callsign, tail]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-red-500">
            {error || "Could not load aircraft details"}
          </p>
          <Button variant="outline" size="sm" onClick={onClose} className="mt-2">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-mono">
                {data.tail_number || data.icao_hex || "Unknown"}
              </CardTitle>
              {data.owner.is_known_wx_mod && (
                <Badge variant="destructive">Weather Modification</Badge>
              )}
            </div>
            {data.callsign && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Callsign: {data.callsign}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* WX Mod Alert */}
        {data.owner.is_known_wx_mod && data.owner.operator_notes && (() => {
          const operatorSlug = data.owner.name
            ? getOperatorSlugFromOwnerName(data.owner.name)
            : null;
          return (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Known Weather Modification Operator
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                {data.owner.operator_notes}
              </p>
              {operatorSlug && (
                <Link
                  href={`/learn/operators/${operatorSlug}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-800 dark:text-red-200 hover:underline"
                >
                  See who&apos;s behind this operator &rarr;
                </Link>
              )}
            </div>
          );
        })()}

        {/* Route */}
        <Section title="Route">
          {data.route.origin || data.route.destination ? (
            <>
              <div className="flex items-center gap-3">
                <AirportDisplay airport={data.route.origin} label="From" />
                <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
                <AirportDisplay airport={data.route.destination} label="To" />
              </div>
              {data.route.airline && (
                <p className="text-xs text-muted-foreground mt-2">
                  Airline: {data.route.airline}
                </p>
              )}
            </>
          ) : (
            <div className="rounded-md bg-muted/50 p-2.5">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Route not available.</span>{" "}
                Route data is only available for commercial airline flights with
                published schedules. Private planes, general aviation, and
                military aircraft typically don&apos;t publish their routes
                &mdash; which can make them more interesting to investigate.
                Check the owner info below.
              </p>
            </div>
          )}
        </Section>

        {/* Live Position */}
        {data.position && (
          <Section title="Live Position">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <DetailRow
                label="Altitude"
                value={
                  data.position.on_ground
                    ? "On Ground"
                    : data.position.altitude_ft
                      ? `${data.position.altitude_ft.toLocaleString()} ft`
                      : "Unknown"
                }
              />
              <DetailRow
                label="Speed"
                value={
                  data.position.speed_kts
                    ? `${Math.round(data.position.speed_kts)} kts`
                    : "Unknown"
                }
              />
              <DetailRow
                label="Heading"
                value={
                  data.position.heading
                    ? `${Math.round(data.position.heading)}°`
                    : "Unknown"
                }
              />
              <DetailRow
                label="Squawk"
                value={data.position.squawk || "N/A"}
              />
              <DetailRow
                label="Latitude"
                value={data.position.latitude.toFixed(4)}
              />
              <DetailRow
                label="Longitude"
                value={data.position.longitude.toFixed(4)}
              />
            </div>
          </Section>
        )}

        {/* Owner */}
        <Section title="Owner">
          <DetailRow
            label="Name"
            value={data.owner.name || "Unknown"}
          />
          {(data.owner.city || data.owner.state) && (
            <DetailRow
              label="Location"
              value={
                [data.owner.city, data.owner.state, data.owner.country]
                  .filter(Boolean)
                  .join(", ")
              }
            />
          )}
        </Section>

        {/* Aircraft */}
        <Section title="Aircraft">
          {data.aircraft_description && (
            <DetailRow label="Type" value={data.aircraft_description} />
          )}
          {data.registration && (
            <>
              {data.registration.make && (
                <DetailRow
                  label="Make / Model"
                  value={`${data.registration.make} ${data.registration.model}`}
                />
              )}
              {data.registration.year && (
                <DetailRow label="Year" value={data.registration.year} />
              )}
              {data.registration.serial_number && (
                <DetailRow
                  label="Serial Number"
                  value={data.registration.serial_number}
                />
              )}
              {data.registration.status && (
                <DetailRow label="Status" value={data.registration.status} />
              )}
            </>
          )}
        </Section>

        {/* Photo */}
        {data.aircraft_photo_thumbnail && (
          <Section title="Photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.aircraft_photo_thumbnail}
              alt={`${data.tail_number || "Aircraft"}`}
              className="rounded-md max-h-40 w-full object-cover"
            />
          </Section>
        )}

        {/* Raw identifiers */}
        <div className="pt-2 border-t border-border">
          <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
            {data.icao_hex && <span>ICAO: {data.icao_hex}</span>}
            {data.tail_number && <span>Tail: {data.tail_number}</span>}
            {data.aircraft_type && <span>Type: {data.aircraft_type}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}: </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function AirportDisplay({
  airport,
  label,
}: {
  airport: {
    icao: string;
    iata: string | null;
    name: string | null;
    city: string | null;
  } | null;
  label: string;
}) {
  if (!airport) {
    return (
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">Unknown</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold font-mono">
        {airport.iata || airport.icao}
      </p>
      {airport.name && (
        <p className="text-xs text-muted-foreground">{airport.name}</p>
      )}
      {airport.city && (
        <p className="text-xs text-muted-foreground">{airport.city}</p>
      )}
    </div>
  );
}
