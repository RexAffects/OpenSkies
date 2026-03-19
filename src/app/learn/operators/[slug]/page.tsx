import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getOperatorBySlug,
  getAllOperatorSlugs,
  CATEGORY_LABELS,
  type Operator,
  type Person,
  type FundingRound,
  type Investor,
  type Connection,
  type OperatorSource,
} from "@/lib/data/operators";

export async function generateStaticParams() {
  return getAllOperatorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const op = getOperatorBySlug(slug);
  if (!op) return { title: "Operator Not Found" };
  return {
    title: `${op.name} — Operator Profile`,
    description: op.description,
  };
}

export default async function OperatorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const op = getOperatorBySlug(slug);
  if (!op) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/learn/operators"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; All operators
      </Link>

      {/* Header */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold">{op.name}</h1>
          <Badge variant="outline">{CATEGORY_LABELS[op.category]}</Badge>
          <StatusBadge status={op.status} />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>Founded: {op.founded}</span>
          <span>HQ: {op.headquarters}</span>
          {op.totalFunding && <span>Total Funding: {op.totalFunding}</span>}
          {op.website && (
            <a
              href={op.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Website &rarr;
            </a>
          )}
        </div>
        <p className="mt-4 text-muted-foreground">{op.description}</p>
      </div>

      {/* Key Facts */}
      {op.keyFacts.length > 0 && (
        <Section title="Key Facts">
          <ul className="space-y-2">
            {op.keyFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                {fact}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Who's Behind It */}
      {op.people.length > 0 && (
        <Section title="Who's Behind It">
          <div className="space-y-4">
            {op.people.map((person) => (
              <PersonCard key={person.name} person={person} />
            ))}
          </div>
        </Section>
      )}

      {/* Follow the Money */}
      {op.funding.length > 0 && (
        <Section title="Follow the Money">
          <div className="space-y-6">
            {op.funding.map((round, i) => (
              <FundingRoundCard key={i} round={round} />
            ))}
          </div>
        </Section>
      )}

      {/* Connections */}
      {op.connections.length > 0 && (
        <Section title="Connections">
          <div className="space-y-3">
            {op.connections.map((conn, i) => (
              <ConnectionCard key={i} connection={conn} />
            ))}
          </div>
        </Section>
      )}

      {/* Sources */}
      {op.sources.length > 0 && (
        <Section title="Sources">
          <ol className="space-y-1 list-decimal list-inside">
            {op.sources.map((source, i) => (
              <li key={i} className="text-sm">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Back link */}
      <div className="mt-10 border-t border-border pt-6">
        <Link
          href="/learn/operators"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to all operators
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold border-b border-border pb-2">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StatusBadge({ status }: { status: Operator["status"] }) {
  const variants: Record<Operator["status"], "default" | "destructive" | "secondary"> = {
    active: "default",
    disbanded: "secondary",
    "under-investigation": "destructive",
  };
  const labels: Record<Operator["status"], string> = {
    active: "Active",
    disbanded: "Disbanded",
    "under-investigation": "Under Investigation",
  };
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{person.name}</p>
        {person.nationality && (
          <span className="text-xs text-muted-foreground">
            ({person.nationality})
          </span>
        )}
      </div>
      <p className="text-sm text-primary">{person.role}</p>
      <p className="mt-2 text-sm text-muted-foreground">{person.background}</p>
      {person.connections && person.connections.length > 0 && (
        <div className="mt-2">
          {person.connections.map((conn, i) => (
            <p key={i} className="text-xs text-muted-foreground italic">
              &bull; {conn}
            </p>
          ))}
        </div>
      )}
      {person.sources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {person.sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              [{source.label}]
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FundingRoundCard({ round }: { round: FundingRound }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <Badge variant="outline">{round.type}</Badge>
        <span className="text-lg font-bold">{round.amount}</span>
        <span className="text-sm text-muted-foreground">{round.date}</span>
      </div>
      <div className="mt-3 space-y-3">
        {round.investors.map((investor, i) => (
          <InvestorRow key={i} investor={investor} />
        ))}
      </div>
      {round.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {round.sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              [{source.label}]
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function InvestorRow({ investor }: { investor: Investor }) {
  const typeColors: Record<Investor["type"], string> = {
    vc: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    individual:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    foundation:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    corporate:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    government:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <div className="border-l-2 border-muted pl-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{investor.name}</span>
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${typeColors[investor.type]}`}
        >
          {investor.type}
        </span>
        {investor.amountIfKnown && (
          <span className="text-xs text-muted-foreground">
            ({investor.amountIfKnown})
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">
        {investor.background}
      </p>
      {investor.geoConnections && investor.geoConnections.length > 0 && (
        <div className="mt-1">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
            Other geoengineering connections:
          </p>
          {investor.geoConnections.map((conn, i) => (
            <p
              key={i}
              className="text-xs text-red-600 dark:text-red-400"
            >
              &bull; {conn}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectionCard({ connection }: { connection: Connection }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <div className="mt-1">
        {connection.confirmed ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-3 w-3 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </span>
        ) : (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-[10px] font-bold text-yellow-700">
            ?
          </span>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">
          {connection.entitySlug ? (
            <Link
              href={`/learn/operators/${connection.entitySlug}`}
              className="text-primary hover:underline"
            >
              {connection.entity}
            </Link>
          ) : (
            connection.entity
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {connection.relationship}
        </p>
        <a
          href={connection.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-primary hover:underline"
        >
          [{connection.source.label}]
        </a>
      </div>
    </div>
  );
}
