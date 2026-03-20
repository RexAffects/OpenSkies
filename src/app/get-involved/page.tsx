import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Join the fight for clean skies. Support legal action, contact your representatives, track flights, and connect with organizations on the front lines.",
};

const frontlineOrgs = [
  {
    name: "ICAN (Informed Consent Action Network)",
    url: "https://icandecide.org",
    type: "FOIA & legal",
    description:
      "The FOIA bulldozer. Their legal team has forced disclosure of documents revealing the NSF funded a $400K \"holy grail\" grant for SAI aerosol targeting research at Cornell and Indiana University. They also exposed NOAA's SABRE program — a government stratospheric aerosol injection research program ramping up since 2021. Currently filing DOE FOIA requests and challenging British government geoengineering experiments.",
    action: "Donate to support FOIA legal work",
    taxDeductible: true,
    resources: [
      {
        label: "NSF \"Holy Grail\" FOIA discovery",
        url: "https://icandecide.org/press-release/ican-documents-show-us-government-funded-holy-grail-of-geoengineering-research/",
      },
      {
        label: "NOAA SABRE program exposed",
        url: "https://icandecide.org/press-release/ican-obtains-evidence-showing-the-government-is-ramping-up-geoengineering-research/",
      },
    ],
  },
  {
    name: "The GeoFight",
    url: "https://thegeofight.com",
    type: "Legal action",
    description:
      "Coalition of attorneys (Nicole Pearson, Blake Horwitz, Tom Renz) building toward the first federal lawsuit against geoengineering. Currently collecting court-admissible evidence, assembling expert witnesses, and seeking whistleblowers.",
    action: "Donate to fund the federal lawsuit",
    taxDeductible: false,
    resources: [],
  },
  {
    name: "Stop Geoengineering MN",
    url: "https://stopgeoengineeringmn.squarespace.com/donate",
    type: "State-level legal",
    description:
      "100% of donations go directly to legal efforts challenging weather modification in Minnesota. Sued the Air Force in federal court for information on weather modification programs and government efforts to restrict public knowledge. Grassroots organization with full financial transparency.",
    action: "Donate (100% goes to legal efforts)",
    taxDeductible: true,
    resources: [],
  },
  {
    name: "Geoengineering Watch",
    url: "https://geoengineeringwatch.org",
    type: "Awareness & research",
    description:
      "The archive. 20+ years documenting weather modification with the largest public collection of evidence in one place. Lead researcher Dane Wigington has testified as expert witness for state geoengineering ban bills including Wyoming. Their documentary \"The Dimming\" has over 25 million views.",
    action: "Support their research and outreach",
    taxDeductible: false,
    resources: [
      {
        label: "175+ weather modification patents",
        url: "https://geoengineeringwatch.org/links-to-geoengineering-patents/",
      },
      {
        label: "Government document library (Senate reports, CIA, NASA, DOD)",
        url: "https://geoengineeringwatch.org/documents-2/",
      },
      {
        label: "Lab test results (rain, snow, soil — aluminum, barium, strontium)",
        url: "https://geoengineeringwatch.org/lab-tests-2/",
      },
      {
        label: "\"The Dimming\" documentary (25M+ views)",
        url: "https://geoengineeringwatch.org/the-dimming-full-length-climate-engineering-documentary/",
      },
      {
        label: "How to test your own water and soil",
        url: "https://geoengineeringwatch.org/how-to-test-2/",
      },
    ],
  },
  {
    name: "Carnicom Institute",
    url: "https://www.carnicominstitute.org",
    type: "Independent research",
    description:
      "Independent research organization conducting scientific analysis of environmental samples related to aerosol operations. Long-running environmental and biological research program.",
    action: "Support independent research",
    taxDeductible: false,
    resources: [],
  },
];

const stateActions = [
  {
    status: "Enacted bans",
    states: "Tennessee, Florida, Louisiana",
    what: "Report violations through your state's official channels. Florida and Louisiana have public complaint systems. Document and report any suspected weather modification activity.",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    status: "Pending bills",
    states: "PA, IA, NC, NJ, RI, WY, and 24+ more",
    what: "Contact your state legislators. Tell them you support the pending geoengineering bill. Show up to committee hearings. Your voice matters — these bills pass because citizens demand them.",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  {
    status: "No bill yet",
    states: "Remaining states",
    what: "Contact your state representative and ask them to introduce legislation. Point them to Tennessee, Florida, and Louisiana as models. Share the SRM360 tracker showing the national movement.",
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  },
];

export default function GetInvolvedPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Get Involved</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        This fight is being won by everyday people who show up. Three states
        have already enacted bans, 30+ have bills pending, and a federal bill
        is on the table &mdash; all because citizens demanded transparency.
        Here&apos;s how you can help, whether you have five minutes or five
        hours.
      </p>

      {/* Quick Actions */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Start right now</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">1</p>
              <h3 className="mt-2 font-semibold">Track your skies</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Open the flight tracker. See what&apos;s flying over you right
                now. Click on aircraft to see who owns them.
              </p>
              <LinkButton
                href="/flights"
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Track Flights
              </LinkButton>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">2</p>
              <h3 className="mt-2 font-semibold">Learn the facts</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Read the congressional hearing summary. Share it with someone
                who&apos;s skeptical. The facts are on our side.
              </p>
              <LinkButton
                href="/learn/congressional-hearing"
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Read the Hearing
              </LinkButton>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">3</p>
              <h3 className="mt-2 font-semibold">Share SkyLedger</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Send someone this site. The more eyes on the data, the harder
                it is to ignore. Transparency scales with people.
              </p>
              <LinkButton
                href="/"
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Copy Link
              </LinkButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Federal Level */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Federal level</h2>
        <div className="mt-4 rounded-lg border border-border p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">
                The Clear Skies Act (H.R. 4403)
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This bill would ban weather modification at the federal level
                with felony penalties up to $100,000 and 5 years in prison.
                It was introduced in the 119th Congress and needs support to
                move forward.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">What you can do:</p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>
                    Call your Representative and ask them to cosponsor H.R. 4403
                  </li>
                  <li>
                    Call your Senators and ask them to introduce a companion bill
                  </li>
                  <li>
                    Reference the September 2025 congressional hearing as
                    evidence of bipartisan interest
                  </li>
                </ul>
              </div>
              <div className="mt-4 flex gap-3">
                <LinkButton
                  href="/learn/clear-skies-act"
                  variant="outline"
                  size="sm"
                >
                  Read About the Bill
                </LinkButton>
                <a
                  href="https://www.house.gov/representatives/find-your-representative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Find your Representative &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State Level */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">State level</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          State legislation is where the biggest wins are happening. Find where
          your state stands and take action.
        </p>
        <div className="mt-4 space-y-4">
          {stateActions.map((item) => (
            <div
              key={item.status}
              className="rounded-lg border border-border p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.color}`}
                >
                  {item.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.states}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.what}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <LinkButton
            href="/learn/state-bans"
            variant="outline"
            size="sm"
          >
            See Enacted Bans
          </LinkButton>
          <a
            href="https://srm360.org/us-bans/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Full state tracker (SRM360) &rarr;
          </a>
        </div>
      </section>

      {/* Community Level */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Community level</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm">Document &amp; Report</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Use SkyLedger to track flights and submit observations. In
                states with enacted bans (FL, LA), you can file official
                reports of suspected weather modification through state
                portals. Your observations are evidence.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm">Test Your Environment</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Get your soil and water tested independently. University
                extension services offer affordable testing ($15-40). Look for
                elevated silver, barium, strontium, or aluminum. Document
                results and share them.
              </p>
              <a
                href="https://geoengineeringwatch.org/how-to-test-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                How to test (Geoengineering Watch guide) &rarr;
              </a>
            </CardContent>
          </Card>
          <Link href="/learn/facts">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm">Talk to Your Neighbors</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Share this site. Share the congressional hearing. Most people
                  don&apos;t know that weather modification is real and
                  documented. A 2-minute conversation with{" "}
                  <span className="text-primary font-medium">a link to the facts</span>{" "}
                  is more powerful than you think.
                </p>
                <p className="mt-2 text-xs text-primary font-medium">
                  View &amp; download the facts &rarr;
                </p>
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm">Attend Local Meetings</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                City council meetings, county board meetings, state legislative
                hearings. Show up. Ask about weather modification permits in
                your area. Public officials respond to constituents who show
                up in person.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Front Line Organizations */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Support the front lines</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These organizations are doing the legal work, filing the FOIAs, and
          building the cases. They can use your support.
        </p>
        <div className="mt-4 space-y-4">
          {frontlineOrgs.map((org) => (
            <div
              key={org.name}
              className="rounded-lg border border-border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-sm">{org.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {org.type}
                    </span>
                    {org.taxDeductible && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Tax-deductible
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {org.description}
                  </p>
                  {org.resources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {org.resources.map((resource) => (
                        <a
                          key={resource.url}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-primary hover:underline"
                        >
                          {resource.label} &rarr;
                        </a>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs font-medium text-foreground">
                    {org.action}
                  </p>
                </div>
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-primary hover:underline font-medium"
                >
                  Visit &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-12 mb-8">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Disclaimer:</span>{" "}
            SkyLedger is not affiliated with any of the organizations listed
            above. We provide these links as a resource for citizens who want
            to take action. We encourage you to research any organization
            before donating. SkyLedger does not currently collect donations &mdash; all
            donation links go directly to the organizations listed.
          </p>
        </div>
      </section>
    </div>
  );
}
