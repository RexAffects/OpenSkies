export const SITE_NAME = "SkyLedger";
export const SITE_DESCRIPTION =
  "Citizen-powered transparency platform for weather modification accountability. Track flights, document observations, access public records.";
export const SITE_URL = "https://skyledger.app";

export const OBSERVATION_TYPES = [
  { value: "persistent_trail", label: "Persistent Trail" },
  { value: "spray_pattern", label: "Spray Pattern" },
  { value: "unusual_aerial_pattern", label: "Unusual Aerial Pattern" },
  { value: "low_altitude_aircraft", label: "Low Altitude Aircraft" },
  { value: "grid_pattern", label: "Grid Pattern" },
  { value: "on_off_trail", label: "On/Off Trail" },
  { value: "null_report", label: "Nothing Unusual (Null Report)" },
  { value: "other", label: "Other" },
] as const;

export const TRAIL_BEHAVIORS = [
  { value: "dissipated_quickly", label: "Dissipated Quickly (< 30 seconds)" },
  { value: "persisted", label: "Persisted (minutes to hours)" },
  { value: "spread_into_haze", label: "Spread Into Haze" },
  { value: "fell_to_ground", label: "Appeared to Fall Toward Ground" },
  { value: "changed_color", label: "Changed Color" },
  { value: "other", label: "Other" },
] as const;

export const VERIFICATION_LEVELS = {
  1: { label: "Unverified", color: "bg-gray-500" },
  2: { label: "Corroborated", color: "bg-blue-500" },
  3: { label: "Flight-Matched", color: "bg-green-500" },
  4: { label: "Expert Verified", color: "bg-purple-500" },
} as const;

export const FLAG_REASONS = [
  { value: "suspected_cloud_seeding", label: "Suspected Cloud Seeding Operation" },
  { value: "unusual_flight_pattern", label: "Unusual Flight Pattern (circling, grid)" },
  { value: "spray_visible", label: "Visible Spray / Dispersal" },
  { value: "repeated_sighting", label: "Repeated Sighting of This Aircraft" },
  { value: "known_operator_area", label: "Operating in Known WX Mod Area" },
  { value: "other", label: "Other (explain in notes)" },
] as const;

export const THREAT_LEVELS = {
  none: { label: "None", color: "" },
  low: { label: "Reported", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  medium: { label: "Flagged", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  high: { label: "High Concern", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
} as const;

export const DEFAULT_MAP_CENTER: [number, number] = [39.8283, -98.5795]; // Center of US
export const DEFAULT_MAP_ZOOM = 5;
