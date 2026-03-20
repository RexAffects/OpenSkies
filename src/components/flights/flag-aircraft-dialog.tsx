"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FLAG_REASONS } from "@/lib/constants";

interface FlagAircraftDialogProps {
  tailNumber: string;
  icaoHex?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitudeFt?: number | null;
  suspicionScore?: number;
}

export function FlagAircraftDialog({
  tailNumber,
  icaoHex,
  latitude,
  longitude,
  altitudeFt,
  suspicionScore,
}: FlagAircraftDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    threat_level?: string;
    unique_reporters?: number;
  } | null>(null);

  async function handleSubmit() {
    if (!reason) return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tail_number: tailNumber,
          icao_hex: icaoHex || undefined,
          reason,
          reporter_notes: notes || undefined,
          latitude: latitude || undefined,
          longitude: longitude || undefined,
          altitude_ft: altitudeFt || undefined,
          suspicion_score: suspicionScore,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          message: data.message,
          threat_level: data.threat_level,
          unique_reporters: data.unique_reporters,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Something went wrong.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setOpen(false);
    // Reset form after close animation
    setTimeout(() => {
      setReason("");
      setNotes("");
      setResult(null);
    }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="w-full mt-3" />
        }
      >
        Flag This Aircraft
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Flag Aircraft</DialogTitle>
          <DialogDescription>
            Report <Badge variant="outline" className="font-mono mx-1">{tailNumber}</Badge> as
            a suspected weather modification aircraft.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="py-4">
            <div
              className={`rounded-lg p-4 ${
                result.success
                  ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  result.success
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {result.message}
              </p>
              {result.success && result.unique_reporters && (
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  This aircraft now has {result.unique_reporters} community{" "}
                  {result.unique_reporters === 1 ? "report" : "reports"}.
                </p>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div>
                <label
                  htmlFor="flag-reason"
                  className="text-xs font-medium text-foreground"
                >
                  Reason *
                </label>
                <select
                  id="flag-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a reason...</option>
                  {FLAG_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="flag-notes"
                  className="text-xs font-medium text-foreground"
                >
                  Additional notes (optional)
                </label>
                <Textarea
                  id="flag-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you observe? Any details that could help others."
                  maxLength={500}
                  className="mt-1"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  {notes.length}/500
                </p>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Your IP is hashed for abuse prevention and not stored in
                identifiable form. Flags are anonymous.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!reason || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit Flag"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
