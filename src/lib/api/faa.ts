/**
 * FAA Aircraft Registry lookup.
 *
 * The FAA publishes the entire registry as downloadable CSVs at:
 * https://registry.faa.gov/database/ReleasableAircraft.zip
 *
 * For real-time lookups without a local database, we use the
 * FAA registry web search and parse the results.
 *
 * Known weather modification operators to flag:
 */

export interface FAARegistration {
  tailNumber: string;
  serialNumber: string;
  make: string;
  model: string;
  year: string;
  ownerName: string;
  ownerStreet: string;
  ownerCity: string;
  ownerState: string;
  ownerZip: string;
  ownerCountry: string;
  registrationType: string;
  status: string;
  isKnownWeatherMod: boolean;
  operatorNotes: string;
}

// Known weather modification operators — built from canonical data in operators.ts
import { buildWxModLookup } from "@/lib/data/operators";
const KNOWN_WX_MOD_OPERATORS: Record<string, string> = buildWxModLookup();

/**
 * Look up aircraft registration by tail number using the FAA API.
 */
export async function lookupTailNumber(
  tailNumber: string
): Promise<FAARegistration | null> {
  // Clean the tail number (remove N prefix for API, add it back)
  const cleaned = tailNumber.toUpperCase().replace(/^N/, "");

  try {
    // Use the FAA registry inquiry API
    const url = `https://registry.faa.gov/AircraftInquiry/Search/NNumberResult?nNumberTxt=N${cleaned}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "SkyLedger/1.0 (citizen transparency platform)",
      },
    });

    if (!res.ok) return null;

    const html = await res.text();

    // Parse key fields from the HTML response
    const registration = parseRegistrationHTML(html, `N${cleaned}`);
    return registration;
  } catch {
    return null;
  }
}

function parseRegistrationHTML(
  html: string,
  tailNumber: string
): FAARegistration | null {
  // Extract data from the FAA HTML tables
  const extract = (label: string): string => {
    // Look for table cells with the label followed by the value
    const patterns = [
      new RegExp(`${label}[^<]*</td>\\s*<td[^>]*>([^<]+)</td>`, "i"),
      new RegExp(`${label}[^<]*</label>\\s*<span[^>]*>([^<]+)</span>`, "i"),
      new RegExp(`"${label}"[^>]*>([^<]+)<`, "i"),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1].trim();
    }
    return "";
  };

  const ownerName = extract("Name") || extract("name");

  // If we couldn't parse any data, return basic info
  if (!ownerName && !html.includes("NNumberResult")) {
    return null;
  }

  // Check if this is a known weather modification operator
  let isKnownWeatherMod = false;
  let operatorNotes = "";
  const upperOwner = ownerName.toUpperCase();

  for (const [keyword, notes] of Object.entries(KNOWN_WX_MOD_OPERATORS)) {
    if (upperOwner.includes(keyword)) {
      isKnownWeatherMod = true;
      operatorNotes = notes;
      break;
    }
  }

  return {
    tailNumber,
    serialNumber: extract("Serial Number"),
    make: extract("Manufacturer"),
    model: extract("Model"),
    year: extract("Year"),
    ownerName,
    ownerStreet: extract("Street"),
    ownerCity: extract("City"),
    ownerState: extract("State"),
    ownerZip: extract("Zip"),
    ownerCountry: extract("Country") || "US",
    registrationType: extract("Type Registration"),
    status: extract("Status"),
    isKnownWeatherMod,
    operatorNotes,
  };
}

/**
 * Check if an owner name matches known weather modification operators.
 */
export function checkWeatherModOperator(ownerName: string): {
  isMatch: boolean;
  notes: string;
} {
  const upper = ownerName.toUpperCase();
  for (const [keyword, notes] of Object.entries(KNOWN_WX_MOD_OPERATORS)) {
    if (upper.includes(keyword)) {
      return { isMatch: true, notes };
    }
  }
  return { isMatch: false, notes: "" };
}
