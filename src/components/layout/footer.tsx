import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold">{SITE_NAME}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Citizen-powered transparency for weather modification
              accountability. Open source. Open data. Open skies.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Platform</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/map"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Live Map
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/reports/new"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Submit Observation
                </Link>
              </li>
              <li>
                <Link
                  href="/learn/operators"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Operator Profiles
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">About</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Mission & Methodology
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/RexAffects/OpenSkies"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground">
            All data sourced from public government databases and citizen
            observations. AGPL-3.0 Licensed. This platform does not make
            accusations &mdash; it presents documented observations and public
            records.
          </p>
        </div>
      </div>
    </footer>
  );
}
