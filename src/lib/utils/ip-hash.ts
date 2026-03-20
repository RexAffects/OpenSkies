import { createHash } from "crypto";

/**
 * Hash a reporter's IP with a daily-rotating salt.
 * Same IP gets the same hash within one day, different hash the next.
 * Raw IP is never stored.
 */
export function hashReporter(ip: string): string {
  const salt = process.env.FLAG_SALT || "default-salt";
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return createHash("sha256").update(`${ip}:${salt}:${today}`).digest("hex");
}

/**
 * Extract client IP from request headers.
 * Works on Vercel (x-forwarded-for) and local dev.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

/**
 * Extract /24 subnet from an IP for cluster detection.
 * "192.168.1.55" → "192.168.1"
 */
export function getSubnet(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) {
    return parts.slice(0, 3).join(".");
  }
  return ip; // IPv6 or unexpected format — return as-is
}
