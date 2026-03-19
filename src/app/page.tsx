import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

const stats = [
  {
    label: "States with bans enacted",
    value: "3",
    href: "/learn/state-bans",
    detail: "Tennessee, Florida, Louisiana",
  },
  {
    label: "States with pending bills",
    value: "30+",
    href: "/learn/pending-bills",
    detail: "Bills introduced across the U.S.",
  },
  {
    label: "Federal bill introduced",
    value: "Clear Skies Act",
    href: "/learn/clear-skies-act",
    detail: "H.R. 4403 — 119th Congress",
  },
  {
    label: "Congressional hearing",
    value: "Sept 2025",
    href: "/learn/congressional-hearing",
    detail: "\"Playing God with the Weather\"",
  },
];

const learnTopics = [
  {
    title: "What is weather modification?",
    description:
      "Cloud seeding, silver iodide, 9 active state programs, 70 years of history. What's confirmed, what's proposed, and what's unknown.",
    href: "/about",
  },
  {
    title: "Who are the companies involved?",
    description:
      "Weather Modification International, Rainmaker, Make Sunsets, Stardust Solutions — the operators, the funders, and the connections. Full profiles.",
    href: "/learn/operators",
  },
  {
    title: "What did Congress say?",
    description:
      "The September 2025 hearing featured sworn testimony from scientists, EPA statements, and bipartisan acknowledgment that weather modification is real.",
    href: "/learn/congressional-hearing",
  },
  {
    title: "What are the states doing?",
    description:
      "3 states have enacted bans, 30+ have introduced bills. Florida made it a felony. The movement is accelerating.",
    href: "/learn/state-bans",
  },
];

const dataSources = [
  "ADS-B Exchange (unfiltered flight tracking)",
  "FAA Aircraft Registry (ownership records)",
  "NOAA Weather Modification Reports",
  "USASpending.gov (federal contracts)",
  "EPA Air Quality System",
  "State weather modification permits",
];

export default function Home() {
  return (
    <div>
      {/* Hero — Track Flights is the star */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-background py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              What&apos;s flying over you?
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              See every aircraft above you right now. Who owns it, where
              it&apos;s coming from, where it&apos;s going, and whether
              it&apos;s a known weather modification operator &mdash; all in
              real time.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              We don&apos;t make accusations. We present data from public
              government sources. The facts speak for themselves.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LinkButton href="/flights" size="lg">
                Track Flights Above Me
              </LinkButton>
              <LinkButton href="/learn/state-bans" variant="outline" size="lg">
                Learn What&apos;s Happening
              </LinkButton>
              <LinkButton href="/get-involved" variant="outline" size="lg">
                Get Involved
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="text-center group transition-colors hover:bg-muted/50 rounded-lg p-2 -m-2"
              >
                <p className="text-2xl font-bold group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary underline-offset-4">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
                  {stat.detail}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What the flight tracker shows you */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              One click. Full transparency.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Click any aircraft in the live tracker and instantly see
              everything public data can tell you about it.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Who owns it",
                detail: "FAA-registered owner name, city, state",
              },
              {
                label: "Where it's going",
                detail: "Departure & arrival airports when available",
              },
              {
                label: "What type it is",
                detail: "Aircraft make, model, year, photo",
              },
              {
                label: "Is it flagged",
                detail: "Known weather modification operators highlighted in red",
              },
              {
                label: "Live position",
                detail: "Altitude, speed, heading, updated every 10 seconds",
              },
              {
                label: "Flight trail",
                detail: "Watch its path draw on the map in real time",
              },
              {
                label: "Altitude coding",
                detail: "Orange = cloud seeding range, purple = high altitude",
              },
              {
                label: "Evidence grade",
                detail: "All data from government sources, SHA-256 hashed",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border p-4"
              >
                <p className="font-medium text-sm">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <LinkButton href="/flights" size="lg">
              Open Flight Tracker
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Knowledge Bank — for skeptics and believers alike */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              The facts, cited and sourced
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether you&apos;re skeptical or concerned, start here. Every
              claim links to its source &mdash; congressional records, state
              legislation, government databases, peer-reviewed science.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {learnTopics.map((topic) => (
              <Link key={topic.title} href={topic.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold">{topic.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                    <p className="mt-3 text-xs text-primary font-medium">
                      Read more &rarr;
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Support the Cause */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How you can help
            </h2>
            <p className="mt-4 text-muted-foreground">
              This fight is being won by everyday people showing up. Here&apos;s
              how to get involved.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">Track &amp; Document</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the flight tracker. Submit observations with photos.
                  Every data point builds the picture.
                </p>
                <LinkButton href="/flights" variant="outline" size="sm" className="mt-4">
                  Start Tracking
                </LinkButton>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">Learn &amp; Share</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Read the facts. Share them. Send someone the congressional
                  hearing page. Knowledge is the first step.
                </p>
                <LinkButton href="/learn/congressional-hearing" variant="outline" size="sm" className="mt-4">
                  Read the Facts
                </LinkButton>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">Support Legal Action</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Organizations like The GeoFight are building federal lawsuits.
                  Your state may have a bill pending right now.
                </p>
                <LinkButton href="/learn/pending-bills" variant="outline" size="sm" className="mt-4">
                  See Your State
                </LinkButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Our data sources
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every data point comes from a verifiable public source. We
              aggregate &mdash; the government already collected it.
            </p>
          </div>
          <div className="mt-12 mx-auto max-w-xl">
            <ul className="space-y-3">
              {dataSources.map((source) => (
                <li
                  key={source}
                  className="flex items-center gap-3 text-sm"
                >
                  <svg
                    className="h-5 w-5 shrink-0 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">
            The people aren&apos;t connected. Let&apos;s fix that.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We all want the same thing: clean skies, transparent government, and
            access to the truth. SkyLedger gives citizens the tools to document,
            track, and act.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton href="/flights" size="lg">
              Track Flights Now
            </LinkButton>
            <LinkButton href="/about" variant="outline" size="lg">
              Read Our Methodology
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
