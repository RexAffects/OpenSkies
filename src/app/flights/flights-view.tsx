"use client";

import { useState, useCallback } from "react";
import { AircraftLookup } from "@/components/flights/aircraft-card";
import { FlightLayer } from "@/components/map/flight-layer";
import { FlightDetailPanel } from "@/components/flights/flight-detail-panel";
import { MapContainer, type FlightTrail } from "@/components/map/map-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FlightsView() {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [showFlights, setShowFlights] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<{
    tail_number: string | null;
    callsign: string | null;
    icao_hex: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [flightTrails, setFlightTrails] = useState<FlightTrail[]>([]);
  const [radius, setRadius] = useState(50);

  const handleTrailsUpdate = useCallback((trails: FlightTrail[]) => {
    setFlightTrails(trails);
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setMapCenter({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setShowFlights(true);
    });
  };

  return (
    <div className="space-y-8">
      {/* Aircraft Lookup */}
      <AircraftLookup />

      {/* Live Flight Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Flight Tracker</CardTitle>
            <Button onClick={handleUseMyLocation} variant="outline" size="sm">
              {mapCenter ? "Update Location" : "Use My Location"}
            </Button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <label className="text-xs text-muted-foreground shrink-0">
              Radius:
            </label>
            <div className="flex gap-1">
              {[5, 10, 25, 50].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    radius === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {r} nm
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              (~{Math.round(radius * 1.15)} miles)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click any aircraft to see full details including owner, route, and
            airports. Data refreshes every 10 seconds.
          </p>
        </CardHeader>
        <CardContent>
          {!showFlights ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground/50"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold">
                Ready to scan your skies
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Click &quot;Use My Location&quot; to see aircraft near you in
                real-time.
              </p>
              <Button onClick={handleUseMyLocation} className="mt-4">
                Start Scanning
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Map */}
                <div>
                  <MapContainer
                    center={
                      mapCenter
                        ? [mapCenter.lat, mapCenter.lng]
                        : undefined
                    }
                    zoom={10}
                    className="h-[400px] w-full"
                    flightTrails={flightTrails}
                    reports={
                      selectedFlight
                        ? [
                            {
                              id: selectedFlight.icao_hex,
                              latitude: selectedFlight.latitude,
                              longitude: selectedFlight.longitude,
                              observed_at: new Date().toISOString(),
                              observation_type: "aircraft",
                              aircraft_count: null,
                              duration_minutes: null,
                              trail_behavior: null,
                              notes: selectedFlight.tail_number || selectedFlight.icao_hex,
                              photo_urls: [],
                              evidence_hash: "",
                              exif_data: null,
                              weather_conditions: null,
                              verification_level: 3,
                              status: "active",
                              created_at: new Date().toISOString(),
                            },
                          ]
                        : []
                    }
                  />
                </div>

                {/* Flight list */}
                <div>
                  <FlightLayer
                    mapCenter={mapCenter}
                    radius={radius}
                    onTrailsUpdate={handleTrailsUpdate}
                    onFlightSelect={(flight) =>
                      setSelectedFlight({
                        tail_number: flight.tail_number,
                        callsign: flight.callsign,
                        icao_hex: flight.icao_hex,
                        latitude: flight.latitude,
                        longitude: flight.longitude,
                      })
                    }
                  />
                </div>
              </div>

              {/* Detail Panel — appears when you click on an aircraft */}
              {selectedFlight && (
                <FlightDetailPanel
                  hex={selectedFlight.icao_hex}
                  callsign={selectedFlight.callsign || undefined}
                  tail={selectedFlight.tail_number || undefined}
                  onClose={() => setSelectedFlight(null)}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <div className="rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">How flight tracking works</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. ADS-B Reception</p>
            <p className="mt-1">
              Aircraft broadcast their position on 1090 MHz. Thousands of
              volunteer antennas worldwide receive these signals and feed them
              to ADSB.lol — an unfiltered, open-data network.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. FAA Registry</p>
            <p className="mt-1">
              Every U.S.-registered aircraft has a tail number linked to an
              owner in the FAA database. This database is public and updated
              daily. We cross-reference to show you who owns what&apos;s flying.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. Route & Operator Info</p>
            <p className="mt-1">
              Click any aircraft to see its departure and arrival airports,
              owner details, and whether it belongs to a known weather
              modification operator. All from free, public data sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
