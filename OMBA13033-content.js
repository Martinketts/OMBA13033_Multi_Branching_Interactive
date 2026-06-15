/* ============================================================
   Branching Scenario — ALL EDITABLE CONTENT
   File:  OMBA13033-content.js
   Module: OMBA13033 — Strategic Management
   --------------------------------------------------------------
   A "hybrid" branching scenario engine: a FORKING decision graph
   PLUS four hidden meters that some branches require to unlock.

   This file is a content-only sibling of branching-content.js. It
   reuses the SAME engine (branching-app.jsx) and the SAME styles
   (branching-styles.css). To run it, load THIS file instead of
   branching-content.js — see "OMBA13033 Branching Scenario.html".

   This file defines everything the learner reads or chooses:
     SECTION 1 — Meta (module code + scenario title)
     SECTION 2 — Intro screen
     SECTION 3 — Scenario context
     SECTION 4 — Meters (the four hidden dials)
     SECTION 5 — Lesson link pools (reused across options)
     SECTION 6 — GRAPH A "Forking Path" (topology diverges)
     SECTION 7 — GRAPH B "Pressure System" (meter-gated doors)
     SECTION 8 — Endings (forking terminals + meter-profile endings)
     SECTION 9 — UI labels

   NODE shape (decision):
     {
       id, eyebrow, question, prompt,
       options: [
         {
           label,                 // short text shown ON the pill
           summary,               // revealed under the pill when picked
           reflection,            // shown in the end-of-scenario debrief
           lessons: [LESSON.x],   // readings shown in the debrief
           effects: { advantage, profit, growth, confidence },  // meter deltas
           next: 'nodeId' | endingId | 'RESOLVE',               // where it leads
           gate: (m) => boolean,  // OPTIONAL — option is LOCKED until true
           gateHint: 'Locked — requires …'                      // shown when locked
         }
       ]
     }
   ============================================================ */

(function () {


/* ──────────────────────────────────────────────────────────────
   SECTION 1 — META
   ────────────────────────────────────────────────────────────── */
const META = {
  code:    "OMBA13033",
  eyebrow: "Branching Scenario",
  title:   "The Strategy Mandate: Competing Under Pressure",
};


/* ──────────────────────────────────────────────────────────────
   SECTION 2 — INTRO SCREEN
   ────────────────────────────────────────────────────────────── */
const INTRO = {
  left: {
    heading: "Branching Scenario",
    bodyParas: [
      "This is a branching simulation. Unlike a fixed quiz, the path you travel is built by your decisions — different choices open different scenes, and some routes only unlock if your earlier strategic work has earned them.",
      "Four dimensions of the firm respond quietly to every choice you make: Competitive Advantage, Profitability, Market Growth, and Board Confidence. You won't see the dials while you play — only at the end, when the consequences are revealed.",
      "There is no single right answer. There are stronger and weaker ways to set strategy under constraint, and a map at the end will show the road you took and the roads you didn't.",
    ],
    cta: "Choose a structure below, then click Continue to begin.",
  },
  right: {
    heading: "Learning Objectives",
    lead: "By the end of this activity, learners will be able to:",
    objectives: [
      "Apply external (general / industry / five forces) and internal (value chain, core competencies) analysis to diagnose a firm's strategic position.",
      "Evaluate business-level strategies — cost leadership, differentiation, focus, and integrated — against competitive rivalry and the five forces.",
      "Formulate corporate-level diversification and international strategies (multidomestic, global, transnational) appropriate to the firm's competencies, returns, and risk.",
    ],
  },
};


/* ──────────────────────────────────────────────────────────────
   SECTION 3 — SCENARIO CONTEXT
   ────────────────────────────────────────────────────────────── */
const CONTEXT = {
  eyebrow:  "Introduction",
  heading:  "Scenario (Problem / Context)",
  paragraphs: [
    "You are the newly appointed Chief Strategy Officer at \u201CMeridian Instruments,\u201D a mid-size precision-instruments manufacturer whose home market has matured. You have your first hundred days to set the strategy that will define the company's next decade.",
    "The diagnosis is sobering. Margins are eroding as fast-cycle, low-cost rivals copy your products within months; growth has stalled; a powerful division head is wedded to the legacy product line; and the board has split between those demanding aggressive expansion and those demanding cost discipline.",
  ],
  bold:
    "Read the environment, build on real core competencies, choose how you compete, and decide how you grow — or watch the strategy unravel. Every choice moves the dials you cannot see.",
};


/* ──────────────────────────────────────────────────────────────
   SECTION 4 — METERS
   The four hidden dials. Each starts at `start` (0–100).
   ────────────────────────────────────────────────────────────── */
const METERS = [
  { key: "advantage",  label: "Competitive Advantage", short: "Advantage",  color: "#7a6cd6" },
  { key: "profit",     label: "Profitability",         short: "Profit",     color: "#ed8b2b" },
  { key: "growth",     label: "Market Growth",         short: "Growth",     color: "#59a85f" },
  { key: "confidence", label: "Board Confidence",      short: "Board",      color: "#3b7fc7" },
];
const METER_START = { advantage: 50, profit: 50, growth: 50, confidence: 50 };


/* ──────────────────────────────────────────────────────────────
   SECTION 5 — LESSON LINK POOLS
   Reused across options so you only edit a URL once.
   (URLs taken from the OMBA13033 lesson notes.)
   ────────────────────────────────────────────────────────────── */
const BASE = "https://www.openlearning.com/rafflesuniversity/courses/omba130033-strategic-management-v2/";
const LESSON = {
  inputs:        { title: "1.1 Strategic Management Inputs",                              url: BASE + "unit_1_1_lesson_title/" },
  external:      { title: "2.1 External Environment",                                     url: BASE + "12---topic-title/" },
  internal:      { title: "3.1 The Internal Environment",                                 url: BASE + "21-the-internal-environment-v2/" },
  business:      { title: "4.1 Business-Level Strategies",                                url: BASE + "22-business-level-strategies-v2/" },
  rivalry:       { title: "5.1 Competitive Rivalry",                                      url: BASE + "23-competitive-rivalry-v2/" },
  corporate:     { title: "6.1 Corporate-Level Strategy",                                 url: BASE + "60-b/" },
  international: { title: "7.1 International Strategy",                                    url: BASE + "71-international-strategy-v2/" },
  cooperative:  { title: "8.1 Cooperative Strategy",                                      url: BASE + "81-cooperative-strategy-v2/" },
  governance:   { title: "9.1 Corporate Governance & Governance Mechanisms",             url: BASE + "91-strategy-implementation-corporate-governance--governance-mechanisms/" },
  leadership:   { title: "11.1 Strategic Leadership",                                     url: BASE + "111-strategic-leadership-v2/" },
};


/* ──────────────────────────────────────────────────────────────
   SECTION 6 — GRAPH A: "FORKING PATH"
   The SHAPE of the journey changes. Your first move sends you down
   a genuinely different middle act before the paths reconverge.
   ────────────────────────────────────────────────────────────── */
const FORKING = {
  key:   "forking",
  start: "f1",
  nodes: {

    /* ---- ACT 1 — the fork ------------------------------------ */
    f1: {
      eyebrow:  "The First Hundred Days",
      question: "It is your first week as Chief Strategy Officer. Margins are sliding, growth has stalled, and the board is split between expansion and cost discipline. The whole firm is watching how you will set the strategy. Where do you put your first energy?",
      prompt:   "What is your first move?",
      options: [
        {
          label: "Scan the environment",
          summary: "Study the general and industry environment, map the five forces, and profile your competitors before committing to anything.",
          reflection: "An outside-in opening. You read the demographic, economic, technological and global forces, then the industry's five forces and rivals, before acting. It costs early momentum, but every later move is grounded in a real read of where the market is going.",
          lessons: [LESSON.external, LESSON.rivalry],
          effects: { advantage: 6, profit: -4, growth: 2, confidence: 4 },
          next: "f2_market",
        },
        {
          label: "Audit the value chain",
          summary: "Turn inward — analyse Meridian's core competencies and value chain to find what you do that rivals can't cheaply imitate.",
          reflection: "An inside-out opening. Competitive advantage comes from competencies that are valuable, rare and costly to imitate, and the value chain shows which activities actually create value. The risk is studying yourself while the market moves around you.",
          lessons: [LESSON.internal],
          effects: { advantage: 12, profit: 0, growth: -4, confidence: 4 },
          next: "f2_capability",
        },
        {
          label: "Map the profit pools",
          summary: "Follow the money — map where profit actually pools across the value chain and which customer segments still pay.",
          reflection: "A profit-pool opening. Rather than chasing revenue, you locate where money is genuinely made across the industry's value chain. It is a sharp diagnostic, though leading with profit before competitors or competencies can read as accountant-first strategy.",
          lessons: [LESSON.inputs, LESSON.business],
          effects: { advantage: 2, profit: 12, growth: -2, confidence: 2 },
          next: "f2_profit",
        },
      ],
    },

    /* ---- ACT 2A — the EXTERNAL branch ------------------------ */
    f2_market: {
      eyebrow:  "The Competitive Scan",
      question: "Your scan confirms the worst: Meridian competes in a fast-cycle market where advantages aren't shielded and imitation is rapid. Two low-cost entrants are undercutting you on price, and a substitute technology is emerging on the fringe.",
      prompt:   "How do you read the rivalry?",
      options: [
        {
          label: "Differentiate on the uncopyable",
          summary: "Compete on unique, valued features and brand loyalty rather than on price.",
          reflection: "The right instinct in a fast-cycle market: differentiation builds brand loyalty that offsets price competition and reduces buyers' sensitivity to price. You compete where the low-cost entrants can't easily follow rather than racing them to the bottom.",
          lessons: [LESSON.business, LESSON.rivalry],
          effects: { advantage: 8, profit: 4, growth: 2, confidence: 4 },
          next: "f3",
        },
        {
          label: "Match them on price",
          summary: "Cut cost and meet the low-cost entrants head-to-head to defend market share.",
          reflection: "Fighting standardised low-cost rivals on their own ground, without a genuine cost advantage, is how a differentiated firm bleeds out. In a fast-cycle market this is the price war you are least equipped to win.",
          lessons: [LESSON.rivalry, LESSON.business],
          effects: { advantage: -6, profit: -8, growth: 0, confidence: -2 },
          next: "f3",
        },
        {
          label: "Invest in the substitute",
          summary: "Buy into the emerging substitute technology before rivals commit to it.",
          reflection: "A bold, forward-looking move. Disruptive technologies destroy existing market values — getting ahead of the substitute can reset the game in your favour. The bet is expensive and unproven, and it stretches the firm while today's margins are already thin.",
          lessons: [LESSON.external],
          effects: { advantage: 6, profit: -6, growth: 8, confidence: 0 },
          next: "f3",
        },
      ],
    },

    /* ---- ACT 2B — the INTERNAL branch ------------------------ */
    f2_capability: {
      eyebrow:  "The Value-Chain Audit",
      question: "Your audit finds a genuine core competency — a precision-calibration capability rivals consider too costly to imitate — buried inside a bloated operation that also does a great deal of low-value assembly badly.",
      prompt:   "What do you do with the finding?",
      options: [
        {
          label: "Leverage the competency",
          summary: "Concentrate investment on the calibration capability and build the whole strategy around it.",
          reflection: "Textbook resource-based strategy: firms win when core competencies are acquired, bundled and leveraged. Organising the strategy around a valuable, rare, costly-to-imitate capability is exactly how durable advantage is built.",
          lessons: [LESSON.internal],
          effects: { advantage: 12, profit: 2, growth: 2, confidence: 6 },
          next: "f3",
        },
        {
          label: "Outsource the weak links",
          summary: "Outsource the low-value assembly you do poorly and focus on the activities that create value.",
          reflection: "Sound value-chain logic: outsource a value-creating activity when an external supplier performs it better and you lack the resources to do it well, freeing capital for what you do best. Manage the dependency and you sharpen the firm considerably.",
          lessons: [LESSON.internal],
          effects: { advantage: 6, profit: 8, growth: 0, confidence: 2 },
          next: "f3",
        },
        {
          label: "Protect every job",
          summary: "Keep the entire chain in-house to avoid disruption and keep the division head onside.",
          reflection: "Protecting the whole operation to avoid internal pain preserves the very low-value activities that drag on margins. You keep the peace today and carry the bloat that is eroding your competitiveness into every future decision.",
          lessons: [LESSON.internal],
          effects: { advantage: -4, profit: -8, growth: -2, confidence: -2 },
          next: "f3",
        },
      ],
    },

    /* ---- ACT 2C — the PROFIT-POOL branch --------------------- */
    f2_profit: {
      eyebrow:  "The Profit Pool",
      question: "Your profit-pool map is stark: most of Meridian's profit comes from a narrow band of high-end, service-heavy customers — while the volume product line the firm is proud of barely breaks even.",
      prompt:   "How do you act on the map?",
      options: [
        {
          label: "Focus on the profit segment",
          summary: "Pursue a focused strategy — serve the high-value niche deeply and decline the unprofitable volume game.",
          reflection: "A focused strategy tailored to a specific, profitable buyer group is the disciplined read of the pool. Like the firms that monitor profitability closely and decline to play in low-profit segments, you concentrate where value actually accrues.",
          lessons: [LESSON.business],
          effects: { advantage: 6, profit: 10, growth: -4, confidence: 4 },
          next: "f3",
        },
        {
          label: "Build barriers around the pool",
          summary: "Defend the profitable segment with cost advantages and entry barriers to keep rivals out.",
          reflection: "Even in a stagnant market, profit pools persist for firms that build cost advantages and entry barriers to protect segment profitability. A defensive but durable play that secures the money you already make.",
          lessons: [LESSON.inputs, LESSON.business],
          effects: { advantage: 8, profit: 6, growth: 0, confidence: 2 },
          next: "f3",
        },
        {
          label: "Chase volume anyway",
          summary: "Keep pushing the low-margin volume line for the revenue headline.",
          reflection: "Optimising for a revenue headline over profit is exactly the error the profit-pool lens exists to prevent. You pour effort into a segment that barely breaks even and starve the one that actually pays.",
          lessons: [LESSON.business],
          effects: { advantage: -6, profit: -10, growth: 4, confidence: -4 },
          next: "f3",
        },
      ],
    },

    /* ---- ACT 3 — convergence: the ethics of competitor intel - */
    f3: {
      eyebrow:  "The Intelligence Dilemma",
      question: "Whatever path you took, you reach the same crossroads. A junior analyst proudly hands you a rival's confidential product roadmap — obtained, you realise, by a contact who photographed it after overhearing a meeting at a shared supplier. It would tell you exactly where the market is going. No one else knows she has it.",
      prompt:   "How do you handle the intelligence?",
      options: [
        {
          label: "Refuse and compete clean",
          summary: "Destroy it and rebuild your competitor analysis from legal, ethical sources only.",
          reflection: "Correct. Ethical competitor intelligence is gathered from legal sources — public filings, trade-show exhibits, published analysis — not eavesdropping or stolen documents. You protect the firm's governance and your own integrity, and lose nothing you couldn't earn cleanly.",
          lessons: [LESSON.external, LESSON.governance],
          effects: { advantage: 8, profit: 0, growth: 2, confidence: 10 },
          next: "f4_high",
        },
        {
          label: "Read it, then bury it",
          summary: "Glance at it for direction, but act only on what you could have learned legally.",
          reflection: "Half-measures in an ethics decision are still a decision. Once you've read a stolen roadmap you cannot un-know it, and 'I only used the legal parts' is a line you'll struggle to draw — or to defend if it ever surfaces.",
          lessons: [LESSON.external],
          effects: { advantage: 2, profit: 0, growth: 0, confidence: -4 },
          next: "f4_high",
        },
        {
          label: "Exploit it fully",
          summary: "Use the roadmap to pre-empt the rival's launch and seize the window.",
          reflection: "Acting on intelligence obtained through eavesdropping and trespass is precisely the illegal, unethical practice strategy ethics warns against. The short-term edge sits on a governance time-bomb that can detonate the moment the source is traced.",
          lessons: [LESSON.external, LESSON.governance],
          effects: { advantage: 6, profit: 6, growth: 4, confidence: -12 },
          next: "f4_low",
        },
      ],
    },

    /* ---- ACT 4 — the growth mandate, arriving from strength -- */
    f4_high: {
      eyebrow:  "The Growth Mandate",
      question: "Week ninety. Your position is strong and the board wants growth. The expansion camp is pushing hard: enter three new countries at once and acquire an unrelated business to diversify earnings. The cost-discipline camp wants you to stay home.",
      prompt:   "What is your recommendation to the board?",
      options: [
        {
          label: "Grow on the core",
          summary: "Related diversification plus a focused move into one region whose location advantages fit your competency.",
          reflection: "Related diversification builds on existing resources and competencies for economies of scope, and a location-advantage international move extends the product's life cycle without over-reaching. Growth that compounds your advantage rather than diluting it.",
          lessons: [LESSON.corporate, LESSON.international],
          effects: { advantage: 8, profit: 2, growth: 6, confidence: 8 },
          next: "end_architect",
        },
        {
          label: "Expand carefully abroad",
          summary: "A single multidomestic entry into one well-understood region; defer the acquisition.",
          reflection: "A defensible, measured step. A multidomestic entry tailored to a familiar market accesses new demand while limiting the liability of foreignness. Deferring the acquisition keeps risk contained — at the cost of the bolder upside the board hoped for.",
          lessons: [LESSON.international],
          effects: { advantage: 2, profit: 2, growth: 4, confidence: 2 },
          next: "end_balanced",
        },
        {
          label: "Diversify into anything that grows",
          summary: "Make the unrelated acquisition and enter all three countries at once.",
          reflection: "Unrelated diversification creates value only through financial economies that rivals easily copy, and simultaneous entry into three markets multiplies the liability of foreignness. Stretching this far, this fast, trades your hard-won advantage for a growth headline.",
          lessons: [LESSON.corporate, LESSON.international],
          effects: { advantage: -8, profit: -6, growth: 12, confidence: -8 },
          next: "end_overreach",
        },
      ],
    },

    /* ---- ACT 4 — the growth mandate, arriving from weakness -- */
    f4_low: {
      eyebrow:  "The Growth Mandate",
      question: "Week ninety. The questionable intelligence has leaked, and a governance review is now circulating. The board, rattled, still wants growth to change the story — and the expansion camp is using your weakened standing to push an aggressive acquisition spree.",
      prompt:   "What is your recommendation to the board?",
      options: [
        {
          label: "Grow on the core",
          summary: "Argue for disciplined, related growth despite the credibility you have lost.",
          reflection: "The right call on substance — related diversification and a focused regional entry — but made from a weakened position. With board confidence drained by the intelligence affair, principled discipline reads as caution. Strategic capital has to be banked before you need to spend it.",
          lessons: [LESSON.corporate, LESSON.international],
          effects: { advantage: 6, profit: 2, growth: 4, confidence: 4 },
          next: "end_recovered",
        },
        {
          label: "A cautious single step",
          summary: "Offer one modest, well-fitting market entry to steady the board.",
          reflection: "A survival compromise. One careful step keeps you in the room, but offering minimal growth while a governance cloud hangs over you rarely buys lasting confidence — it just defers the reckoning.",
          lessons: [LESSON.international],
          effects: { advantage: 0, profit: 0, growth: 4, confidence: -2 },
          next: "end_fragile",
        },
        {
          label: "Bet big to change the story",
          summary: "Back the aggressive unrelated acquisition spree to rebuild momentum fast.",
          reflection: "Stacking an unrelated diversification gamble on top of a governance scandal is risk piled on risk. You chase a growth headline to bury the ethics story, and hand the board two crises where it had one.",
          lessons: [LESSON.corporate, LESSON.governance],
          effects: { advantage: -10, profit: -8, growth: 12, confidence: -10 },
          next: "end_scandal",
        },
      ],
    },
  },
};


/* ──────────────────────────────────────────────────────────────
   SECTION 7 — GRAPH B: "PRESSURE SYSTEM"
   Everyone walks the SAME five decision points — but several
   options are GATED behind meter thresholds. Earlier decisions
   open or close the doors you find later. Locked doors stay
   visible, so learners see the consequence of their record.
   ────────────────────────────────────────────────────────────── */
const PRESSURE = {
  key:   "pressure",
  start: "p1",
  resolveByMeters: true,   // endings chosen from the meter profile
  nodes: {

    p1: {
      eyebrow:  "The First Hundred Days",
      question: "It is your first week as Chief Strategy Officer. How you open will set the dials that decide which doors stay open later.",
      prompt:   "What is your first move?",
      options: [
        {
          label: "Scan the environment",
          summary: "An outside-in opening — general and industry analysis, the five forces, and competitor profiling before committing.",
          reflection: "Builds Advantage and Board Confidence with a grounded read of the market. A measured, credible start.",
          lessons: [LESSON.external, LESSON.rivalry],
          effects: { advantage: 6, profit: -4, growth: 2, confidence: 4 },
          next: "p2",
        },
        {
          label: "Map the profit pools",
          summary: "A profit-first opening — locate where money actually pools across the value chain before acting.",
          reflection: "Banks Profitability hard and early. That reserve is exactly what later options requiring capital will demand.",
          lessons: [LESSON.inputs, LESSON.business],
          effects: { advantage: 2, profit: 12, growth: -2, confidence: 2 },
          next: "p2",
        },
        {
          label: "Audit the value chain",
          summary: "An inside-out opening — find the core competency rivals can't cheaply imitate.",
          reflection: "Banks Competitive Advantage and Board Confidence — the currency the board's final growth decision will require.",
          lessons: [LESSON.internal],
          effects: { advantage: 12, profit: 0, growth: -4, confidence: 6 },
          next: "p2",
        },
      ],
    },

    p2: {
      eyebrow:  "Competitive Rivalry",
      question: "Low-cost entrants are copying your products within months and undercutting you on price. How you respond depends partly on what you can afford.",
      prompt:   "How do you compete?",
      options: [
        {
          label: "Differentiate on the uncopyable",
          summary: "Compete on unique, valued features and brand loyalty rather than price.",
          reflection: "The evidence-based move in a fast-cycle market: differentiation builds loyalty that offsets price competition where rivals can't follow.",
          lessons: [LESSON.business, LESSON.rivalry],
          effects: { advantage: 8, profit: 4, growth: 2, confidence: 4 },
          next: "p3",
        },
        {
          label: "Match them on price",
          summary: "Cut cost and fight the low-cost entrants head-to-head on their own ground.",
          reflection: "Fighting standardised rivals without a real cost advantage bleeds a differentiated firm — the price war you're least built to win.",
          lessons: [LESSON.rivalry, LESSON.business],
          effects: { advantage: -6, profit: -8, growth: 0, confidence: -2 },
          next: "p3",
        },
        {
          label: "Acquire the substitute technology",
          summary: "Buy into the emerging substitute technology before rivals commit, resetting the game.",
          reflection: "A disruptive substitute can reset the market in your favour — but you can only fund the bet if Profitability is healthy. A door money opens.",
          lessons: [LESSON.external, LESSON.corporate],
          effects: { advantage: 8, profit: -8, growth: 10, confidence: 4 },
          gate: (m) => m.profit >= 55,
          gateHint: "Locked — requires Profitability \u2265 55",
          next: "p3",
        },
      ],
    },

    p3: {
      eyebrow:  "The Capability Question",
      question: "A value-chain audit finds a genuine core competency buried inside a bloated operation that does a lot of low-value work badly. Your options now depend on the standing you've banked.",
      prompt:   "How do you restructure?",
      options: [
        {
          label: "Full value-chain restructure",
          summary: "Reconfigure the whole chain around the core competency — outsource the weak links, reinvest in the strong ones.",
          reflection: "The most powerful route — but a disruptive, ground-up restructure only survives if the board and the division head already trust you. A door buy-in opens.",
          lessons: [LESSON.internal, LESSON.leadership],
          effects: { advantage: 12, profit: 6, growth: 0, confidence: 8 },
          gate: (m) => m.confidence >= 55,
          gateHint: "Locked — requires Board Confidence \u2265 55",
          next: "p4",
        },
        {
          label: "Commission an external strategy review",
          summary: "Bring in independent consultants to map the value chain and competencies at arm's length.",
          reflection: "Rigorous and independent, if costly. Always available — strategic clarity you can buy when you can't yet borrow trust.",
          lessons: [LESSON.internal, LESSON.inputs],
          effects: { advantage: 10, profit: -6, growth: 0, confidence: 4 },
          next: "p4",
        },
        {
          label: "Patch the obvious waste",
          summary: "Trim the most visible inefficiencies and leave the structure otherwise intact.",
          reflection: "Removes a little drag but leaves the bloated low-value activities in place — a cosmetic fix that never frees the competency to lead.",
          lessons: [LESSON.internal],
          effects: { advantage: -8, profit: 2, growth: 0, confidence: -6 },
          next: "p4",
        },
      ],
    },

    p4: {
      eyebrow:  "The Intelligence Dilemma",
      question: "A junior analyst hands you a rival's confidential roadmap, obtained by a contact who photographed it at a shared supplier. It would tell you exactly where the market is going. The expansion camp wants you to use it.",
      prompt:   "How do you handle the intelligence?",
      options: [
        {
          label: "Refuse and compete clean",
          summary: "Destroy it; rebuild competitor analysis from legal, ethical sources only.",
          reflection: "Upholds ethical intelligence and sound governance — compete on public filings and published analysis, not stolen documents.",
          lessons: [LESSON.external, LESSON.governance],
          effects: { advantage: 8, profit: 0, growth: 2, confidence: 10 },
          next: "p5",
        },
        {
          label: "Exploit it fully",
          summary: "Use the roadmap to pre-empt the rival's launch and seize the window.",
          reflection: "Acting on intelligence from eavesdropping and trespass is the illegal practice ethics warns against — a short edge on a governance time-bomb.",
          lessons: [LESSON.external, LESSON.governance],
          effects: { advantage: 6, profit: 6, growth: 4, confidence: -12 },
          next: "p5",
        },
      ],
    },

    p5: {
      eyebrow:  "The Growth Mandate",
      question: "Week ninety. The board wants growth and the expansion camp is pushing an unrelated acquisition and entry into three countries at once. Whether you can hold the disciplined line depends on the advantage you've built.",
      prompt:   "What is your recommendation?",
      options: [
        {
          label: "Grow on the core",
          summary: "Related diversification plus a focused, location-advantage entry into one fitting region.",
          reflection: "You can only win this argument if your competitive record gives you the standing to make it. A door advantage opens.",
          lessons: [LESSON.corporate, LESSON.international],
          effects: { advantage: 8, profit: 2, growth: 6, confidence: 8 },
          gate: (m) => m.advantage >= 60,
          gateHint: "Locked — requires Competitive Advantage \u2265 60",
          next: "RESOLVE",
        },
        {
          label: "A cautious single step",
          summary: "One modest multidomestic entry into a well-understood region; defer the acquisition.",
          reflection: "Measured growth that limits the liability of foreignness — workable, if the caution doesn't read as having no plan.",
          lessons: [LESSON.international],
          effects: { advantage: 2, profit: 2, growth: 4, confidence: 2 },
          next: "RESOLVE",
        },
        {
          label: "Diversify into anything that grows",
          summary: "Make the unrelated acquisition and enter all three countries at once.",
          reflection: "Unrelated diversification and simultaneous entry multiply risk and the liability of foreignness — a growth headline bought with your advantage.",
          lessons: [LESSON.corporate, LESSON.international],
          effects: { advantage: -8, profit: -6, growth: 12, confidence: -8 },
          next: "RESOLVE",
        },
      ],
    },
  },
};


/* ──────────────────────────────────────────────────────────────
   SECTION 8 — ENDINGS
   ‣ FORKING terminals: fixed narrative per path. The TIER (color)
     is computed from your final meters by the engine.
   ‣ PRESSURE endings: chosen from the final meter profile.
   ────────────────────────────────────────────────────────────── */
const FORKING_ENDINGS = {
  end_architect: {
    tier: "good",
    title: "The Strategy Architect",
    body: "Meridian turns the corner. A clear-eyed read of the environment, a strategy built on a real core competency, differentiation the low-cost rivals can't follow, and disciplined related growth combine into durable advantage. The board sees a strategist who can pair sound analysis with nerve under pressure — and your hundred-day plan becomes the blueprint for the next decade.",
  },
  end_balanced: {
    tier: "moderate",
    title: "Steady Course",
    body: "You set a defensible strategy without breaking anything that matters. Deferring the bigger international move leaves some upside on the table, but the competitive position is sound and the board trusts your judgement. A solid, well-reasoned start to the mandate.",
  },
  end_overreach: {
    tier: "poor",
    title: "Stretched Too Thin",
    body: "You ran a clean diagnosis and then over-reached at the finish, betting on unrelated diversification and three simultaneous market entries. The growth headline landed; the liability of foreignness, the thin synergies, and the diluted advantage did not show up this quarter. They will show up in next year's returns.",
  },
  end_recovered: {
    tier: "moderate",
    title: "Partial Recovery",
    body: "The intelligence affair cost you, and you spent the rest of the mandate paying it back. Arguing for disciplined, related growth from a weakened position was the right instinct, but principled stands land softly when board confidence is already drained. You held the strategy together — just.",
  },
  end_fragile: {
    tier: "poor",
    title: "Fragile Standing",
    body: "A mishandled intelligence call and a string of survival compromises leave the strategy outwardly intact and inwardly brittle. You are still in the room, still hitting most milestones — but the mandate runs on borrowed confidence, and the next governance review will test how little is left.",
  },
  end_scandal: {
    tier: "catastrophic",
    title: "Governance Failure",
    body: "An exploited stolen roadmap, a price war you couldn't win, and a desperate unrelated-diversification gamble combine into a perfect storm: the ethics breach surfaces publicly, the acquisitions sour, and board confidence evaporates. The strategy is repudiated and Meridian moves to replace its Chief Strategy Officer.",
  },
};

/* Meter-profile endings for the PRESSURE graph (and as the engine's
   verdict source for tier color everywhere). Evaluated top to bottom;
   first match whose test passes is used. */
const METER_ENDINGS = [
  {
    tier: "good",
    test: (m, avg, min) => avg >= 66 && min >= 45,
    title: "The Strategy Architect",
    body: "Every dial finished in healthy territory. You unlocked the hardest doors — the substitute-technology bet, the full value-chain restructure, the principled stand for disciplined growth — because your earlier work earned the standing to walk through them. Meridian relaunches as a focused, differentiated, well-governed firm.",
  },
  {
    tier: "moderate",
    test: (m, avg, min) => avg >= 54,
    title: "Mixed Signals",
    body: "A creditable mandate with one soft flank. You kept most of the strategy healthy, but the dimension you under-fed quietly closed a door or two you would have wanted open at the end. The strategy holds; the lesson is that strategic capital has to be banked before you need to spend it.",
  },
  {
    tier: "poor",
    test: (m, avg, min) => avg >= 40,
    title: "Running on Empty",
    body: "You hit some marks but drained the reserves that unlock the strong options. By the final act the doors that mattered — the value-chain restructure, the principled stand on growth — were locked, and you were left choosing among the weaker routes. The strategy ships, diminished.",
  },
  {
    tier: "catastrophic",
    test: () => true,
    title: "Systemic Failure",
    body: "The dials collapsed together. Starved of advantage, profit, and board confidence, every late door was locked and every remaining choice made things worse. The mandate ends facing the very problems the diagnosis warned about — eroding margins, copycat rivals, and a board that has lost faith.",
  },
];


/* ──────────────────────────────────────────────────────────────
   SECTION 9 — UI LABELS
   ────────────────────────────────────────────────────────────── */
const LABELS = {
  btnContinue: "CONTINUE",
  btnSubmit:   "SUBMIT",
  btnTryAgain: "START OVER",

  optionLabel: (n) => `OPTION ${n}`,

  /* structure switcher (intro) */
  structureHeading: "Choose a branching structure",
  structures: {
    forking:  { name: "Forking Path",     blurb: "Your first move sends you down a genuinely different middle act. The shape of the journey changes." },
    pressure: { name: "Pressure System",  blurb: "Everyone walks the same five decisions — but strong options stay LOCKED until your hidden meters earn them." },
  },

  /* debrief */
  debriefPrefix:    "Debrief:",
  debriefTitle:     "Outcome & Review",
  metersHeading:    "How the four dimensions finished",
  /* qualitative bands for each meter value (evaluated high → low) */
  meterBands: [
    { min: 78, label: "Strong",   color: "#2f7d36" },
    { min: 62, label: "Healthy",  color: "#59a85f" },
    { min: 45, label: "Strained", color: "#c98a2b" },
    { min: 30, label: "Fragile",  color: "#cf7032" },
    { min: 0,  label: "Critical", color: "#c44545" },
  ],
  /* debrief synthesis line — {strong}/{weak} are filled with meter names */
  meterSummaryHeading: "What the dials say",
  meterSummary: {
    good:        "A well-balanced run. {strong} is your standout, and even your weakest dimension, {weak}, held its ground — the mark of a strategist who paid into every account before drawing on any.",
    moderate:    "A creditable result built on {strong}, but {weak} was left exposed. The strategy holds; the lesson is that the dimension you under-feed is the one that closes doors when you can least afford it.",
    poor:        "You leaned hard on {strong} while {weak} drained away. By the final act the reserves that unlock the strongest options were gone, leaving only the weaker routes.",
    catastrophic:"The dials collapsed together. {weak} gave way first and pulled the rest down with it — every late door locked, every remaining choice made things worse.",
  },
  mapHeading:       "The path you took",
  mapHint:          "Click any decision below to rewind to it and try a different branch.",
  mapOpenBtn:       "VIEW PATH MAP",
  hideMapBtn:       "HIDE",
  lockedLabel:      "LOCKED",
  reflectionHeading:"Why it played out this way",
  lessonsHeading:   "Readings that support this decision",
  rewindLabel:      "Rewind to here",
  notTakenLabel:    "Roads not taken",

  pageLabel: (n) => `DECISION ${n}`,
};


/* ──────────────────────────────────────────────────────────────
   EXPORT
   ────────────────────────────────────────────────────────────── */
window.BSCENARIO = {
  META, INTRO, CONTEXT,
  METERS, METER_START,
  GRAPHS: { forking: FORKING, pressure: PRESSURE },
  FORKING_ENDINGS, METER_ENDINGS,
  LABELS,
};
})();
