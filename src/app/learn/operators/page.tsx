import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OPERATORS, CATEGORY_LABELS } from "@/lib/data/operators";

export const metadata: Metadata = {
  title: "Operator Profiles — Who's Behind It",
  description:
    "Detailed profiles of every known weather modification and geoengineering operator: founders, investors, funding, and connections. All sourced from public records.",
};

export default function OperatorsIndexPage() {
  // Group operators by category
  const operatorCompanies = OPERATORS.filter(
    (op) => op.category !== "funding" && op.category !== "research-advocacy"
  );
  const fundingEntities = OPERATORS.filter(
    (op) => op.category === "funding" || op.category === "research-advocacy"
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold">Who&apos;s Behind It</h1>
        <p className="mt-2 text-muted-foreground">
          Every known weather modification and geoengineering operator, profiled.
          Founders, investors, funding amounts, and how they connect to each
          other. All claims sourced from public records.
        </p>
      </div>

      {/* Operators */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Operators &amp; Startups
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {operatorCompanies.map((op) => (
            <Link key={op.slug} href={`/learn/operators/${op.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{op.name}</h3>
                    <Badge variant="outline" className="text-[10px]">
                      {CATEGORY_LABELS[op.category]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {op.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Founded: {op.founded}</span>
                    <span>HQ: {op.headquarters}</span>
                    {op.totalFunding && (
                      <span className="font-medium text-foreground">
                        {op.totalFunding} raised
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    {op.people.length > 0 && (
                      <span>{op.people.length} key people</span>
                    )}
                    {op.funding.length > 0 && (
                      <span>{op.funding.length} funding rounds</span>
                    )}
                    {op.connections.length > 0 && (
                      <span>{op.connections.length} connections</span>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-primary font-medium">
                    View full profile &rarr;
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Funding entities */}
      {fundingEntities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold border-b border-border pb-2">
            Follow the Money
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The investors and organizations that fund geoengineering across
            multiple companies and levels (research, lobbying, deployment).
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fundingEntities.map((op) => (
              <Link key={op.slug} href={`/learn/operators/${op.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{op.name}</h3>
                      <Badge variant="outline" className="text-[10px]">
                        {CATEGORY_LABELS[op.category]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {op.description}
                    </p>
                    {op.connections.length > 0 && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                        {op.connections.length} connections to other
                        geoengineering entities
                      </p>
                    )}
                    <p className="mt-3 text-xs text-primary font-medium">
                      View full profile &rarr;
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Data note */}
      <div className="mt-10 rounded-lg bg-muted/30 border border-border p-4">
        <p className="text-xs text-muted-foreground">
          All information sourced from public records: news reporting, SEC
          filings, company websites, government databases, and investigative
          journalism. Every claim on individual profile pages is linked to its
          source. We present documented facts &mdash; not accusations.
        </p>
      </div>
    </div>
  );
}
