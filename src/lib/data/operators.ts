/**
 * Operator Profiles — structured data for all known weather modification
 * and geoengineering operators. Single source of truth used by:
 * - FAA lookup flagging (faa.ts)
 * - Operator profile pages (/learn/operators/[slug])
 * - Flight detail panel "Learn More" links
 */

export interface OperatorSource {
  label: string;
  url: string;
}

export interface Person {
  name: string;
  role: string;
  background: string;
  nationality?: string;
  connections?: string[];
  sources: OperatorSource[];
}

export interface Investor {
  name: string;
  type: "vc" | "individual" | "foundation" | "corporate" | "government";
  background: string;
  amountIfKnown?: string;
  geoConnections?: string[];
}

export interface FundingRound {
  date: string;
  amount: string;
  type: string;
  investors: Investor[];
  sources: OperatorSource[];
}

export interface Connection {
  entity: string;
  entitySlug?: string;
  relationship: string;
  confirmed: boolean;
  source: OperatorSource;
}

export type OperatorCategory =
  | "cloud-seeding"
  | "stratospheric-aerosol-injection"
  | "marine-cloud-brightening"
  | "space-mirrors"
  | "ice-thickening"
  | "research-advocacy"
  | "funding";

export const CATEGORY_LABELS: Record<OperatorCategory, string> = {
  "cloud-seeding": "Cloud Seeding",
  "stratospheric-aerosol-injection": "Stratospheric Aerosol Injection",
  "marine-cloud-brightening": "Marine Cloud Brightening",
  "space-mirrors": "Space Mirrors",
  "ice-thickening": "Ice Thickening",
  "research-advocacy": "Research & Advocacy",
  funding: "Funding / Investment",
};

export interface Operator {
  slug: string;
  name: string;
  shortName: string;
  category: OperatorCategory;
  description: string;
  founded: string;
  headquarters: string;
  website?: string;
  status: "active" | "disbanded" | "under-investigation";
  totalFunding?: string;
  keyFacts: string[];
  people: Person[];
  funding: FundingRound[];
  connections: Connection[];
  sources: OperatorSource[];
  faaKeywords: string[];
}

// ---------------------------------------------------------------------------
// OPERATOR DATA
// ---------------------------------------------------------------------------

export const OPERATORS: Operator[] = [
  // =========================================================================
  // WEATHER MODIFICATION INTERNATIONAL
  // =========================================================================
  {
    slug: "weather-modification-international",
    name: "Weather Modification International",
    shortName: "WMI",
    category: "cloud-seeding",
    description:
      "World's largest private aerial cloud seeding company. 35+ aircraft fleet operating in 35+ countries. Based in Fargo, North Dakota. Founded 1961.",
    founded: "1961",
    headquarters: "Fargo, North Dakota",
    website: "https://weathermodification.com",
    status: "active",
    keyFacts: [
      "World's largest private cloud seeding operator",
      "35+ aircraft fleet, operates in 35+ countries",
      "Partnerships with US Department of Commerce and Naval Surface Warfare Center",
      "Owned by Patrick & Jim Sweeney since the early 1990s",
      "Also operate Fargo Jet Center (aircraft supply and pilot training)",
    ],
    people: [
      {
        name: "Patrick Sweeney",
        role: "Chairman of the Board & Co-Owner",
        background:
          "Started at WMI as a college-age radar and electrical technician. Bought into the company over time, then purchased remaining stock after the original founder retired in the early 1990s.",
        nationality: "American",
        sources: [
          {
            label: "Emerging Prairie profile",
            url: "https://www.emergingprairie.com/meet-weatherman-neil-brackin-leading-worlds-largest-weather-modification-company-fargo/",
          },
        ],
      },
      {
        name: "Jim Sweeney",
        role: "Executive Vice President & Co-Owner",
        background:
          "Patrick's brother. Was convinced by Patrick to return to North Dakota to join the company.",
        nationality: "American",
        sources: [
          {
            label: "Aviation Pros article",
            url: "https://www.aviationpros.com/home/article/10386825/seeding-fargo-growth",
          },
        ],
      },
    ],
    funding: [],
    connections: [
      {
        entity: "US Department of Commerce",
        relationship: "Government partnership",
        confirmed: true,
        source: {
          label: "Company website",
          url: "https://weathermodification.com",
        },
      },
      {
        entity: "Naval Surface Warfare Center",
        relationship: "Government partnership",
        confirmed: true,
        source: {
          label: "Company website",
          url: "https://weathermodification.com",
        },
      },
    ],
    sources: [
      {
        label: "FAA Aircraft Registry",
        url: "https://registry.faa.gov/AircraftInquiry/",
      },
      {
        label: "Congressional hearing testimony",
        url: "https://oversight.house.gov/",
      },
    ],
    faaKeywords: ["WEATHER MODIFICATION", "WEATHER MOD"],
  },

  // =========================================================================
  // RAINMAKER
  // =========================================================================
  {
    slug: "rainmaker",
    name: "Rainmaker",
    shortName: "Rainmaker",
    category: "cloud-seeding",
    description:
      "Peter Thiel-backed drone-based cloud seeding startup. Operates in Utah, Colorado, Texas, and California. $31M+ raised. Actively lobbying against state bans.",
    founded: "2023",
    headquarters: "El Segundo, California",
    status: "active",
    totalFunding: "$31M+",
    keyFacts: [
      "Founded by Thiel Fellow Augustus Doricko after dropping out of UC Berkeley",
      "Uses drone-based cloud seeding with silver iodide",
      "Has state contracts with Utah and Colorado Departments of Natural Resources, Santa Barbara, San Luis Obispo",
      "Named in Congressional hearing in connection with Texas flood concerns",
      "Actively lobbying against state 'Clear Skies Act' legislation that would criminalize weather modification",
    ],
    people: [
      {
        name: "Augustus Doricko",
        role: "CEO & Founder",
        background:
          "25 years old. UC Berkeley dropout (physics). Thiel Fellow. Came up with the idea of a weather startup after joining the Thiel Fellowship.",
        nationality: "American",
        sources: [
          {
            label: "Fast Company profile",
            url: "https://www.fastcompany.com/91448561/this-is-the-hardest-startup-in-america",
          },
        ],
      },
    ],
    funding: [
      {
        date: "2024",
        amount: "$6.3M",
        type: "Seed",
        investors: [
          {
            name: "Peter Thiel",
            type: "individual",
            background:
              "German-American billionaire. Born in Frankfurt. PayPal co-founder, Palantir co-founder. Thiel Fellowship backed Doricko.",
          },
          {
            name: "Garry Tan",
            type: "individual",
            background:
              "Chinese-Burmese Canadian-American. CEO of Y Combinator. Born in Winnipeg to Chinese Singaporean father and Burmese-Chinese mother.",
          },
          {
            name: "Naval Ravikant",
            type: "individual",
            background:
              "Indian-American. Born in New Delhi, moved to NYC at age 9. Co-founder of AngelList. Early investor in Uber, Twitter.",
          },
        ],
        sources: [
          {
            label: "Fortune: Cloud seeding startup raises $6.3M",
            url: "https://fortune.com/2024/05/07/cloud-seeding-startup-rainmaker-raises-6-million/",
          },
        ],
      },
      {
        date: "2025",
        amount: "$25M",
        type: "Series A",
        investors: [
          {
            name: "Lowercarbon Capital",
            type: "vc",
            background:
              "Chris Sacca's $2.4B AUM climate fund. Italian-Irish American founder from Lockport, NY.",
            geoConnections: [
              "Harvard SGRP donor",
              "SilverLining funder",
              "Stardust Solutions lead investor",
              "Marine Cloud Brightening funder",
            ],
          },
          {
            name: "Starship Ventures",
            type: "vc",
            background: "American VC.",
          },
          {
            name: "Long Journey Ventures",
            type: "vc",
            background: "American VC.",
          },
          {
            name: "1517 Fund",
            type: "vc",
            background:
              "Founded by Michael Gibson (American, former VP at Thiel Foundation). Fund backed by Peter Thiel. Named after the year Martin Luther posted his 95 Theses.",
          },
        ],
        sources: [
          {
            label: "LA Business Journal",
            url: "https://labusinessjournal.com/technology/rainmaker-raises-a-25-million-series-a-round/",
          },
        ],
      },
    ],
    connections: [
      {
        entity: "Peter Thiel",
        relationship:
          "Early backer via Thiel Fellowship. Doricko is a Thiel Fellow.",
        confirmed: true,
        source: {
          label: "Fast Company",
          url: "https://www.fastcompany.com/91448561/this-is-the-hardest-startup-in-america",
        },
      },
      {
        entity: "Lowercarbon Capital",
        entitySlug: "lowercarbon-capital",
        relationship:
          "Series A lead investor. Also leads Stardust Solutions and funds geoengineering research.",
        confirmed: true,
        source: {
          label: "E&E News",
          url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
        },
      },
      {
        entity: "Clear Skies Act opposition",
        relationship:
          "Actively lobbying against H.R. 4403 and state-level bans on weather modification.",
        confirmed: true,
        source: {
          label: "E&E News lobbying report",
          url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
        },
      },
    ],
    sources: [
      {
        label: "Fast Company: Hardest startup in America",
        url: "https://www.fastcompany.com/91448561/this-is-the-hardest-startup-in-america",
      },
      {
        label: "Congressional hearing testimony",
        url: "https://oversight.house.gov/",
      },
    ],
    faaKeywords: ["RAINMAKER"],
  },

  // =========================================================================
  // STARDUST SOLUTIONS
  // =========================================================================
  {
    slug: "stardust-solutions",
    name: "Stardust Solutions",
    shortName: "Stardust",
    category: "stratospheric-aerosol-injection",
    description:
      "The most funded geoengineering startup in existence ($75M). Founded by three former Israeli nuclear establishment scientists. Developing proprietary secret particles for stratospheric aerosol injection. Aims to sell to governments at 'more than a billion dollars a year.'",
    founded: "2023",
    headquarters: "Outside Tel Aviv, Israel / Palo Alto, CA",
    website: "https://stardust-initiative.com",
    status: "active",
    totalFunding: "$75M",
    keyFacts: [
      "Accounts for ~65% of ALL geoengineering startup funding ($75M of $115.8M total)",
      "All three cofounders come from Israel's nuclear weapons establishment (Dimona/IAEC)",
      "Seed money from Shin Bet veteran's VC fund (Awz Ventures) partnered with Israeli Ministry of Defense",
      "Particle composition is secret (patent pending) — no independent analysis possible",
      "Hired Holland & Knight (K Street lobby firm) Q1 2025; disclosure initially hidden due to 'clerical error'",
      "Hired independent governance consultant who recommended transparency — then ignored every recommendation",
      "Planning in-aircraft stratospheric experiments April 2026 with no public consultation",
      "Business model: defense contractor for climate — governments pay 'more than a billion dollars a year'",
    ],
    people: [
      {
        name: "Yanai Yedvab",
        role: "CEO & Cofounder",
        background:
          "30 years in Israeli national labs. Head of the Physics Division at the Negev Nuclear Research Center (Dimona) — Israel's classified nuclear weapons facility. Deputy Chief Research Scientist at the Israel Atomic Energy Commission (IAEC), 2011-2015. Presented at NOAA's Chemical Sciences Laboratory in September 2024.",
        nationality: "Israeli",
        sources: [
          {
            label: "Bulletin of Atomic Scientists investigation",
            url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
          },
          {
            label: "NOAA seminar page",
            url: "https://csl.noaa.gov/seminars/2024/Yedvab.html",
          },
        ],
      },
      {
        name: "Amyad Spector",
        role: "Chief Product Officer & Cofounder",
        background:
          "Physicist. Physics researcher at the Negev Nuclear Research Center (Dimona). After Negev, worked on unspecified R&D projects for the Israeli government for nearly a decade. Also worked on Israel's COVID-19 response. Eli Waxman was his academic supervisor at Weizmann Institute.",
        nationality: "Israeli",
        sources: [
          {
            label: "Bulletin of Atomic Scientists",
            url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
          },
        ],
      },
      {
        name: "Eli Waxman",
        role: "Lead Scientist & Cofounder",
        background:
          "Astrophysicist at Weizmann Institute of Science. Head of Department of Particle Physics and Astrophysics. Former Chief Scientist of the Israel Atomic Energy Commission (IAEC), 2013-2015. During COVID-19, headed the National Security Council's Expert Advisers' Committee advising the Prime Minister on pandemic response.",
        nationality: "Israeli",
        connections: [
          "Academic supervisor of cofounder Amyad Spector",
          "Former Chief Scientist of the IAEC (same commission Yedvab served as Deputy)",
        ],
        sources: [
          {
            label: "Weizmann Institute profile",
            url: "https://www.weizmann.ac.il/physics/waxman/home",
          },
          {
            label: "Bulletin of Atomic Scientists",
            url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
          },
        ],
      },
    ],
    funding: [
      {
        date: "Early 2024",
        amount: "$15M",
        type: "Seed",
        investors: [
          {
            name: "Awz Ventures",
            type: "vc",
            background:
              "Canadian-Israeli VC. Founded by Yaron Ashkenazi (former Shin Bet officer). Advisory board includes former Mossad Chief of Intelligence, former CIA/FBI/MI5 directors, Unit 8200 alumni. Partnered with MAFAT (Israeli MoD R&D). Stephen Harper (22nd Canadian PM) is Advisory Committee President. Former IDF Chief Aviv Kohavi joined the firm. Manages $500M+ across four funds. First fund ($82.5M) was a joint fund with the Israeli Ministry of Defence.",
            geoConnections: [
              "Bridge between Israeli defense/intelligence establishment and geoengineering",
            ],
          },
          {
            name: "SolarEdge Technologies",
            type: "corporate",
            background:
              "Israeli NASDAQ-traded renewable energy company. Founded by Guy Sella (former IDF Sayeret Matkal, awarded Israel Defense Prize). Cofounders were four of his former soldiers.",
          },
        ],
        sources: [
          {
            label: "Heatmap News exclusive",
            url: "https://heatmap.news/climate-tech/stardust-geoengineering",
          },
          {
            label: "Awz Ventures about page",
            url: "https://www.awzventures.com/about",
          },
          {
            label: "The Breach: Harper / $350M military tech",
            url: "https://breachmedia.ca/stephen-harper-awz-ventures-surveillance-tech-israel/",
          },
        ],
      },
      {
        date: "October 2025",
        amount: "$60M",
        type: "Series A",
        investors: [
          {
            name: "Lowercarbon Capital (lead)",
            type: "vc",
            background:
              "Chris Sacca's $2.4B AUM climate fund. Sacca is Italian-Irish American from Lockport, NY.",
            geoConnections: [
              "Harvard SGRP donor (nonprofit research)",
              "SilverLining funder (advocacy/lobbying)",
              "Rainmaker investor (for-profit cloud seeding)",
              "Marine Cloud Brightening Project funder",
            ],
          },
          {
            name: "Exor (Agnelli family)",
            type: "corporate",
            background:
              "Dutch holding company controlled by the Agnelli family, an Italian industrial dynasty. Largest shareholder of Stellantis (Chrysler parent), Ferrari, Juventus. Current leadership is the Elkann branch — John Elkann's father Alain Elkann is Jewish.",
          },
          {
            name: "Matt Cohler",
            type: "individual",
            background:
              "American. One of first 5 employees at Facebook. Founding member of LinkedIn. Former General Partner at Benchmark. Forbes Midas List. Born in NYC, Yale grad.",
          },
          {
            name: "Lauder Partners",
            type: "vc",
            background:
              "Founded by Ronald S. Lauder, son of Estee Lauder. Ronald Lauder is President of the World Jewish Congress. Based in Atherton, CA. Early investor in Palantir, Zoom, Pure Storage.",
          },
          {
            name: "Nebular (Finn Murphy)",
            type: "vc",
            background:
              "Irish. $30M solo GP fund. Murphy studied engineering at Trinity College Dublin. Former partner at Frontline Ventures (Irish VC).",
            amountIfKnown: "$1M+",
          },
          {
            name: "Sequoia Capital",
            type: "vc",
            background:
              "Tier-1 Silicon Valley VC. Diverse partnership.",
          },
          {
            name: "Attestor",
            type: "vc",
            background: "British investment firm.",
          },
          {
            name: "Kindred Capital",
            type: "vc",
            background: "British VC.",
          },
          {
            name: "Orion Global Advisors",
            type: "vc",
            background: "British advisory firm.",
          },
          {
            name: "Earth.now",
            type: "vc",
            background: "Berlin-based climate VC.",
          },
        ],
        sources: [
          {
            label: "Heatmap News exclusive: $60M raise",
            url: "https://heatmap.news/climate-tech/stardust-geoengineering",
          },
          {
            label: "E&E News: Betting on climate failure",
            url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
          },
        ],
      },
    ],
    connections: [
      {
        entity: "Lowercarbon Capital",
        entitySlug: "lowercarbon-capital",
        relationship:
          "Lead Series A investor ($60M). Sacca also funds Harvard SGRP, SilverLining, Rainmaker, and Marine Cloud Brightening — occupying every seat from research to lobbying to profit.",
        confirmed: true,
        source: {
          label: "E&E News",
          url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
        },
      },
      {
        entity: "Awz Ventures / Israeli defense establishment",
        relationship:
          "Seed investor. Founded by Shin Bet veteran, partnered with MAFAT (Israeli MoD), advised by Mossad/CIA/FBI chiefs. Despite this, Stardust claims no connection to Israeli defense establishment.",
        confirmed: true,
        source: {
          label: "Awz Ventures website",
          url: "https://www.awzventures.com/about",
        },
      },
      {
        entity: "Negev Nuclear Research Center (Dimona)",
        relationship:
          "All three cofounders have direct ties. Two worked at the facility. Two held senior positions at the parent Israel Atomic Energy Commission.",
        confirmed: true,
        source: {
          label: "Bulletin of Atomic Scientists",
          url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
        },
      },
      {
        entity: "Holland & Knight (lobbyist)",
        relationship:
          "Hired Q1 2025 for Congressional outreach. Lobbying disclosure initially hidden due to 'clerical error.'",
        confirmed: true,
        source: {
          label: "E&E News: Lobbying",
          url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
        },
      },
      {
        entity: "Rainmaker",
        entitySlug: "rainmaker",
        relationship:
          "Shares lead investor Lowercarbon Capital (Chris Sacca). Both benefit from government adoption of atmospheric modification.",
        confirmed: true,
        source: {
          label: "E&E News",
          url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
        },
      },
    ],
    sources: [
      {
        label: "Bulletin of Atomic Scientists: Founders investigation",
        url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
      },
      {
        label: "Heatmap News: $60M exclusive",
        url: "https://heatmap.news/climate-tech/stardust-geoengineering",
      },
      {
        label: "MIT Technology Review",
        url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
      },
      {
        label: "CIEL: Reckless experiments",
        url: "https://www.ciel.org/news/us-israeli-start-up-announces-reckless-solar-geoengineering-experiments-from-april-2026/",
      },
      {
        label: "SRM360: Governance recommendations",
        url: "https://srm360.org/perspective/governance-recommendations-for-stardust/",
      },
      {
        label: "Undark: Profitability model",
        url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
      },
    ],
    faaKeywords: ["STARDUST SOLUTIONS", "STARDUST"],
  },

  // =========================================================================
  // MAKE SUNSETS
  // =========================================================================
  {
    slug: "make-sunsets",
    name: "Make Sunsets",
    shortName: "Make Sunsets",
    category: "stratospheric-aerosol-injection",
    description:
      "The only known private SAI deployer in the U.S. Releases sulfur dioxide into the stratosphere via weather balloons and sells 'cooling credits.' $1.2M raised from the Draper VC dynasty.",
    founded: "2022",
    headquarters: "United States",
    website: "https://makesunsets.com",
    status: "active",
    totalFunding: "$1.2M",
    keyFacts: [
      "Actively releasing sulfur dioxide into the stratosphere via weather balloons",
      "Sells 'cooling credits' — 1g SO2 claimed to offset 1 ton CO2 warming for one year",
      "First launched unauthorized balloons in Mexico, prompting Mexican government ban",
      "Now operating from Nevada",
      "Only known private SAI deployer in the U.S.",
      "Founded by former Y Combinator Director of Hardware",
    ],
    people: [
      {
        name: "Luke Iseman",
        role: "CEO & Cofounder",
        background:
          "American. 41 years old. Serial entrepreneur. Former Director of Hardware at Y Combinator. Known for building large art projects at Burning Man.",
        nationality: "American",
        sources: [
          {
            label: "Make Sunsets team page",
            url: "https://makesunsets.com/pages/who",
          },
        ],
      },
      {
        name: "Andrew Song",
        role: "Cofounder",
        background:
          "Former Outreach Manager at Indiegogo. Met Iseman in 2015 in San Francisco through shared passion for hardware companies.",
        nationality: "American",
        sources: [
          {
            label: "Make Sunsets team page",
            url: "https://makesunsets.com/pages/who",
          },
        ],
      },
    ],
    funding: [
      {
        date: "2022-2023",
        amount: "$1.2M",
        type: "Seed / Angel",
        investors: [
          {
            name: "Boost VC (Adam Draper)",
            type: "vc",
            background:
              "American. 4th-generation VC. Adam Draper is Tim Draper's son. Startup accelerator focused on emerging tech.",
          },
          {
            name: "Draper Associates (Tim Draper)",
            type: "vc",
            background:
              "American. Born East Chicago, Indiana. 3rd-generation VC dynasty. Grandfather William Henry Draper Jr. founded Draper, Gaither & Anderson (1958) and served as first US ambassador to NATO.",
          },
          {
            name: "Pioneer Fund",
            type: "vc",
            background: "American VC.",
          },
        ],
        sources: [
          {
            label: "CNBC: Make Sunsets balloons in Nevada",
            url: "https://www.cnbc.com/2023/02/22/solar-geoengineering-startup-make-sunsets-lets-off-balloons-in-nevada.html",
          },
        ],
      },
    ],
    connections: [
      {
        entity: "Draper Family VC Dynasty",
        relationship:
          "Backed by both Tim Draper (Draper Associates) and his son Adam Draper (Boost VC). The Draper dynasty is 4 generations of American VCs dating to post-WWII.",
        confirmed: true,
        source: {
          label: "Computer History Museum: Draper dynasty",
          url: "https://computerhistory.org/blog/venture-capital-in-the-blood-three-generations-of-drapers-in-silicon-valley/",
        },
      },
      {
        entity: "Mexico government ban",
        relationship:
          "First balloon launches were conducted in Mexico without authorization, prompting the Mexican government to ban SAI experiments on its territory.",
        confirmed: true,
        source: {
          label: "E&E News: Mexico halts operation",
          url: "https://www.eenews.net/articles/startup-halts-geoengineering-operation-in-mexico/",
        },
      },
    ],
    sources: [
      {
        label: "NPR: Solar geoengineering startups",
        url: "https://www.npr.org/2024/04/21/1244357506/earth-day-solar-geoengineering-climate-make-sunsets-stardust",
      },
      {
        label: "CNBC: Make Sunsets in Nevada",
        url: "https://www.cnbc.com/2023/02/22/solar-geoengineering-startup-make-sunsets-lets-off-balloons-in-nevada.html",
      },
    ],
    faaKeywords: ["MAKE SUNSETS"],
  },

  // =========================================================================
  // REFLECT ORBITAL
  // =========================================================================
  {
    slug: "reflect-orbital",
    name: "Reflect Orbital",
    shortName: "Reflect",
    category: "space-mirrors",
    description:
      "Space startup developing a constellation of satellite mirrors. Dual-use: directing sunlight to Earth at night for solar energy, OR reflecting sunlight away for geoengineering. $28-35M raised. Backed by Sequoia and Lux Capital.",
    founded: "2021",
    headquarters: "Los Angeles, California",
    website: "https://reflectorbital.com",
    status: "active",
    totalFunding: "$35M",
    keyFacts: [
      "Developing network of orbital satellite mirrors",
      "Dual-use technology: sell sunlight at night OR block sunlight for cooling",
      "Sequoia Capital's first space investment since SpaceX",
      "Founders are American engineers, not geoengineering specialists",
      "Had audience with Crown Prince of Dubai about the project",
    ],
    people: [
      {
        name: "Ben Nowack",
        role: "CEO & Cofounder",
        background:
          "American. 29 years old. Born on Cape Cod, Massachusetts. Wentworth Institute of Technology (BS Engineering). Former engineer at SpaceX, Zipline, and Tri-D Dynamics. Built fusion reactors in high school.",
        nationality: "American",
        sources: [
          {
            label: "Sequoia Capital founder profile",
            url: "https://sequoiacap.com/founder/ben-nowack/",
          },
          {
            label: "Monocle: Reflect Orbital profile",
            url: "https://monocle.com/business/aviation/reflect-orbital-aerospace-startup/",
          },
        ],
      },
      {
        name: "Tristan Semmelhack",
        role: "CTO & Cofounder",
        background:
          "American. Stanford dropout (took leave after first year). Built drones since middle school, started drone design business in 9th grade. Former intern at Zipline. Discovered Nowack via his YouTube channel.",
        nationality: "American",
        sources: [
          {
            label: "Stanford Review profile",
            url: "https://stanfordreview.org/reflect-orbital/",
          },
        ],
      },
    ],
    funding: [
      {
        date: "2025",
        amount: "$20M",
        type: "Series A",
        investors: [
          {
            name: "Lux Capital (lead)",
            type: "vc",
            background:
              "American deep-tech VC. Founded by Josh Wolfe (grew up in Coney Island, Brooklyn, raised by single mother/public school teacher, Cornell grad) and Peter Hebert (Syracuse grad).",
          },
          {
            name: "Sequoia Capital",
            type: "vc",
            background:
              "Tier-1 American VC. Their first space investment since SpaceX.",
          },
          {
            name: "Starship Ventures",
            type: "vc",
            background: "American VC.",
          },
        ],
        sources: [
          {
            label: "PR Newswire: $20M Series A",
            url: "https://www.prnewswire.com/news-releases/reflect-orbital-secures-20-million-in-series-a-funding-led-by-lux-capital-302454968.html",
          },
        ],
      },
    ],
    connections: [],
    sources: [
      {
        label: "Reflect Orbital team page",
        url: "https://www.reflectorbital.com/team",
      },
      {
        label: "E&E News: Betting on climate failure",
        url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
      },
    ],
    faaKeywords: [],
  },

  // =========================================================================
  // LOWERCARBON CAPITAL (CHRIS SACCA) — FUNDING NODE
  // =========================================================================
  {
    slug: "lowercarbon-capital",
    name: "Lowercarbon Capital",
    shortName: "Lowercarbon",
    category: "funding",
    description:
      "Chris Sacca's $2.4 billion climate investment fund. The single most connected entity in geoengineering: funds the research (Harvard SGRP), lobbies for policy (SilverLining), AND invests in deployment companies (Stardust Solutions lead, Rainmaker). Occupies every seat from science to profit.",
    founded: "2020",
    headquarters: "Wyoming",
    status: "active",
    totalFunding: "$2.4B AUM",
    keyFacts: [
      "Manages $2.4 billion in assets",
      "Led the largest geoengineering startup investment ever ($60M in Stardust Solutions)",
      "Also invested in Rainmaker (cloud seeding) and Marine Cloud Brightening Project",
      "Donates to Harvard Solar Geoengineering Research Program (nonprofit research)",
      "Funds SilverLining ($20.5M coalition) which lobbies Congress for SRM programs",
      "This is the full loop: fund research, lobby for government support, invest in the company that gets deployment contracts",
      "Chris Sacca is Italian-Irish American, not Israeli — but his fund is the bridge between geoengineering research and profit",
    ],
    people: [
      {
        name: "Chris Sacca",
        role: "Cofounder & Managing Partner",
        background:
          "Italian-Irish American. Born May 12, 1975 in Lockport, New York. Father Gerald Sacca (attorney, Italian descent from Calabria). Mother Katherine (Irish descent, SUNY professor). Georgetown Law grad. Early investor in Twitter, Uber, Instagram. Billionaire.",
        nationality: "American",
        sources: [
          {
            label: "Wikipedia",
            url: "https://en.wikipedia.org/wiki/Chris_Sacca",
          },
        ],
      },
    ],
    funding: [],
    connections: [
      {
        entity: "Stardust Solutions",
        entitySlug: "stardust-solutions",
        relationship: "Led $60M Series A (largest geoengineering investment ever).",
        confirmed: true,
        source: {
          label: "Heatmap News",
          url: "https://heatmap.news/climate-tech/stardust-geoengineering",
        },
      },
      {
        entity: "Rainmaker",
        entitySlug: "rainmaker",
        relationship: "Led $25M Series A.",
        confirmed: true,
        source: {
          label: "LA Business Journal",
          url: "https://labusinessjournal.com/technology/rainmaker-raises-a-25-million-series-a-round/",
        },
      },
      {
        entity: "Harvard Solar Geoengineering Research Program",
        relationship:
          "Donor to nonprofit research program that produces models showing SRM 'could work.'",
        confirmed: true,
        source: {
          label: "Harvard SGRP funding page",
          url: "https://geoengineering.environment.harvard.edu/funding",
        },
      },
      {
        entity: "SilverLining",
        relationship:
          "Funder of advocacy organization that lobbies Congress, State Department, and international bodies for SRM research and governance.",
        confirmed: true,
        source: {
          label: "SilverLining public disclosures",
          url: "https://www.silverlining.ngo",
        },
      },
      {
        entity: "Marine Cloud Brightening Project",
        relationship: "Funder of applied research.",
        confirmed: true,
        source: {
          label: "Inside Philanthropy: Sacca profile",
          url: "https://www.insidephilanthropy.com/find-a-grant/major-donors/chris-and-crystal-sacca",
        },
      },
    ],
    sources: [
      {
        label: "E&E News: Betting on climate failure",
        url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
      },
      {
        label: "Inside Philanthropy: Chris and Crystal Sacca",
        url: "https://www.insidephilanthropy.com/find-a-grant/major-donors/chris-and-crystal-sacca",
      },
    ],
    faaKeywords: [],
  },

  // =========================================================================
  // NORTH AMERICAN WEATHER CONSULTANTS
  // =========================================================================
  {
    slug: "north-american-weather-consultants",
    name: "North American Weather Consultants",
    shortName: "NAWC",
    category: "cloud-seeding",
    description:
      "Cloud seeding operator based in Sandy, Utah. One of the longest-running weather modification firms in the U.S.",
    founded: "1950s",
    headquarters: "Sandy, Utah",
    status: "active",
    keyFacts: [
      "One of the oldest weather modification companies in the U.S.",
      "Conducts cloud seeding operations primarily in western states",
      "Government contractor for state-level cloud seeding programs",
    ],
    people: [],
    funding: [],
    connections: [],
    sources: [
      {
        label: "NOAA Weather Modification Activity Reports",
        url: "https://www.noaa.gov",
      },
    ],
    faaKeywords: ["NORTH AMERICAN WEATHER", "NAWC"],
  },

  // =========================================================================
  // IDAHO POWER
  // =========================================================================
  {
    slug: "idaho-power",
    name: "Idaho Power Company",
    shortName: "Idaho Power",
    category: "cloud-seeding",
    description:
      "Utility company operating a $4M/year cloud seeding program to increase snowpack for hydroelectric power generation.",
    founded: "1916",
    headquarters: "Boise, Idaho",
    website: "https://idahopower.com",
    status: "active",
    keyFacts: [
      "Operates a $4M/year cloud seeding program",
      "Goal: increase mountain snowpack to fill reservoirs for hydroelectric generation",
      "Program targets clouds over mountain ranges in Idaho",
    ],
    people: [],
    funding: [],
    connections: [],
    sources: [
      {
        label: "Idaho Power public program reports",
        url: "https://www.idahopower.com",
      },
    ],
    faaKeywords: ["IDAHO POWER"],
  },
];

// ---------------------------------------------------------------------------
// LOOKUP HELPERS
// ---------------------------------------------------------------------------

export function getOperatorBySlug(slug: string): Operator | undefined {
  return OPERATORS.find((op) => op.slug === slug);
}

export function getAllOperatorSlugs(): string[] {
  return OPERATORS.map((op) => op.slug);
}

/**
 * Given an FAA owner name, return the slug of the matching operator (if any).
 * Used by flight detail panel to create "See operator profile" links.
 */
export function getOperatorSlugFromOwnerName(
  ownerName: string
): string | null {
  const upper = ownerName.toUpperCase();
  for (const op of OPERATORS) {
    for (const keyword of op.faaKeywords) {
      if (upper.includes(keyword)) {
        return op.slug;
      }
    }
  }
  return null;
}

/**
 * Build the KNOWN_WX_MOD_OPERATORS lookup map from the canonical data.
 * Used by faa.ts to flag aircraft.
 */
export function buildWxModLookup(): Record<string, string> {
  const lookup: Record<string, string> = {};
  for (const op of OPERATORS) {
    for (const keyword of op.faaKeywords) {
      lookup[keyword] = `${op.name} — ${op.description.split(".")[0]}`;
    }
  }
  // Also keep the generic keywords
  lookup["SEEDING SOLUTIONS"] = "Cloud seeding operator";
  lookup["CLOUD SEEDING"] = "Cloud seeding operator";
  return lookup;
}
