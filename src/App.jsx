import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  createContext,
  useContext,
} from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Shield,
  LayoutDashboard,
  FileText,
  Clock,
  GitCompare,
  AlertTriangle,
  FileBarChart,
  Info,
  Search,
  Bell,
  User,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Globe,
  Building2,
  Cpu,
  Lock,
  Server,
  Activity,
  ArrowUpRight,
  Download,
  ExternalLink,
  Layers,
  Target,
  BookOpen,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Radio,
  ChevronUp,
  Minus,
  Zap,
  Network,
  Scale,
  Landmark,
  ClipboardCheck,
  Truck,
  BrainCircuit,
  Cloud,
  Atom,
} from "lucide-react";

/* ============================================================================
   THEME
============================================================================ */
const ThemeContext = createContext({ theme: "dark", toggle: () => {} });

const T = {
  dark: {
    bg: "#050810",
    panel: "rgba(15,20,34,0.72)",
    panelSolid: "#0B0F1C",
    border: "rgba(148,163,184,0.10)",
    borderStrong: "rgba(148,163,184,0.20)",
    text: "#E7ECF5",
    textMuted: "#8A94A8",
    textFaint: "#5B647A",
  },
  light: {
    bg: "#F3F5F9",
    panel: "rgba(255,255,255,0.80)",
    panelSolid: "#FFFFFF",
    border: "rgba(15,23,42,0.08)",
    borderStrong: "rgba(15,23,42,0.14)",
    text: "#0F172A",
    textMuted: "#54607A",
    textFaint: "#8A94A8",
  },
};

const ACCENT = {
  blue: "#3B82F6",
  cyan: "#22D3EE",
  emerald: "#34D399",
  amber: "#F59E0B",
  rose: "#F43F5E",
  violet: "#A78BFA",
};

/* ============================================================================
   UTILITIES
============================================================================ */
function useCountUp(target, duration = 1400, decimals = 0) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const from = 0;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(from + (target - from) * eased);
      if (progress < 1) ref.current = requestAnimationFrame(step);
    }
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val);
}

function cls(...a) {
  return a.filter(Boolean).join(" ");
}

// Downloads a formatted, self-contained HTML report as a real file — works
// reliably on deployed sites (no popup blockers, no document.write races).
// The file opens in any browser; from there, the browser's own Print dialog
// (Ctrl/Cmd+P → Save as PDF) converts it to PDF if needed.
function exportReport(filename, title, bodyHtml) {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      @page { margin: 2cm; }
      * { box-sizing: border-box; }
      body { font-family: -apple-system, 'Segoe UI', Inter, Arial, sans-serif; color: #0F172A; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
      h1 { font-size: 22px; border-bottom: 3px solid #3B82F6; padding-bottom: 12px; margin-bottom: 4px; }
      h2 { font-size: 16px; margin-top: 28px; color: #1E3A8A; }
      h3 { font-size: 13.5px; margin-top: 18px; margin-bottom: 4px; }
      .meta { color: #64748B; font-size: 12px; margin-bottom: 24px; }
      .badge { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; padding: 2px 8px; border-radius: 999px; background: #DBEAFE; color: #1D4ED8; margin-right: 6px; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 12px; }
      th, td { border: 1px solid #E2E8F0; padding: 6px 10px; text-align: left; vertical-align: top; }
      th { background: #F1F5F9; }
      ul { margin: 6px 0; padding-left: 20px; }
      li { margin-bottom: 4px; font-size: 12.5px; }
      p { font-size: 12.5px; color: #334155; }
      .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #E2E8F0; font-size: 10.5px; color: #94A3B8; }
      .tip { background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; font-size: 11.5px; padding: 10px 14px; border-radius: 8px; margin-bottom: 20px; }
    </style>
  </head>
  <body>
    <div class="tip">Tip: to save this as a PDF, press Ctrl/Cmd+P and choose "Save as PDF" as the destination.</div>
    ${bodyHtml}
    <div class="footer">Generated from the EU Cybersecurity Act 2.0 Policy Research Platform · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
  </body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function riskColor(score) {
  if (score >= 80) return ACCENT.emerald;
  if (score >= 60) return ACCENT.cyan;
  if (score >= 40) return ACCENT.amber;
  return ACCENT.rose;
}
function riskLabel(score) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Adequate";
  if (score >= 40) return "Developing";
  return "Critical";
}

/* ============================================================================
   PRIMITIVES
============================================================================ */
function Panel({ children, className = "", style = {}, hover = false }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <div
      className={cls(
        "rounded-2xl backdrop-blur-xl transition-all duration-300",
        hover && "hover:-translate-y-0.5",
        className,
      )}
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        boxShadow:
          theme === "dark"
            ? "0 1px 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.6)"
            : "0 1px 0 rgba(255,255,255,0.6) inset, 0 20px 40px -28px rgba(15,23,42,0.15)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, color = ACCENT.cyan }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <span
        className="text-[11px] font-semibold tracking-[0.18em] uppercase"
        style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {children}
      </span>
    </div>
  );
}

function PageHeader({ eyebrow, title, subtitle, icon: Icon }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <div className="mb-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(34,211,238,0.10))",
              border: `1px solid ${c.borderStrong}`,
            }}
          >
            <Icon size={22} style={{ color: ACCENT.cyan }} />
          </div>
        )}
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-2 text-[15px] leading-relaxed max-w-3xl"
              style={{ color: c.textMuted }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color = ACCENT.blue, subtle = true }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
      style={{
        color,
        background: subtle ? `${color}18` : color,
        border: `1px solid ${color}40`,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value, color = ACCENT.blue, height = 8 }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{
        height,
        background:
          theme === "dark" ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.08)",
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
        }}
      />
    </div>
  );
}

/* ============================================================================
   DATA
============================================================================ */
const KPIS = [
  {
    label: "Est. 5-Year Economic Cost",
    value: 367.8,
    suffix: " €bn",
    decimals: 1,
    max: 400,
    icon: Landmark,
    color: ACCENT.rose,
    trend: 8.2,
    invert: true,
  },
  {
    label: "Germany's Projected Loss",
    value: 170.8,
    suffix: " €bn",
    decimals: 1,
    max: 200,
    icon: Building2,
    color: ACCENT.rose,
    trend: 4.6,
    invert: true,
  },
  {
    label: "Energy + Telecom Loss Share",
    value: 40,
    suffix: "%",
    decimals: 0,
    max: 100,
    icon: Zap,
    color: ACCENT.amber,
    trend: 1.8,
    invert: true,
  },
  {
    label: "Max Harmonised Penalty",
    value: 7,
    suffix: "%",
    decimals: 0,
    max: 10,
    icon: Scale,
    color: ACCENT.amber,
    trend: 0.4,
    invert: true,
  },
  {
    label: "Sectors In Scope",
    value: 18,
    suffix: "",
    decimals: 0,
    max: 18,
    icon: Building2,
    color: ACCENT.cyan,
    trend: 2.1,
    invert: true,
  },
  {
    label: "SME Turnover Threshold",
    value: 0,
    suffix: " € (none)",
    decimals: 0,
    max: 1,
    icon: AlertTriangle,
    color: ACCENT.rose,
    trend: 0,
    invert: true,
  },
  {
    label: "Max 5G/6G Phase-Out Period",
    value: 36,
    suffix: " months",
    decimals: 0,
    max: 36,
    icon: Clock,
    color: ACCENT.blue,
    trend: 2.4,
    invert: false,
  },
  {
    label: "Critical Gaps Identified",
    value: 5,
    suffix: "",
    decimals: 0,
    max: 5,
    icon: ShieldAlert,
    color: ACCENT.violet,
    trend: 0.5,
    invert: true,
  },
];

// Estimated €367.8bn cost, broken down per the CCCEU/KPMG joint assessment (6 May 2026)
const COST_BREAKDOWN = [
  { category: "Direct Replacement", costBn: 150 },
  { category: "Supply Chain Disruption", costBn: 80 },
  { category: "Social & Transition Effects", costBn: 100 },
  { category: "Legal & Compliance Burden", costBn: 39.5 },
];

// Sector share of losses — Energy and Telecom explicitly quantified; remainder derived
const COST_BY_SECTOR = [
  { name: "Energy", value: 79.9, color: ACCENT.amber },
  { name: "Telecom", value: 57.4, color: ACCENT.cyan },
  { name: "Other Sectors (derived)", value: 230.5, color: ACCENT.violet },
];

const RECENT_UPDATES = [
  {
    tag: "PROPOSAL",
    title:
      "European Commission publishes CSA2 — COM(2026) 11 final, procedure 2026/0011/COD",
    time: "20 Jan 2026",
    color: ACCENT.blue,
  },
  {
    tag: "ANALYSIS",
    title:
      "Global Policy Watch publishes first summary of ICT supply-chain and certification reforms",
    time: "23 Jan 2026",
    color: ACCENT.cyan,
  },
  {
    tag: "LEGAL",
    title:
      'Euractiv: "Brussels\' proposed cybersecurity overhaul risks constitutional red flags"',
    time: "4 Mar 2026",
    color: ACCENT.rose,
  },
  {
    tag: "REGULATORY",
    title:
      "EDPB–EDPS publish joint opinion on the Cybersecurity Package, seek GDPR clarity",
    time: "9 Apr 2026",
    color: ACCENT.violet,
  },
  {
    tag: "ECONOMIC",
    title:
      "CCCEU / KPMG estimate €367.8bn five-year cost of mandatory exclusion measures",
    time: "6 May 2026",
    color: ACCENT.amber,
  },
  {
    tag: "LEGAL",
    title:
      'Lexology: "Building on shaky foundations" — legal critique of the Title IV supply-chain regime',
    time: "6 May 2026",
    color: ACCENT.rose,
  },
];

const TIMELINE = [
  {
    year: "2016–2018",
    title: "General Data Protection Regulation (GDPR)",
    status: "In Force",
    desc: "Establishes the EU's foundational data protection regime, introducing extraterritorial scope, breach notification duties, and administrative fines of up to 4% of global turnover.",
    detail:
      "GDPR (Regulation (EU) 2016/679) reframed personal data as a fundamental rights issue. Article 32's risk-based security-measures duty is the closest existing analogue to CSA2's supply-chain risk logic — but, as this research's gap analysis shows, GDPR's scope is limited to personal data, whereas CSA2 would extend to all categories of data processed within \"key ICT assets,\" including operational, industrial and commercial data.",
    refs: ["Regulation (EU) 2016/679"],
  },
  {
    year: "2019",
    title: "Cybersecurity Act (CSA 1 / Regulation 2019/881)",
    status: "Superseded by Proposal",
    desc: "Grants ENISA a permanent mandate and establishes a voluntary EU-wide cybersecurity certification framework. Purely technical in focus, with no supply-chain obligations.",
    detail:
      "The original Cybersecurity Act was, at its core, an internal-market harmonisation instrument: a permanent ENISA mandate plus voluntary certification schemes such as EUCC. It did not place obligations on companies in connection with the ICT supply chain — addressing supply-chain security only indirectly through voluntary certification. CSA2 is framed as its direct successor and would formally repeal it.",
    refs: ["Regulation (EU) 2019/881"],
  },
  {
    year: "2022",
    title: "NIS2 Directive Adopted",
    status: "In Force",
    desc: "Repeals NIS1, expands to 18 sectors, imposes management-body liability, and introduces an explicit supply-chain risk-management duty.",
    detail:
      "Directive (EU) 2022/2555 is the direct scoping template for CSA2: the same 18 sectors, split into essential and important entities, reappear as CSA2's baseline. Unlike CSA2, however, NIS2 retains proportionality mechanisms tied to entity size, and its supply-chain duty is risk-based rather than geopolitically classified.",
    refs: ["Directive (EU) 2022/2555"],
  },
  {
    year: "2022–2025",
    title: "Digital Operational Resilience Act (DORA)",
    status: "In Force (since Jan 2025)",
    desc: "Creates a sector-specific ICT risk-management and third-party oversight regime for financial services, including direct oversight of critical cloud providers.",
    detail:
      "Regulation (EU) 2022/2554 gives EU authorities direct supervisory powers over major cloud and technology vendors serving the financial sector — a narrower, sector-specific precedent for the kind of third-party oversight CSA2 seeks to apply horizontally across 18 sectors.",
    refs: ["Regulation (EU) 2022/2554"],
  },
  {
    year: "2024–2027",
    title: "Cyber Resilience Act (CRA)",
    status: "In Force (phased)",
    desc: "Introduces mandatory cybersecurity-by-design, SBOM expectations, and vulnerability-disclosure duties for products with digital elements.",
    detail:
      "Regulation (EU) 2024/2847 regulates products rather than organisations, using technically verifiable criteria — secure-by-design development, SBOM, coordinated vulnerability disclosure. This is the model this research's Recommendation 1 argues CSA2's supply-chain regime should follow, in place of geopolitical designation.",
    refs: ["Regulation (EU) 2024/2847"],
  },
  {
    year: "20 Jan 2026",
    title: "Cybersecurity Act 2.0 — Commission Proposal Published",
    status: "Proposed",
    desc: 'COM(2026) 11 final: a proposal to repeal Regulation 2019/881, reform ENISA and the ECCF, and introduce a new Title IV ICT supply-chain security framework, including a mechanism to designate "high-risk" third countries and suppliers.',
    detail:
      'Published under the ordinary legislative procedure (2026/0011/COD), CSA2 rests on four pillars: a strengthened ENISA mandate, a reformed European Cybersecurity Certification Framework, simplified compliance synergies with NIS2/CRA/GDPR, and — the most consequential addition — a horizontal ICT supply-chain security framework. The Commission\'s framing was blunt: "Europe cannot be naive anymore." The proposal covers all companies across 18 critical sectors with no employee, turnover or balance-sheet threshold.',
    refs: ["European Commission (2026) COM(2026) 11 final"],
  },
  {
    year: "4 Mar 2026",
    title: "Constitutional Legal Basis Challenged",
    status: "Legal Critique",
    desc: "Legal commentary argues Title IV's supply-chain regime is, in substance, a national-security and foreign-policy measure improperly grounded in Article 114 TFEU's internal-market competence.",
    detail:
      'As this research\'s Gap 2 details, national security remains a Member State competence under Article 4(2) TEU. Legal scholars argue CSA2 "cannot survive scrutiny under the principles of conferral, subsidiarity, proportionality, and the rule of law" in its current form, and that vague concepts such as "high-risk supplier" require objective criteria to satisfy the duty to state reasons under Article 296 TFEU.',
    refs: [
      "Euractiv (2026) Brussels' proposed cybersecurity overhaul risks constitutional red flags",
    ],
  },
  {
    year: "9 Apr 2026",
    title: "EDPB–EDPS Joint Opinion Published",
    status: "Regulatory Opinion",
    desc: "The European Data Protection Board and European Data Protection Supervisor welcome CSA2's objectives but call for greater clarity on its relationship with GDPR certification and data-transfer safeguards.",
    detail:
      "The joint opinion recommends that ENISA consult the EDPB before adopting certification schemes relating to personal-data-processing security, and flags that security controls must not undermine individuals' fundamental rights and freedoms — the tension this research's Gap 4 explores in depth.",
    refs: [
      "Matheson (2026) EDPB – EDPS publish Opinion on the Cybersecurity Package",
    ],
  },
  {
    year: "6 May 2026",
    title: "€367.8bn Economic Impact Estimate Released",
    status: "Economic Assessment",
    desc: "A joint CCCEU/KPMG assessment estimates mandatory exclusion measures could cost the EU €367.8 billion over five years, with Germany, the energy sector and the telecom sector bearing the largest share.",
    detail:
      "The estimate breaks down into €150bn direct replacement costs, €80bn supply-chain disruption, €100bn wider social and transition effects, and nearly €40bn in legal and compliance burdens. This research's Gap 3 and Recommendation 2 use this figure to argue for SME-specific proportionality mechanisms and phased implementation.",
    refs: ["Euractiv (2026) €367.8 Billion Question: Guardrails or Blockade?"],
  },
  {
    year: "2026–ongoing",
    title: "European Parliament & Council Review",
    status: "Under Negotiation",
    desc: "CSA2 proceeds through the ordinary legislative procedure. Trilogue negotiations and potential amendments — including to the Title IV designation mechanism — remain live.",
    detail:
      "This research treats the current text as a moving target: the strategic recommendations in Section 5 (objective technical criteria, proportionality mechanisms, clarified legal basis, GDPR compatibility, implementation guidance, and future-proofing for AI/quantum) are framed as amendments the co-legislators could still adopt before final agreement.",
    refs: ["European Parliamentary Research Service, Impact Assessment review"],
  },
];

const COMPARISON_ROWS = [
  {
    dim: "Primary Scope",
    CSA2: "18 NIS2-aligned sectors; no turnover/employee threshold",
    GDPR: "Personal data protection, all sectors",
    NIS2: "Essential & important entities, 18 sectors (with thresholds)",
    CRA: "Products with digital elements",
    SOCI: "11 sectors, critical infrastructure assets (AU)",
  },
  {
    dim: "Risk-Assessment Basis",
    CSA2: 'Geopolitical / "non-technical risk" designation (Title IV)',
    GDPR: "Technical & organisational risk (Art. 32)",
    NIS2: "ICT risk-management framework",
    CRA: "Technical: secure-by-design, SBOM, CVD",
    SOCI: "All-hazards: cyber, personnel, supply chain, physical",
  },
  {
    dim: "Max Penalty",
    CSA2: "Up to 7% global turnover (tiered 1% / 2% / 7%)",
    GDPR: "4% global turnover / €20M",
    NIS2: "2% global turnover / €10M",
    CRA: "2.5% global turnover / €15M",
    SOCI: "AUD 11.1M+ per contravention",
  },
  {
    dim: "Supply Chain Mechanism",
    CSA2: "Mandatory high-risk supplier designation & phase-out",
    GDPR: "Processor / sub-processor liability",
    NIS2: "Explicit supply-chain risk-mgmt duty",
    CRA: "SBOM + component vulnerability duty",
    SOCI: "Positive Security Obligation (CIRMP)",
  },
  {
    dim: "SME Proportionality",
    CSA2: "None in current draft — no size threshold at all",
    GDPR: "Risk-scaled (DPIA thresholds)",
    NIS2: "Size thresholds distinguish essential/important",
    CRA: "Some SME support provisions",
    SOCI: "Graduated, asset-tailored obligations",
  },
  {
    dim: "AI / Quantum Coverage",
    CSA2: "Not addressed in current text (recommended in Rec. 6)",
    GDPR: "Automated decision-making (Art. 22)",
    NIS2: "Indirect (ICT risk mgmt)",
    CRA: "AI Act interplay for embedded AI",
    SOCI: "Not directly addressed",
  },
  {
    dim: "Legal Basis",
    CSA2: "Art. 114 TFEU — contested for a de facto security measure",
    GDPR: "Art. 16 TFEU (data protection)",
    NIS2: "Art. 114 TFEU (less contested — no geopolitical mechanism)",
    CRA: "Art. 114 TFEU (product safety)",
    SOCI: "Australian federal legislation",
  },
  {
    dim: "Enforcement Model",
    CSA2: "Member States enforce Commission-harmonised penalties",
    GDPR: "National DPAs + EDPB",
    NIS2: "National competent authorities",
    CRA: "Market surveillance authorities",
    SOCI: "Cyber and Infrastructure Security Centre",
  },
  {
    dim: "International Alignment",
    CSA2: "Diverges from NIST CSF / ISO 27001 / OECD risk-based norms",
    GDPR: "Adequacy-decisions framework",
    NIS2: "Aligned to ISO 27001, NIST CSF",
    CRA: "Aligned to IEC 62443",
    SOCI: "Aligned to AESCSF, NIST CSF",
  },
];

// Scored against the report's own critique: CSA2 scores low on technical basis,
// proportionality, legal certainty and international alignment despite broad scope.
const RADAR_COMPARISON = [
  { metric: "Scope Breadth", CSA2: 92, GDPR: 70, NIS2: 88, CRA: 60, SOCI: 65 },
  {
    metric: "Technical Risk Basis",
    CSA2: 25,
    GDPR: 75,
    NIS2: 78,
    CRA: 82,
    SOCI: 85,
  },
  {
    metric: "SME Proportionality",
    CSA2: 20,
    GDPR: 65,
    NIS2: 55,
    CRA: 58,
    SOCI: 60,
  },
  {
    metric: "Legal Certainty",
    CSA2: 35,
    GDPR: 80,
    NIS2: 70,
    CRA: 68,
    SOCI: 72,
  },
  {
    metric: "Supply Chain Rigor",
    CSA2: 88,
    GDPR: 45,
    NIS2: 72,
    CRA: 90,
    SOCI: 68,
  },
  {
    metric: "Intl. Alignment (NIST/ISO/OECD)",
    CSA2: 30,
    GDPR: 85,
    NIS2: 80,
    CRA: 75,
    SOCI: 78,
  },
];

const RISK_LIKELIHOOD = [
  "Rare",
  "Unlikely",
  "Possible",
  "Likely",
  "Almost Certain",
];
const RISK_IMPACT = ["Negligible", "Minor", "Moderate", "Major", "Severe"];
// Each item maps to a specific gap or finding in the report's critical analysis
const RISK_ITEMS = [
  {
    name: "Gap 1 — Geopolitical designation replaces technical risk assessment",
    l: 4,
    i: 4,
  },
  {
    name: "Gap 3 — €367.8bn disproportionate economic burden materialises",
    l: 4,
    i: 4,
  },
  {
    name: "Gap 2 — Art. 114 TFEU legal basis challenged before the CJEU",
    l: 3,
    i: 4,
  },
  {
    name: "Cascading, sanctions-like supply-chain exclusion effects",
    l: 3,
    i: 3,
  },
  {
    name: "SME compliance collapse — no turnover/employee threshold",
    l: 3,
    i: 3,
  },
  {
    name: "5G/6G investment diverted by 36-month phase-out mandate",
    l: 3,
    i: 2,
  },
  { name: 'Gap 5 — ambiguous "key ICT asset" definition', l: 4, i: 2 },
  { name: "Gap 4 — GDPR data-transfer adequacy conflict", l: 2, i: 3 },
  {
    name: "Loss of hub-state (e.g. Ireland) influence over designation decisions",
    l: 2,
    i: 3,
  },
  { name: "AI & post-quantum cryptography regulatory blind spot", l: 2, i: 2 },
];
function cellColor(l, i) {
  const score = (l + 1) * (i + 1);
  if (score >= 20) return "#7F1D2B";
  if (score >= 12) return "#8A4A1F";
  if (score >= 6) return "#7A6A1A";
  return "#1F5C42";
}

// Section 3.2 gaps mapped directly to their Section 5 recommendation
const GAP_RECOMMENDATIONS = [
  {
    gap: "Gap 1",
    title: "Geopolitical designation replaces technical risk assessment",
    problem:
      'CSA2\'s Title IV "non-technical risk" mechanism assesses a supplier country\'s legal system, governance, and political environment rather than documented vulnerabilities — "highly subjective and political" per Michel Petite (Clifford Chance).',
    recTitle:
      "Recommendation 1 — Anchor the Regime in Objective, Verifiable Technical Criteria",
    justification:
      'Vague concepts such as "high-risk supplier" require objective criteria and clear reasoning under the duty to state reasons (Art. 296 TFEU). Generic references to geopolitical concerns would not suffice.',
    steps: [
      'Amend Arts. 2(38)–2(39) to define "non-technical risk" using verifiable criteria (documented vulnerabilities, history of supply-chain compromise, certification participation, judicial oversight)',
      "Develop criteria through an ENISA-led multi-stakeholder process (national authorities, industry incl. SMEs, civil society, ISO/NIST)",
      "Codify criteria in a delegated act, subject to European Parliament and Council scrutiny",
    ],
  },
  {
    gap: "Gap 2",
    title: "Strained legal basis under Article 114 TFEU",
    problem:
      'The Title IV supply-chain regime is, in substance, a national-security and foreign-policy measure. National security remains a Member State competence under Article 4(2) TEU, and legal scholars argue it "cannot survive scrutiny" under conferral, subsidiarity and proportionality in its current form.',
    recTitle:
      "Recommendation 3 — Clarify the Legal Basis and Ensure Constitutional Validity",
    justification:
      "Ireland — historically the European hub for major US technology companies — \"has no effective veto over a Commission decision to designate a third country or list an individual supplier as 'high-risk'.\"",
    steps: [
      "Option 1: Add a competence provision under Art. 207 TFEU (common commercial policy)",
      "Option 2: Convert designation into an advisory-ENISA framework with genuine procedural and evidential constraints",
      "Option 3: Consider an Intergovernmental Conference on Treaty amendment if neither option resolves the tension",
    ],
  },
  {
    gap: "Gap 3",
    title: "Disproportionate economic and operational burden",
    problem:
      "CCCEU/KPMG estimate mandatory exclusion measures could cost the EU €367.8bn over five years. CSA2 covers all companies with no employee, turnover, or balance-sheet threshold — for many SMEs, compliance costs could exceed annual profit margins.",
    recTitle:
      "Recommendation 2 — Introduce Proportionality Mechanisms and Phased Implementation for SMEs",
    justification:
      '"Forced exclusion does not automatically translate into immediate replacement — it risks slowing deployment at a critical moment," per Euractiv\'s analysis of telecom and energy supply chains.',
    steps: [
      "Amend Arts. 103–110 to add SME-specific exemptions and graduated timelines",
      "Establish a €5bn Cybersecurity Transition Fund to support SME compliance",
      "Require ENISA to publish SME-specific guidance",
      "Adopt safe-harbor provisions for SMEs unable to diversify supply chains within compressed timelines",
    ],
  },
  {
    gap: "Gap 4",
    title: "Conflict with GDPR data-protection frameworks",
    problem:
      "CSA2's data-transfer and remote-processing restrictions would apply to all data categories processed within \"key ICT assets\" — not just personal data — creating potential conflict with GDPR's adequacy mechanisms.",
    recTitle:
      "Recommendation 4 — Address Data Transfer Restrictions and GDPR Compatibility",
    justification:
      'The EDPB and EDPS have called for "greater clarity on the relationship between the European Cybersecurity Certification Framework and GDPR certification," and recommend ENISA consult the EDPB before adopting relevant certification schemes.',
    steps: [
      'Amend Art. 103 to limit data-transfer restrictions to "sensitive operational data" rather than all categories',
      "Establish a data-transfer adequacy mechanism modelled on GDPR's adequacy decisions",
      "Require an EDPB opinion on CSA2's data-transfer provisions",
      "Ensure explicit harmonisation between CSA2 and GDPR certification mechanisms",
    ],
  },
  {
    gap: "Gap 5",
    title: "Practical implementation challenges",
    problem:
      'The definition of "key ICT assets" is broad and open to interpretation; the multi-step designation mechanism is complex to navigate. The European Parliamentary Research Service has identified "several analytical gaps" in the Commission\'s impact assessment.',
    recTitle:
      "Recommendation 5 — Establish Clear Implementation Guidance and Stakeholder Consultation",
    justification:
      "The proposal covers all companies operating in critical sectors without carve-outs, creating a compliance burden without consideration of proportionality — clear guidance is the minimum viable fix.",
    steps: [
      "Require ENISA to publish detailed implementation guidance within 12 months of adoption",
      "Establish a Stakeholder Advisory Group (industry, SMEs, civil society)",
      "Mandate regular reviews of the framework's effectiveness and proportionality",
      'Develop clear definitions for "key ICT assets" and "high-risk supplier"',
    ],
  },
];

// Recommendation 6 — future-proofing against emerging technology risk
const FUTURE_PROOFING = {
  "Artificial Intelligence": [
    "Mandatory AI security audits for critical-infrastructure systems using AI",
    "Audit trails enabling forensic analysis of security incidents",
    'Prohibition on "black box" AI systems whose controls cannot be independently verified',
    "Specific certification requirements for AI-enabled security products",
  ],
  "Quantum Computing": [
    "Mandatory migration to post-quantum cryptography for critical ICT assets, on an internationally consistent deadline",
    "Crypto-agility requirements for all newly procured ICT products and services",
    "An ENISA-led quantum threat assessment, updated annually",
  ],
  "Decentralised Systems": [
    "Clarified responsibility attribution for security incidents in blockchain / DLT systems",
    "Mandatory smart-contract security audits in critical-infrastructure applications",
    "Defined security requirements for decentralised identity systems",
  ],
};

// Section 2.4 — harmonised penalty tiers, for the interactive calculator
const PENALTY_TIERS = [
  {
    value: "disclosure",
    label: "Disclosure-related violation",
    pct: 1,
    note: "e.g. failure to disclose supplier information for key ICT assets",
  },
  {
    value: "noncompliance",
    label: "Other non-compliance",
    pct: 2,
    note: "e.g. failure to implement required technical or contractual measures",
  },
  {
    value: "serious",
    label: "Most serious infractions",
    pct: 7,
    note: "e.g. continued use of a Commission-designated high-risk supplier",
  },
];
const TURNOVER_BANDS = [
  { value: "2", label: "€2M (Micro enterprise)" },
  { value: "20", label: "€20M (Small enterprise)" },
  { value: "150", label: "€150M (Medium enterprise)" },
  { value: "5000", label: "€5bn (Large enterprise)" },
  { value: "80000", label: "€80bn (Multinational operator)" },
];
const FRAMEWORK_PENALTY_PCT = { CSA2: 7, GDPR: 4, NIS2: 2, CRA: 2.5 };

/* ============================================================================
   NAVIGATION
============================================================================ */
const NAV = [
  {
    group: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Research",
    items: [
      { id: "exec-summary", label: "Executive Summary", icon: FileText },
      { id: "timeline", label: "Legislative Timeline", icon: Clock },
      { id: "comparative", label: "Comparative Analysis", icon: GitCompare },
      { id: "recommendations", label: "Gap → Reform Explorer", icon: Target },
    ],
  },
  {
    group: "Analysis",
    items: [{ id: "risk-matrix", label: "Risk Matrix", icon: AlertTriangle }],
  },
  {
    group: "Applied Assessment",
    items: [
      { id: "cset-sim", label: "CSET Assessment Tool", icon: ClipboardCheck },
    ],
  },
  {
    group: "Platform",
    items: [
      { id: "reports", label: "Reports", icon: FileBarChart },
      { id: "about", label: "About", icon: Info },
    ],
  },
];
const NAV_FLAT = NAV.flatMap((g) => g.items);

// Global search index — combines pages and key content from across the platform.
// Each entry navigates to its page when clicked.
const SEARCH_INDEX = [
  ...NAV_FLAT.map((item) => ({
    label: item.label,
    category: "Page",
    pageId: item.id,
    icon: item.icon,
  })),
  ...TIMELINE.map((t) => ({
    label: `${t.year} — ${t.title}`,
    category: "Legislative Timeline",
    pageId: "timeline",
    icon: Clock,
  })),
  ...GAP_RECOMMENDATIONS.map((g) => ({
    label: `${g.gap} — ${g.title}`,
    category: "Gap → Reform Explorer",
    pageId: "recommendations",
    icon: Target,
  })),
  ...RISK_ITEMS.map((r) => ({
    label: r.name,
    category: "Risk Matrix",
    pageId: "risk-matrix",
    icon: AlertTriangle,
  })),
  ...COMPARISON_ROWS.map((row) => ({
    label: row.dim,
    category: "Comparative Analysis",
    pageId: "comparative",
    icon: GitCompare,
  })),
];

/* ============================================================================
   SIDEBAR
============================================================================ */
function Sidebar({ active, setActive, open, setOpen }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cls(
          "fixed lg:sticky top-0 h-screen z-50 w-72 shrink-0 flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        style={{
          background: c.panelSolid,
          borderRight: `1px solid ${c.border}`,
        }}
      >
        <div
          className="flex items-center gap-3 px-5 h-16 shrink-0"
          style={{ borderBottom: `1px solid ${c.border}` }}
        >
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3B82F6, #22D3EE)" }}
          >
            <Shield size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <div
              className="text-[13px] font-bold tracking-tight truncate"
              style={{
                color: c.text,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              EU Cybersecurity Act 2.0
            </div>
            <div
              className="text-[10px] tracking-wide"
              style={{
                color: c.textFaint,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              POLICY RESEARCH PLATFORM
            </div>
          </div>
          <button className="lg:hidden ml-auto" onClick={() => setOpen(false)}>
            <X size={18} style={{ color: c.textMuted }} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV.map((group) => (
            <div key={group.group}>
              <div
                className="px-3 mb-2 text-[10px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: c.textFaint }}
              >
                {group.group}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActive(item.id);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 relative group"
                      style={{
                        color: isActive ? "#fff" : c.textMuted,
                        background: isActive
                          ? "linear-gradient(90deg, rgba(59,130,246,0.9), rgba(34,211,238,0.55))"
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background =
                            theme === "dark"
                              ? "rgba(148,163,184,0.06)"
                              : "rgba(15,23,42,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div
          className="p-4 shrink-0"
          style={{ borderTop: `1px solid ${c.border}` }}
        >
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Radio
              size={13}
              className="animate-pulse"
              style={{ color: ACCENT.emerald }}
            />
            <span
              className="text-[11px] font-medium"
              style={{
                color: c.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              LIVE · Research Session Active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ============================================================================
   TOPBAR
============================================================================ */
function Topbar({ setOpen, active, setActive }) {
  const { theme, toggle } = useContext(ThemeContext);
  const c = T[theme];
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const currentLabel =
    NAV_FLAT.find((n) => n.id === active)?.label || "Dashboard";

  const results =
    query.trim().length > 0
      ? SEARCH_INDEX.filter((r) =>
          r.label.toLowerCase().includes(query.trim().toLowerCase()),
        ).slice(0, 8)
      : [];

  const goTo = (pageId) => {
    setActive(pageId);
    setQuery("");
    setSearchFocused(false);
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 lg:px-8 backdrop-blur-xl"
      style={{
        background:
          theme === "dark" ? "rgba(5,8,16,0.75)" : "rgba(243,245,249,0.75)",
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      <button className="lg:hidden" onClick={() => setOpen(true)}>
        <Menu size={20} style={{ color: c.text }} />
      </button>

      <div
        className="hidden md:flex items-center gap-2 text-[13px]"
        style={{ color: c.textFaint }}
      >
        <span>Platform</span>
        <ChevronRight size={13} />
        <span style={{ color: c.text }} className="font-medium">
          {currentLabel}
        </span>
      </div>

      <div className="flex-1 max-w-md ml-auto relative hidden sm:block">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          style={{ color: c.textFaint }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
          placeholder="Search pages, gaps, risks, timeline, comparisons..."
          className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none transition-all focus:ring-2"
          style={{
            background:
              theme === "dark"
                ? "rgba(148,163,184,0.06)"
                : "rgba(15,23,42,0.04)",
            border: `1px solid ${c.border}`,
            color: c.text,
          }}
        />
        {searchFocused && query.trim().length > 0 && (
          <div
            className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
            style={{
              background: c.panelSolid,
              border: `1px solid ${c.borderStrong}`,
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)",
            }}
          >
            {results.length === 0 ? (
              <div
                className="px-4 py-3 text-[12.5px]"
                style={{ color: c.textFaint }}
              >
                No results for "{query}"
              </div>
            ) : (
              results.map((r, i) => {
                const Icon = r.icon;
                return (
                  <button
                    key={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      goTo(r.pageId);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{
                      borderBottom:
                        i < results.length - 1
                          ? `1px solid ${c.border}`
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        theme === "dark"
                          ? "rgba(148,163,184,0.06)"
                          : "rgba(15,23,42,0.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Icon
                      size={14}
                      style={{ color: ACCENT.cyan }}
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <div
                        className="text-[12.5px] truncate"
                        style={{ color: c.text }}
                      >
                        {r.label}
                      </div>
                      <div
                        className="text-[10px] tracking-wide"
                        style={{
                          color: c.textFaint,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {r.category.toUpperCase()}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggle}
          className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            color: c.textMuted,
            background:
              theme === "dark"
                ? "rgba(148,163,184,0.06)"
                : "rgba(15,23,42,0.04)",
          }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="h-9 w-9 rounded-lg flex items-center justify-center relative transition-colors"
            style={{
              color: c.textMuted,
              background:
                theme === "dark"
                  ? "rgba(148,163,184,0.06)"
                  : "rgba(15,23,42,0.04)",
            }}
          >
            <Bell size={16} />
            <span
              className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT.rose }}
            />
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
              style={{
                background: c.panelSolid,
                border: `1px solid ${c.borderStrong}`,
                boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="px-4 py-3 text-[12px] font-semibold"
                style={{ borderBottom: `1px solid ${c.border}`, color: c.text }}
              >
                Alerts & Research Notifications
              </div>
              {RECENT_UPDATES.slice(0, 4).map((u, i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex gap-3"
                  style={{
                    borderBottom: i < 3 ? `1px solid ${c.border}` : "none",
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: u.color }}
                  />
                  <div className="min-w-0">
                    <div
                      className="text-[12.5px] leading-snug"
                      style={{ color: c.text }}
                    >
                      {u.title}
                    </div>
                    <div
                      className="text-[10.5px] mt-1"
                      style={{
                        color: c.textFaint,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {u.tag} · {u.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============================================================================
   DASHBOARD
============================================================================ */
function KPICard({ kpi }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const val = useCountUp(kpi.value, 1200, kpi.decimals || 0);
  const up = kpi.invert ? kpi.trend < 0 : kpi.trend > 0;
  const barPct = Math.min(100, (kpi.value / (kpi.max || 100)) * 100);
  return (
    <Panel className="p-5" hover>
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{ background: `${kpi.color}18` }}
        >
          <kpi.icon size={17} style={{ color: kpi.color }} />
        </div>
        <span
          className="flex items-center gap-0.5 text-[11px] font-semibold"
          style={{
            color: up ? ACCENT.emerald : ACCENT.rose,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {kpi.trend > 0 ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {Math.abs(kpi.trend)}%
        </span>
      </div>
      <div
        className="text-3xl font-bold tabular-nums"
        style={{ color: c.text, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {val}
        <span className="text-lg" style={{ color: c.textFaint }}>
          {kpi.suffix ?? "%"}
        </span>
      </div>
      <div className="text-[12.5px] mt-1" style={{ color: c.textMuted }}>
        {kpi.label}
      </div>
      <div className="mt-3">
        <ProgressBar value={barPct} color={kpi.color} height={5} />
      </div>
    </Panel>
  );
}

function DashboardPage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <div>
      <div
        className="relative mb-8 rounded-2xl overflow-hidden p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(167,139,250,0.08) 60%, transparent)",
          border: `1px solid ${c.border}`,
        }}
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <Eyebrow>Research Command Center</Eyebrow>
        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight mb-2 relative"
          style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          EU Cybersecurity Act 2.0 — Interactive Policy Analysis &amp;
          Regulatory Comparison Platform
        </h1>
        <p
          className="text-[15px] max-w-3xl relative"
          style={{ color: c.textMuted }}
        >
          A research platform for evaluating the anticipated Cybersecurity Act
          2.0 against the EU's existing regulatory architecture — NIS2, GDPR,
          DORA and the Cyber Resilience Act — and against comparable
          international frameworks including Australia's SOCI Act, NIST CSF and
          ISO/IEC 27001.
        </p>
        <div className="flex flex-wrap gap-2 mt-5 relative">
          <Badge color={ACCENT.emerald}>DATASET UPDATED · JUL 2026</Badge>
          <Badge color={ACCENT.cyan}>6 FRAMEWORKS TRACKED</Badge>
          <Badge color={ACCENT.violet}>10 CRITICAL RISKS MAPPED</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {KPIS.map((k) => (
          <KPICard key={k.label} kpi={k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Panel className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div>
              <Eyebrow color={ACCENT.blue}>
                CCCEU / KPMG Assessment · 6 May 2026
              </Eyebrow>
              <h3
                className="text-lg font-semibold"
                style={{
                  color: c.text,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                €367.8bn Five-Year Cost Breakdown
              </h3>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COST_BREAKDOWN} margin={{ left: -10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={c.border}
                  vertical={false}
                />
                <XAxis
                  dataKey="category"
                  tick={{ fill: c.textFaint, fontSize: 10.5 }}
                  axisLine={{ stroke: c.border }}
                  tickLine={false}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fill: c.textFaint, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit="bn"
                />
                <Tooltip
                  contentStyle={{
                    background: c.panelSolid,
                    border: `1px solid ${c.borderStrong}`,
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`€${v}bn`, "Estimated Cost"]}
                />
                <Bar dataKey="costBn" radius={[6, 6, 0, 0]}>
                  {COST_BREAKDOWN.map((b, i) => (
                    <Cell
                      key={i}
                      fill={
                        [ACCENT.rose, ACCENT.amber, ACCENT.violet, ACCENT.cyan][
                          i
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-6">
          <Eyebrow color={ACCENT.rose}>Sector Impact</Eyebrow>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Loss Share by Sector
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COST_BY_SECTOR}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {COST_BY_SECTOR.map((e, i) => (
                    <Cell key={i} fill={e.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: c.panelSolid,
                    border: `1px solid ${c.borderStrong}`,
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`€${v}bn`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {COST_BY_SECTOR.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between text-[11.5px]"
              >
                <span
                  className="flex items-center gap-2"
                  style={{ color: c.textMuted }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: t.color }}
                  />
                  {t.name}
                </span>
                <span
                  style={{
                    color: c.text,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  €{t.value}bn
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="p-6 lg:col-span-2">
          <Eyebrow color={ACCENT.amber}>Research Feed</Eyebrow>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Legislative &amp; Research Timeline Events
          </h3>
          <div className="space-y-3">
            {RECENT_UPDATES.map((u, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background:
                    theme === "dark"
                      ? "rgba(148,163,184,0.03)"
                      : "rgba(15,23,42,0.02)",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                  style={{
                    background: u.color,
                    boxShadow: `0 0 6px ${u.color}`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[13px] leading-snug"
                    style={{ color: c.text }}
                  >
                    {u.title}
                  </div>
                  <div
                    className="text-[10.5px] mt-1 tracking-wide"
                    style={{
                      color: c.textFaint,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {u.tag} · {u.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <Eyebrow color={ACCENT.emerald}>Radar Snapshot</Eyebrow>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            CSA2 vs. GDPR Radar
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_COMPARISON} outerRadius="75%">
                <PolarGrid stroke={c.border} />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: c.textFaint, fontSize: 9 }}
                />
                <PolarRadiusAxis
                  tick={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Radar
                  dataKey="CSA2"
                  stroke={ACCENT.cyan}
                  fill={ACCENT.cyan}
                  fillOpacity={0.28}
                  strokeWidth={2}
                />
                <Radar
                  dataKey="GDPR"
                  stroke={ACCENT.violet}
                  fill={ACCENT.violet}
                  fillOpacity={0.12}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ============================================================================
   EXECUTIVE SUMMARY
============================================================================ */
function StatCounter({ value, suffix, label, color }) {
  const v = useCountUp(value, 1400);
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <div className="text-center px-4">
      <div
        className="text-4xl font-bold tabular-nums"
        style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {v}
        {suffix}
      </div>
      <div className="text-[12px] mt-1" style={{ color: c.textMuted }}>
        {label}
      </div>
    </div>
  );
}

function Callout({ children, tone = "info" }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const colors = {
    info: ACCENT.blue,
    warn: ACCENT.amber,
    danger: ACCENT.rose,
    good: ACCENT.emerald,
  };
  const color = colors[tone];
  const Icon =
    tone === "warn"
      ? AlertTriangle
      : tone === "danger"
        ? ShieldAlert
        : tone === "good"
          ? CheckCircle2
          : Info;
  return (
    <div
      className="flex gap-3 p-4 rounded-xl my-5"
      style={{ background: `${color}0F`, border: `1px solid ${color}35` }}
    >
      <Icon size={18} className="shrink-0 mt-0.5" style={{ color }} />
      <p className="text-[13.5px] leading-relaxed" style={{ color: c.text }}>
        {children}
      </p>
    </div>
  );
}

function ExecSummaryPage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <div>
      <PageHeader
        eyebrow="Research Overview"
        title="Executive Summary"
        icon={FileText}
        subtitle="A critical gap analysis of the proposed EU Cybersecurity Act 2.0 — COM(2026) 11 final — benchmarked against Australia's SOCI Act, GDPR, and international cybersecurity standards."
      />

      <Panel className="p-6 mb-6">
        <div
          className="grid grid-cols-2 md:grid-cols-4 divide-x"
          style={{ borderColor: c.border }}
        >
          <StatCounter
            value={5}
            suffix=""
            label="Critical Gaps Identified"
            color={ACCENT.rose}
          />
          <StatCounter
            value={18}
            suffix=""
            label="Sectors In Scope, No Threshold"
            color={ACCENT.cyan}
          />
          <StatCounter
            value={367.8}
            suffix="bn"
            label="Est. 5-Year Cost (€)"
            color={ACCENT.amber}
          />
          <StatCounter
            value={7}
            suffix="%"
            label="Max Harmonised Penalty"
            color={ACCENT.violet}
          />
        </div>
      </Panel>

      <Panel className="p-8 mb-6">
        <article className="prose-none max-w-none">
          <h2
            className="text-xl font-bold mb-3"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Purpose of This Research
          </h2>
          <p
            className="text-[14.5px] leading-[1.8] mb-4"
            style={{ color: c.textMuted }}
          >
            This platform accompanies a critical gap analysis of the proposed EU
            Cybersecurity Act 2.0 (CSA2) — a legislative proposal published by
            the European Commission on 20 January 2026 (COM(2026) 11 final,
            procedure 2026/0011/COD) that seeks to repeal and replace Regulation
            (EU) 2019/881. While CSA2's stated objectives of strengthening
            cybersecurity governance and addressing ICT supply-chain risk are
            legitimate, this analysis identifies significant structural
            weaknesses that undermine its effectiveness, proportionality, and
            constitutional legitimacy.
          </p>
          <p
            className="text-[14.5px] leading-[1.8] mb-4"
            style={{ color: c.textMuted }}
          >
            CSA2 represents a fundamental departure from traditional
            cybersecurity regulation: it introduces a mechanism to designate
            "high-risk" third countries and suppliers based on{" "}
            <em>geopolitical</em> criteria rather than verifiable technical
            vulnerabilities. This research argues that this approach inverts
            good security practice, prioritising political geography over
            evidence-based risk assessment.
          </p>

          <Callout tone="danger">
            The central thesis of this research: CSA2's Title IV supply-chain
            regime substitutes a subjective, political "non-technical risk"
            designation for the objective, verifiable technical risk assessment
            used by GDPR, the CRA, NIST CSF, ISO/IEC 27001, and Australia's SOCI
            Act alike.
          </Callout>

          <h2
            className="text-xl font-bold mb-3 mt-8"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Five Critical Gaps
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              {
                t: "Gap 1 — Geopolitical designation replaces technical risk assessment",
                d: 'The Title IV "non-technical risk" mechanism assesses a supplier country\'s legal system, governance, and political environment rather than documented vulnerabilities — a highly subjective and political test, per legal commentators including Michel Petite (Clifford Chance).',
                tone: "danger",
              },
              {
                t: "Gap 2 — Strained legal basis under Article 114 TFEU",
                d: "The supply-chain regime is, in substance, a national-security and foreign-policy measure. National security remains a Member State competence under Article 4(2) TEU, raising serious questions about whether Title IV can survive scrutiny under conferral, subsidiarity, and proportionality.",
                tone: "danger",
              },
              {
                t: "Gap 3 — Disproportionate economic burden",
                d: "A joint CCCEU/KPMG assessment estimates mandatory exclusion measures could cost the EU €367.8 billion over five years — Germany alone facing €170.8bn, with energy and telecom bearing nearly 40% of total losses.",
                tone: "warn",
              },
              {
                t: "Gap 4 — Conflict with GDPR data-protection frameworks",
                d: "CSA2's data-transfer and remote-processing restrictions would apply to all data categories processed within \"key ICT assets,\" not just personal data, risking conflict with GDPR's adequacy mechanisms — a tension the EDPB/EDPS jointly flagged on 9 April 2026.",
                tone: "warn",
              },
              {
                t: "Gap 5 — Practical implementation challenges",
                d: 'CSA2 covers all companies across 18 sectors with no employee, turnover, or balance-sheet threshold — a compliance burden that will disproportionately affect SMEs, compounded by ambiguous definitions such as "key ICT asset."',
                tone: "warn",
              },
              {
                t: "A genuine strength: unified EU-level coordination",
                d: "The reformed ENISA mandate and European Cybersecurity Certification Framework do address real fragmentation in the EU's current certification landscape — the Commission's underlying diagnosis is sound, even where its remedy is not.",
                tone: "good",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-xl"
                style={{
                  border: `1px solid ${c.border}`,
                  background:
                    theme === "dark"
                      ? "rgba(148,163,184,0.03)"
                      : "rgba(15,23,42,0.02)",
                }}
              >
                <div
                  className="text-[13.5px] font-semibold mb-1.5"
                  style={{ color: c.text }}
                >
                  {f.t}
                </div>
                <div
                  className="text-[12.5px] leading-relaxed"
                  style={{ color: c.textMuted }}
                >
                  {f.d}
                </div>
              </div>
            ))}
          </div>

          <h2
            className="text-xl font-bold mb-3 mt-8"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Strategic Recommendations
          </h2>
          <p
            className="text-[14.5px] leading-[1.8] mb-4"
            style={{ color: c.textMuted }}
          >
            Six reforms are proposed: (1) anchor the regime in objective,
            verifiable technical criteria in place of geopolitical designation;
            (2) introduce proportionality mechanisms and a phased, size-tiered
            implementation timeline for SMEs; (3) clarify the legal basis to
            reflect the instrument's true national-security character; (4)
            ensure GDPR compatibility through explicit harmonisation provisions;
            (5) establish clear implementation guidance with meaningful
            stakeholder consultation; and (6) future-proof the regulation
            against AI and post-quantum computing risks — both conspicuously
            absent from the current text.
          </p>
        </article>
      </Panel>
    </div>
  );
}

/* ============================================================================
   LEGISLATIVE TIMELINE
============================================================================ */
function TimelinePage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const [expanded, setExpanded] = useState(0);
  const statusColor = (s) =>
    s === "In Force" || s.startsWith("In Force")
      ? ACCENT.emerald
      : s === "Proposed"
        ? ACCENT.amber
        : s === "Future"
          ? ACCENT.violet
          : ACCENT.blue;

  return (
    <div>
      <PageHeader
        eyebrow="Research Overview"
        title="Legislative Timeline"
        icon={Clock}
        subtitle="An interactive chronology of the instruments that make up the EU's cybersecurity and data protection architecture. Select a milestone to expand its legal detail."
      />
      <div className="relative pl-8">
        <div
          className="absolute left-[11px] top-2 bottom-2 w-px"
          style={{ background: c.borderStrong }}
        />
        <div className="space-y-4">
          {TIMELINE.map((item, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i} className="relative">
                <div
                  className="absolute -left-8 top-5 h-[22px] w-[22px] rounded-full flex items-center justify-center"
                  style={{
                    background: c.panelSolid,
                    border: `2px solid ${statusColor(item.status)}`,
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: statusColor(item.status) }}
                  />
                </div>
                <Panel className="overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? -1 : i)}
                    className="w-full text-left p-5 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className="text-[11px] font-bold tracking-wider"
                          style={{
                            color: ACCENT.cyan,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {item.year}
                        </span>
                        <Badge color={statusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <h3
                        className="text-[15.5px] font-semibold"
                        style={{
                          color: c.text,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[13px] mt-1"
                        style={{ color: c.textMuted }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <ChevronDown
                      size={18}
                      className="shrink-0 transition-transform duration-300"
                      style={{
                        color: c.textFaint,
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <div
                        className="pt-4"
                        style={{ borderTop: `1px solid ${c.border}` }}
                      >
                        <p
                          className="text-[13.5px] leading-[1.8] mb-4"
                          style={{ color: c.textMuted }}
                        >
                          {item.detail}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.refs.map((r, ri) => (
                            <span
                              key={ri}
                              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg"
                              style={{
                                color: c.textMuted,
                                background:
                                  theme === "dark"
                                    ? "rgba(148,163,184,0.06)"
                                    : "rgba(15,23,42,0.04)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              <BookOpen size={11} /> {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Panel>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   COMPARATIVE ANALYSIS
============================================================================ */
function ComparativePage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const frameworks = ["CSA2", "GDPR", "NIS2", "CRA", "SOCI"];
  const fColors = {
    CSA2: ACCENT.cyan,
    GDPR: ACCENT.violet,
    NIS2: ACCENT.blue,
    CRA: ACCENT.amber,
    SOCI: ACCENT.emerald,
  };
  const [visible, setVisible] = useState({
    CSA2: true,
    GDPR: true,
    NIS2: true,
    CRA: false,
    SOCI: false,
  });

  return (
    <div>
      <PageHeader
        eyebrow="Research Overview"
        title="Comparative Analysis"
        icon={GitCompare}
        subtitle="Side-by-side evaluation of CSA 2.0 against GDPR, NIS2, the Cyber Resilience Act, and Australia's SOCI Act across scope, penalties, and governance dimensions."
      />

      <Panel className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <Eyebrow color={ACCENT.cyan}>Radar Comparison</Eyebrow>
            <h3
              className="text-lg font-semibold"
              style={{
                color: c.text,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Framework Strength Radar
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((f) => (
              <button
                key={f}
                onClick={() => setVisible((v) => ({ ...v, [f]: !v[f] }))}
                className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all"
                style={{
                  color: visible[f] ? "#fff" : fColors[f],
                  background: visible[f] ? fColors[f] : `${fColors[f]}15`,
                  border: `1px solid ${fColors[f]}50`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_COMPARISON} outerRadius="75%">
              <PolarGrid stroke={c.border} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: c.textMuted, fontSize: 11.5 }}
              />
              <PolarRadiusAxis
                tick={{ fill: c.textFaint, fontSize: 9 }}
                domain={[0, 100]}
                axisLine={false}
              />
              {frameworks
                .filter((f) => visible[f])
                .map((f) => (
                  <Radar
                    key={f}
                    dataKey={f}
                    stroke={fColors[f]}
                    fill={fColors[f]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
              <Legend wrapperStyle={{ fontSize: 11.5 }} />
              <Tooltip
                contentStyle={{
                  background: c.panelSolid,
                  border: `1px solid ${c.borderStrong}`,
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel className="p-6 mb-6">
        <Eyebrow color={ACCENT.blue}>Scored Dimensions</Eyebrow>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Comparative Score Bars
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RADAR_COMPARISON} margin={{ left: -10 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={c.border}
                vertical={false}
              />
              <XAxis
                dataKey="metric"
                tick={{ fill: c.textFaint, fontSize: 10 }}
                axisLine={{ stroke: c.border }}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: c.textFaint, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: c.panelSolid,
                  border: `1px solid ${c.borderStrong}`,
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11.5 }} />
              {frameworks
                .filter((f) => visible[f])
                .map((f) => (
                  <Bar
                    key={f}
                    dataKey={f}
                    fill={fColors[f]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel className="overflow-x-auto mb-6">
        <div className="p-6 pb-0">
          <Eyebrow color={ACCENT.violet}>Structured Comparison</Eyebrow>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Dimension-by-Dimension Table
          </h3>
        </div>
        <table className="w-full text-[12.5px] min-w-[900px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              <th
                className="text-left px-6 py-3 font-semibold"
                style={{ color: c.textFaint }}
              >
                Dimension
              </th>
              {frameworks.map((f) => (
                <th
                  key={f}
                  className="text-left px-4 py-3 font-semibold"
                  style={{ color: fColors[f] }}
                >
                  {f === "CSA2" ? "CSA 2.0" : f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom:
                    i < COMPARISON_ROWS.length - 1
                      ? `1px solid ${c.border}`
                      : "none",
                }}
              >
                <td
                  className="px-6 py-3.5 font-medium"
                  style={{ color: c.text }}
                >
                  {row.dim}
                </td>
                {frameworks.map((f) => (
                  <td
                    key={f}
                    className="px-4 py-3.5"
                    style={{ color: c.textMuted }}
                  >
                    {row[f]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <PenaltyCalculator fColors={fColors} />
    </div>
  );
}

function PenaltyCalculator({ fColors }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const [tier, setTier] = useState("serious");
  const [turnover, setTurnover] = useState("150");
  const tierObj = PENALTY_TIERS.find((t) => t.value === tier);
  const turnoverObj = TURNOVER_BANDS.find((t) => t.value === turnover);
  const turnoverM = Number(turnover);

  const results = Object.entries(FRAMEWORK_PENALTY_PCT)
    .map(([fw, pct]) => ({
      fw,
      pct,
      exposure: Math.round(turnoverM * (pct / 100) * 10) / 10,
    }))
    .sort((a, b) => b.exposure - a.exposure);
  const maxExposure = Math.max(...results.map((r) => r.exposure), 1);

  return (
    <Panel className="p-6">
      <Eyebrow color={ACCENT.amber}>Interactive Tool · Section 2.4</Eyebrow>
      <h3
        className="text-lg font-semibold mb-1"
        style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Penalty Exposure Calculator
      </h3>
      <p className="text-[12.5px] mb-4" style={{ color: c.textMuted }}>
        Select a violation tier and an annual turnover band to compare maximum
        financial exposure across CSA2's harmonised penalty structure and the
        comparator frameworks.
      </p>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <SelectField
          label="CSA2 Violation Tier (Section 2.4)"
          value={tier}
          onChange={setTier}
          options={PENALTY_TIERS.map((t) => ({
            value: t.value,
            label: `${t.label} — up to ${t.pct}%`,
          }))}
        />
        <SelectField
          label="Annual Worldwide Turnover"
          value={turnover}
          onChange={setTurnover}
          options={TURNOVER_BANDS}
        />
      </div>
      <div
        className="p-3 rounded-lg mb-5 text-[12.5px]"
        style={{
          background:
            theme === "dark" ? "rgba(148,163,184,0.03)" : "rgba(15,23,42,0.02)",
          color: c.textMuted,
        }}
      >
        {tierObj.note}
      </div>
      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.fw}>
            <div className="flex justify-between text-[12.5px] mb-1.5">
              <span style={{ color: c.text }}>
                {r.fw === "CSA2" ? "CSA 2.0" : r.fw}{" "}
                {r.fw === "CSA2" && (
                  <span style={{ color: c.textFaint }}>
                    ({tierObj.label}, {tierObj.pct}%)
                  </span>
                )}
              </span>
              <span
                style={{
                  color: fColors[r.fw],
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                €{r.exposure}M
              </span>
            </div>
            <ProgressBar
              value={(r.exposure / maxExposure) * 100}
              color={fColors[r.fw]}
            />
          </div>
        ))}
      </div>
      <p className="text-[11.5px] mt-4" style={{ color: c.textFaint }}>
        For {turnoverObj.label.toLowerCase()}, a "{tierObj.label.toLowerCase()}"
        under CSA2's proposed tiered structure carries up to €
        {results.find((r) => r.fw === "CSA2").exposure}M in exposure —{" "}
        {results.find((r) => r.fw === "CSA2").exposure >=
        results.find((r) => r.fw === "GDPR").exposure
          ? "higher than"
          : "lower than"}{" "}
        the equivalent GDPR maximum.
      </p>
    </Panel>
  );
}

/* ============================================================================
   GAP → REFORM EXPLORER
============================================================================ */
function RecommendationsPage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const [gapIdx, setGapIdx] = useState(0);
  const [techDomain, setTechDomain] = useState("Artificial Intelligence");
  const active = GAP_RECOMMENDATIONS[gapIdx];

  return (
    <div>
      <PageHeader
        eyebrow="Research Overview"
        title="Gap → Reform Explorer"
        icon={Target}
        subtitle="Select any of the report's five critical gaps to see the exact recommendation, justification, and implementation steps proposed to fix it (Section 5)."
      />

      <Panel className="p-6 mb-6">
        <Eyebrow color={ACCENT.rose}>Step 1 — Select a Critical Gap</Eyebrow>
        <SelectField
          value={gapIdx}
          onChange={(v) => setGapIdx(Number(v))}
          options={GAP_RECOMMENDATIONS.map((g, i) => ({
            value: i,
            label: `${g.gap} — ${g.title}`,
          }))}
        />
      </Panel>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Panel className="p-6" style={{ borderColor: `${ACCENT.rose}35` }}>
          <Badge color={ACCENT.rose}>{active.gap} — THE PROBLEM</Badge>
          <h3
            className="text-lg font-semibold mt-3 mb-2"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {active.title}
          </h3>
          <p
            className="text-[13.5px] leading-relaxed"
            style={{ color: c.textMuted }}
          >
            {active.problem}
          </p>
        </Panel>
        <Panel className="p-6" style={{ borderColor: `${ACCENT.emerald}35` }}>
          <Badge color={ACCENT.emerald}>THE REFORM</Badge>
          <h3
            className="text-lg font-semibold mt-3 mb-2"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {active.recTitle}
          </h3>
          <p
            className="text-[13.5px] leading-relaxed"
            style={{ color: c.textMuted }}
          >
            {active.justification}
          </p>
        </Panel>
      </div>

      <Panel className="p-6 mb-6">
        <Eyebrow color={ACCENT.blue}>Implementation Steps</Eyebrow>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          What the Co-Legislators Could Amend
        </h3>
        <div className="space-y-2">
          {active.steps.map((s, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(148,163,184,0.03)"
                    : "rgba(15,23,42,0.02)",
              }}
            >
              <CheckCircle2
                size={15}
                className="shrink-0 mt-0.5"
                style={{ color: ACCENT.blue }}
              />
              <span className="text-[13px]" style={{ color: c.textMuted }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-6">
        <Eyebrow color={ACCENT.violet}>
          Recommendation 6 — Future-Proofing
        </Eyebrow>
        <h3
          className="text-lg font-semibold mb-1"
          style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Emerging Technology Provisions
        </h3>
        <p className="text-[12.5px] mb-4" style={{ color: c.textMuted }}>
          Neither AI, quantum computing, nor decentralised systems are addressed
          in the current CSA2 text. Select a domain to see the report's proposed
          provisions.
        </p>
        <SelectField
          value={techDomain}
          onChange={setTechDomain}
          options={Object.keys(FUTURE_PROOFING).map((k) => ({
            value: k,
            label: k,
          }))}
        />
        <div className="space-y-2 mt-4">
          {FUTURE_PROOFING[techDomain].map((s, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(148,163,184,0.03)"
                    : "rgba(15,23,42,0.02)",
              }}
            >
              <Zap
                size={15}
                className="shrink-0 mt-0.5"
                style={{ color: ACCENT.violet }}
              />
              <span className="text-[13px]" style={{ color: c.textMuted }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================================
   RISK MATRIX
============================================================================ */
function RiskMatrixPage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const [hover, setHover] = useState(null);
  const grid = useMemo(() => {
    const g = Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => []),
    );
    RISK_ITEMS.forEach((item) => g[item.i][item.l].push(item.name));
    return g;
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Critical Analysis"
        title="Risk Matrix"
        icon={AlertTriangle}
        subtitle="A likelihood-versus-impact heatmap plotting the report's five critical gaps and their downstream risks, from geopolitical designation to the €367.8bn economic-burden estimate."
      />

      <Panel className="p-6 mb-6">
        <div className="flex gap-2 mb-2">
          <div className="w-28 shrink-0" />
          <div className="flex-1 grid grid-cols-5 gap-2">
            {RISK_LIKELIHOOD.map((l) => (
              <div
                key={l}
                className="text-center text-[10.5px] font-semibold"
                style={{ color: c.textFaint }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>
        {[4, 3, 2, 1, 0].map((iRow) => (
          <div key={iRow} className="flex gap-2 mb-2 items-stretch">
            <div
              className="w-28 shrink-0 flex items-center justify-end pr-2 text-[11px] font-semibold text-right"
              style={{ color: c.textFaint }}
            >
              {RISK_IMPACT[iRow]}
            </div>
            <div className="flex-1 grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((lCol) => {
                const items = grid[iRow][lCol];
                const key = `${iRow}-${lCol}`;
                return (
                  <div
                    key={lCol}
                    onMouseEnter={() => setHover(key)}
                    onMouseLeave={() => setHover(null)}
                    className="rounded-lg h-16 md:h-20 flex flex-col items-center justify-center px-1 text-center transition-transform duration-200 cursor-default relative"
                    style={{
                      background: cellColor(lCol, iRow),
                      transform: hover === key ? "scale(1.06)" : "scale(1)",
                      zIndex: hover === key ? 10 : 1,
                      boxShadow:
                        hover === key ? "0 8px 24px rgba(0,0,0,0.4)" : "none",
                    }}
                  >
                    {items.length > 0 && (
                      <span className="text-[10px] font-bold text-white/90">
                        {items.length} item{items.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {hover === key && items.length > 0 && (
                      <div
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 p-3 rounded-lg text-left z-20"
                        style={{
                          background: c.panelSolid,
                          border: `1px solid ${c.borderStrong}`,
                          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                        }}
                      >
                        {items.map((it, ii) => (
                          <div
                            key={ii}
                            className="text-[11px] py-0.5"
                            style={{ color: c.text }}
                          >
                            • {it}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-6 mt-6 flex-wrap">
          {[
            ["Low", "#1F5C42"],
            ["Moderate", "#7A6A1A"],
            ["High", "#8A4A1F"],
            ["Critical", "#7F1D2B"],
          ].map(([l, col]) => (
            <div
              key={l}
              className="flex items-center gap-2 text-[11.5px]"
              style={{ color: c.textMuted }}
            >
              <span className="h-3 w-3 rounded" style={{ background: col }} />
              {l}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-6">
        <Eyebrow color={ACCENT.rose}>Register</Eyebrow>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Risk Register
        </h3>
        <div className="space-y-2">
          {RISK_ITEMS.sort(
            (a, b) => (b.l + 1) * (b.i + 1) - (a.l + 1) * (a.i + 1),
          ).map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(148,163,184,0.03)"
                    : "rgba(15,23,42,0.02)",
              }}
            >
              <span className="text-[13px]" style={{ color: c.text }}>
                {item.name}
              </span>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-[10.5px]" style={{ color: c.textFaint }}>
                  L: {RISK_LIKELIHOOD[item.l]}
                </span>
                <span className="text-[10.5px]" style={{ color: c.textFaint }}>
                  I: {RISK_IMPACT[item.i]}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: cellColor(item.l, item.i) }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================================
   CSET ASSESSMENT TOOL — project-specific supply-chain simulation
   Modelled directly on Appendix A of the source report: the CISA Cybersecurity
   Evaluation Tool (CSET) demonstration for a European energy operator ("EnerCo").
============================================================================ */
const STANDARDS_OPTIONS = [
  "NIST Cybersecurity Framework",
  "NIST SP 800-53",
  "NIST SP 800-82",
  "ISO/IEC 27001",
  "NIS2 Directive Requirements",
];
const SECTOR_OPTIONS = [
  "Energy",
  "Transport",
  "Banking",
  "Financial Market Infrastructures",
  "Health",
  "Drinking Water",
  "Waste Water",
  "Digital Infrastructure",
  "ICT Service Management",
  "Public Administration",
  "Space",
  "Postal & Courier Services",
  "Waste Management",
  "Chemicals",
  "Food Production & Distribution",
  "Manufacturing",
  "Digital Providers",
  "Research",
];
const HIGH_CRITICALITY = new Set([
  "Energy",
  "Transport",
  "Banking",
  "Financial Market Infrastructures",
  "Health",
  "Drinking Water",
  "Waste Water",
  "Digital Infrastructure",
  "ICT Service Management",
  "Public Administration",
  "Space",
]);
const COMPANY_SIZES = [
  { value: "micro", label: "Micro (<10 employees)", burden: 20 },
  { value: "small", label: "Small (10–49 employees)", burden: 55 },
  { value: "medium", label: "Medium (50–249 employees)", burden: 78 },
  { value: "large", label: "Large (250+ employees)", burden: 42 },
];
const ASSET_TYPES = [
  "Network Equipment",
  "Cloud Computing Service",
  "Software Component",
  "Hardware Component",
  "Managed ICT Service",
];
const JURISDICTIONS = [
  { value: "eu", label: "EU / EEA Member State", risk: 5 },
  { value: "adequacy", label: "Adequacy-Decision Country", risk: 20 },
  { value: "allied", label: "Allied Third Country", risk: 40 },
  { value: "nonaligned", label: "Non-Aligned / Under Assessment", risk: 70 },
  { value: "designated", label: "Commission-Designated High-Risk", risk: 100 },
];
const DEFAULT_SUPPLIERS = [
  {
    id: 1,
    name: "Grid Control Software Vendor",
    assetType: "Software Component",
    jurisdiction: "eu",
  },
  {
    id: 2,
    name: "5G Network Equipment Supplier",
    assetType: "Network Equipment",
    jurisdiction: "nonaligned",
  },
  {
    id: 3,
    name: "SCADA Hardware Manufacturer",
    assetType: "Hardware Component",
    jurisdiction: "allied",
  },
  {
    id: 4,
    name: "Cloud Monitoring Platform",
    assetType: "Cloud Computing Service",
    jurisdiction: "adequacy",
  },
  {
    id: 5,
    name: "Managed Security Service Provider",
    assetType: "Managed ICT Service",
    jurisdiction: "eu",
  },
];

function SelectField({ label, value, onChange, options }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <div>
      {label && (
        <label
          className="block text-[12px] font-semibold mb-1.5"
          style={{ color: c.textMuted }}
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg text-[13px] outline-none"
        style={{
          background:
            theme === "dark" ? "rgba(148,163,184,0.06)" : "rgba(15,23,42,0.04)",
          border: `1px solid ${c.border}`,
          color: c.text,
        }}
      >
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            style={{ background: c.panelSolid }}
          >
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function difficultyStyle(score) {
  if (score >= 70)
    return { label: "Severe Implementation Difficulty", color: ACCENT.rose };
  if (score >= 50)
    return { label: "High Implementation Difficulty", color: ACCENT.amber };
  if (score >= 30)
    return { label: "Moderate Implementation Difficulty", color: ACCENT.cyan };
  return {
    label: "Manageable Implementation Difficulty",
    color: ACCENT.emerald,
  };
}

function CSETSimPage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const [standards, setStandards] = useState(
    new Set([
      "NIST Cybersecurity Framework",
      "NIST SP 800-53",
      "NIS2 Directive Requirements",
    ]),
  );
  const [sector, setSector] = useState("Energy");
  const [companySize, setCompanySize] = useState("medium");
  const [suppliers, setSuppliers] = useState(DEFAULT_SUPPLIERS);

  const toggleStandard = (s) =>
    setStandards((prev) => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  const updateSupplier = (id, field, value) =>
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );

  const analysis = useMemo(() => {
    const jMap = Object.fromEntries(JURISDICTIONS.map((j) => [j.value, j]));
    const distinctJurisdictions = new Set(suppliers.map((s) => s.jurisdiction))
      .size;
    const complexityIndex = Math.round((distinctJurisdictions / 5) * 100);
    const uncertainCount = suppliers.filter(
      (s) => s.jurisdiction === "nonaligned" || s.jurisdiction === "designated",
    ).length;
    const uncertaintyIndex = Math.round(
      (uncertainCount / suppliers.length) * 100,
    );
    const distinctAssets = new Set(suppliers.map((s) => s.assetType)).size;
    const assetAmbiguity = Math.round(
      (distinctAssets / ASSET_TYPES.length) * 100,
    );
    const sizeObj = COMPANY_SIZES.find((cs) => cs.value === companySize);
    const sectorWeight = HIGH_CRITICALITY.has(sector) ? 15 : 0;
    const smeBurden = Math.min(
      100,
      Math.round(sizeObj.burden + sectorWeight + uncertaintyIndex * 0.2),
    );
    const overall = Math.round(
      complexityIndex * 0.25 +
        uncertaintyIndex * 0.3 +
        assetAmbiguity * 0.15 +
        smeBurden * 0.3,
    );
    const avgRisk = Math.round(
      suppliers.reduce((sum, s) => sum + jMap[s.jurisdiction].risk, 0) /
        suppliers.length,
    );
    const assurance =
      HIGH_CRITICALITY.has(sector) &&
      (companySize === "medium" || companySize === "large")
        ? "High"
        : HIGH_CRITICALITY.has(sector)
          ? "Enhanced"
          : "Baseline";
    return {
      complexityIndex,
      uncertaintyIndex,
      assetAmbiguity,
      smeBurden,
      overall,
      avgRisk,
      assurance,
      distinctJurisdictions,
      uncertainCount,
      distinctAssets,
      sizeObj,
    };
  }, [suppliers, sector, companySize]);

  const diff = difficultyStyle(analysis.overall);
  const barData = [
    { name: "Supply Chain\nComplexity", value: analysis.complexityIndex },
    { name: "Geopolitical\nUncertainty", value: analysis.uncertaintyIndex },
    { name: "Asset\nAmbiguity", value: analysis.assetAmbiguity },
    { name: "SME/Sector\nBurden", value: analysis.smeBurden },
  ];

  const findings = [
    {
      n: 1,
      t: "Supply-chain mapping complexity",
      v: analysis.complexityIndex,
      d: `Suppliers in this configuration span ${analysis.distinctJurisdictions} of 5 possible jurisdiction categories. As the report's CSET demonstration found for EnerCo, a globally sourced ICT supply chain makes it "nearly impossible to ensure every component is from a low-risk supplier" — supporting the critique that CSA2's supply-chain framework imposes unrealistic operational burdens.`,
    },
    {
      n: 2,
      t: "Geopolitical classification uncertainty",
      v: analysis.uncertaintyIndex,
      d: `${analysis.uncertainCount} of 5 suppliers fall into a Non-Aligned or Commission-Designated High-Risk category. Supplier legal structures often obscure actual country of control, making this classification — in the report's words — "subjective and resource-intensive," precisely the substitution of geopolitical for technical assessment that Gap 1 identifies.`,
    },
    {
      n: 3,
      t: '"Key ICT asset" definitional ambiguity',
      v: analysis.assetAmbiguity,
      d: `This configuration touches ${analysis.distinctAssets} of 5 recognised asset categories. CSA2's definition of "key ICT assets" is broad and open to interpretation — an operator cannot confidently determine which of these assets fall in scope, precisely the compliance uncertainty Gap 5 describes.`,
    },
    {
      n: 4,
      t: "SME / sector compliance burden",
      v: analysis.smeBurden,
      d: `For a ${analysis.sizeObj.label.toLowerCase()} operator in the ${sector} sector (assurance level: ${analysis.assurance}), estimated compliance burden reaches ${analysis.smeBurden}% of a composite capacity index. Because CSA2 applies no employee, turnover, or balance-sheet threshold, this burden — per Gap 3 — could exceed annual profit margins for smaller operators.`,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Applied Assessment"
        title="CSET Assessment Tool"
        icon={ClipboardCheck}
        subtitle="An interactive reconstruction of Appendix A's CISA Cybersecurity Evaluation Tool (CSET) demonstration — configure a critical-infrastructure operator's supply chain below to reproduce the report's own findings on CSA2's practical implementation challenges."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel className="p-6 lg:col-span-1 space-y-5 h-fit">
          <Eyebrow color={ACCENT.blue}>Step 1 — Select Standards</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {STANDARDS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => toggleStandard(s)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all text-left"
                style={{
                  color: standards.has(s) ? "#fff" : ACCENT.blue,
                  background: standards.has(s)
                    ? ACCENT.blue
                    : `${ACCENT.blue}15`,
                  border: `1px solid ${ACCENT.blue}50`,
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <Eyebrow color={ACCENT.violet}>Step 2 — Operator Profile</Eyebrow>
          <SelectField
            label="Sector"
            value={sector}
            onChange={setSector}
            options={SECTOR_OPTIONS.map((s) => ({ value: s, label: s }))}
          />
          <SelectField
            label="Company Size"
            value={companySize}
            onChange={setCompanySize}
            options={COMPANY_SIZES}
          />
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{
              background:
                theme === "dark"
                  ? "rgba(148,163,184,0.03)"
                  : "rgba(15,23,42,0.02)",
            }}
          >
            <span className="text-[12px]" style={{ color: c.textMuted }}>
              Derived Assurance Level
            </span>
            <Badge
              color={
                analysis.assurance === "High"
                  ? ACCENT.rose
                  : analysis.assurance === "Enhanced"
                    ? ACCENT.amber
                    : ACCENT.emerald
              }
            >
              {analysis.assurance}
            </Badge>
          </div>

          <Eyebrow color={ACCENT.cyan}>Step 3 — Diagram Supply Chain</Eyebrow>
          <div className="space-y-3">
            {suppliers.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-lg space-y-2"
                style={{ border: `1px solid ${c.border}` }}
              >
                <input
                  value={s.name}
                  onChange={(e) => updateSupplier(s.id, "name", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md text-[12px] outline-none font-medium"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(148,163,184,0.06)"
                        : "rgba(15,23,42,0.04)",
                    border: `1px solid ${c.border}`,
                    color: c.text,
                  }}
                />
                <SelectField
                  value={s.assetType}
                  onChange={(v) => updateSupplier(s.id, "assetType", v)}
                  options={ASSET_TYPES.map((a) => ({ value: a, label: a }))}
                />
                <SelectField
                  value={s.jurisdiction}
                  onChange={(v) => updateSupplier(s.id, "jurisdiction", v)}
                  options={JURISDICTIONS}
                />
              </div>
            ))}
          </div>
        </Panel>

        <div className="lg:col-span-2 space-y-6">
          <Panel className="p-6 flex flex-col md:flex-row items-center gap-8">
            <div className="relative h-36 w-36 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={
                    theme === "dark"
                      ? "rgba(148,163,184,0.12)"
                      : "rgba(15,23,42,0.08)"
                  }
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={diff.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(analysis.overall / 100) * 264} 264`}
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: c.text,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {analysis.overall}
                </div>
                <div
                  className="text-[9px] text-center px-2"
                  style={{ color: c.textFaint }}
                >
                  DIFFICULTY SCORE
                </div>
              </div>
            </div>
            <div className="flex-1">
              <Badge color={diff.color}>{diff.label.toUpperCase()}</Badge>
              <p
                className="text-[13px] mt-3 leading-relaxed"
                style={{ color: c.textMuted }}
              >
                Composite of supply-chain mapping complexity, geopolitical
                classification uncertainty, key-ICT-asset ambiguity, and
                SME/sector compliance burden — the same four dimensions the
                report's CSET demonstration surfaced for EnerCo, a European
                energy operator, in Appendix A.5.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[...standards].map((s) => (
                  <Badge key={s} color={ACCENT.blue} subtle>
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <Eyebrow color={ACCENT.cyan}>Step 5 — Analysis Dashboard</Eyebrow>
            <h3
              className="text-lg font-semibold mb-4"
              style={{
                color: c.text,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Finding Scores
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={c.border}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: c.textFaint, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: c.textMuted, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      background: c.panelSolid,
                      border: `1px solid ${c.borderStrong}`,
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((b, i) => (
                      <Cell key={i} fill={difficultyStyle(b.value).color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel className="p-6">
            <Eyebrow color={ACCENT.amber}>Simulation Findings</Eyebrow>
            <h3
              className="text-lg font-semibold mb-4"
              style={{
                color: c.text,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Mapped to the Report's Gap Analysis
            </h3>
            <div className="space-y-3">
              {findings.map((f) => (
                <div
                  key={f.n}
                  className="p-4 rounded-lg"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(148,163,184,0.03)"
                        : "rgba(15,23,42,0.02)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[13px] font-semibold"
                      style={{ color: c.text }}
                    >
                      Finding {f.n} — {f.t}
                    </span>
                    <span
                      className="text-[12px] font-bold"
                      style={{
                        color: difficultyStyle(f.v).color,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {f.v}%
                    </span>
                  </div>
                  <ProgressBar
                    value={f.v}
                    color={difficultyStyle(f.v).color}
                    height={5}
                  />
                  <p
                    className="text-[12.5px] leading-relaxed mt-2.5"
                    style={{ color: c.textMuted }}
                  >
                    {f.d}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Callout tone="info">
            As in the source report's conclusion (A.6): this simulation
            demonstrates that implementing CSA2's supply-chain security
            requirements presents real practical challenges — supporting
            Recommendation 1 (objective technical criteria), Recommendation 2
            (phased SME implementation), and Recommendation 5 (clear
            implementation guidance).
          </Callout>

          <button
            onClick={() =>
              exportReport(
                "cset-assessment-report.html",
                "CSET Assessment Report",
                `
              <h1>CSET Assessment Report</h1>
              <div class="meta">Configured scenario, generated from the live tool</div>
              <h2>Configuration</h2>
              <table>
                <tr><th>Sector</th><td>${sector}</td></tr>
                <tr><th>Company Size</th><td>${analysis.sizeObj.label}</td></tr>
                <tr><th>Assurance Level</th><td>${analysis.assurance}</td></tr>
                <tr><th>Standards Applied</th><td>${[...standards].join(", ") || "None selected"}</td></tr>
              </table>
              <h2>Supplier Configuration</h2>
              <table>
                <tr><th>Supplier</th><th>Asset Type</th><th>Jurisdiction</th></tr>
                ${suppliers.map((s) => `<tr><td>${s.name}</td><td>${s.assetType}</td><td>${JURISDICTIONS.find((j) => j.value === s.jurisdiction).label}</td></tr>`).join("")}
              </table>
              <h2>Overall Difficulty Score: ${analysis.overall}/100 — ${diff.label}</h2>
              <h2>Findings</h2>
              ${findings.map((f) => `<h3>Finding ${f.n} — ${f.t} (${f.v}%)</h3><p>${f.d}</p>`).join("")}
            `,
              )
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white"
            style={{ background: "linear-gradient(90deg,#3B82F6,#22D3EE)" }}
          >
            <Download size={15} /> Download This Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function buildExecSummaryReport() {
  return `
    <h1>Executive Summary</h1>
    <div class="meta">Critical Gap Analysis of the EU Cybersecurity Act 2.0 (COM(2026) 11 final)</div>
    <p>This report provides a critical gap analysis of the proposed EU Cybersecurity Act 2.0 (CSA2), published by the European Commission on 20 January 2026 to repeal and replace Regulation (EU) 2019/881. CSA2 introduces a mechanism to designate "high-risk" third countries and suppliers based on geopolitical criteria rather than verifiable technical vulnerabilities.</p>
    <h2>Five Critical Gaps</h2>
    <ul>${GAP_RECOMMENDATIONS.map((g) => `<li><strong>${g.gap} — ${g.title}:</strong> ${g.problem}</li>`).join("")}</ul>
    <h2>Key Statistics</h2>
    <table><tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Estimated 5-Year Economic Cost</td><td>€367.8bn</td></tr>
      <tr><td>Sectors In Scope</td><td>18, with no employee/turnover threshold</td></tr>
      <tr><td>Max Harmonised Penalty</td><td>Up to 7% of global turnover</td></tr>
      <tr><td>Max 5G/6G Phase-Out Period</td><td>36 months</td></tr>
    </table>
    <h2>Strategic Recommendations</h2>
    <ul>${GAP_RECOMMENDATIONS.map((g) => `<li><strong>${g.recTitle}</strong></li>`).join("")}<li><strong>Recommendation 6 — Future-Proof the Regulation Against Emerging Technologies</strong></li></ul>
  `;
}

function buildTimelineReport() {
  return `
    <h1>Legislative Timeline</h1>
    <div class="meta">Chronology from GDPR through the CSA2 proposal and its 2026 regulatory reception</div>
    ${TIMELINE.map(
      (t) => `
      <h3>${t.year} — ${t.title} <span class="badge">${t.status}</span></h3>
      <p>${t.detail}</p>
      <p style="color:#94A3B8;font-size:11px;">Ref: ${t.refs.join("; ")}</p>
    `,
    ).join("")}
  `;
}

function buildComparativeReport() {
  const frameworks = ["CSA2", "GDPR", "NIS2", "CRA", "SOCI"];
  return `
    <h1>Comparative Analysis</h1>
    <div class="meta">CSA2 vs. GDPR, NIS2, the Cyber Resilience Act, and Australia's SOCI Act</div>
    <table>
      <tr><th>Dimension</th>${frameworks.map((f) => `<th>${f === "CSA2" ? "CSA 2.0" : f}</th>`).join("")}</tr>
      ${COMPARISON_ROWS.map((row) => `<tr><td><strong>${row.dim}</strong></td>${frameworks.map((f) => `<td>${row[f]}</td>`).join("")}</tr>`).join("")}
    </table>
  `;
}

function buildRiskMatrixReport() {
  const sorted = [...RISK_ITEMS].sort(
    (a, b) => (b.l + 1) * (b.i + 1) - (a.l + 1) * (a.i + 1),
  );
  return `
    <h1>Risk Matrix</h1>
    <div class="meta">The report's five critical gaps and downstream risks, ranked by likelihood × impact</div>
    <table>
      <tr><th>Risk</th><th>Likelihood</th><th>Impact</th></tr>
      ${sorted.map((r) => `<tr><td>${r.name}</td><td>${RISK_LIKELIHOOD[r.l]}</td><td>${RISK_IMPACT[r.i]}</td></tr>`).join("")}
    </table>
  `;
}

/* ============================================================================
   REPORTS
============================================================================ */
function ReportsPage({ setActive }) {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  const reports = [
    {
      title: "Executive Summary Report",
      desc: "The five critical gaps, key statistics, and six strategic recommendations, in presentation-ready form.",
      icon: FileText,
      color: ACCENT.blue,
      filename: "executive-summary-report.html",
      build: buildExecSummaryReport,
    },
    {
      title: "Legislative Timeline Report",
      desc: "Full chronology from GDPR through the CSA2 proposal and its 2026 regulatory reception, with citations.",
      icon: Clock,
      color: ACCENT.cyan,
      filename: "legislative-timeline-report.html",
      build: buildTimelineReport,
    },
    {
      title: "Comparative Analysis Report",
      desc: "Dimension-by-dimension scoring across CSA2, GDPR, NIS2, CRA, and Australia's SOCI Act.",
      icon: GitCompare,
      color: ACCENT.violet,
      filename: "comparative-analysis-report.html",
      build: buildComparativeReport,
    },
    {
      title: "Risk Matrix Report",
      desc: "Likelihood/impact heatmap of the five critical gaps and their downstream risks, export-ready for appendices.",
      icon: AlertTriangle,
      color: ACCENT.rose,
      filename: "risk-matrix-report.html",
      build: buildRiskMatrixReport,
    },
  ];
  return (
    <div>
      <PageHeader
        eyebrow="Platform"
        title="Reports"
        icon={FileBarChart}
        subtitle="Export presentation-ready reports, generated live from the platform's research data, as standalone HTML pages."
      />
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {reports.map((r, i) => {
          const Icon = r.icon;
          return (
            <Panel key={i} className="p-5 flex items-start gap-4" hover>
              <div
                className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${r.color}18` }}
              >
                <Icon size={19} style={{ color: r.color }} />
              </div>
              <div className="flex-1">
                <h3
                  className="text-[14.5px] font-semibold mb-1"
                  style={{
                    color: c.text,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {r.title}
                </h3>
                <p
                  className="text-[12.5px] leading-relaxed mb-3"
                  style={{ color: c.textMuted }}
                >
                  {r.desc}
                </p>
                <button
                  onClick={() => exportReport(r.filename, r.title, r.build())}
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold"
                  style={{ color: r.color }}
                >
                  <Download size={13} /> Export
                </button>
              </div>
            </Panel>
          );
        })}
      </div>
      <Panel className="p-5 flex items-start gap-4" hover>
        <div
          className="h-11 w-11 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${ACCENT.emerald}18` }}
        >
          <ClipboardCheck size={19} style={{ color: ACCENT.emerald }} />
        </div>
        <div className="flex-1">
          <h3
            className="text-[14.5px] font-semibold mb-1"
            style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            CSET Assessment Report
          </h3>
          <p
            className="text-[12.5px] leading-relaxed mb-3"
            style={{ color: c.textMuted }}
          >
            This one is personalised to your configuration, so it's generated on
            that page directly.
          </p>
          <button
            onClick={() => setActive("cset-sim")}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold"
            style={{ color: ACCENT.emerald }}
          >
            <ArrowUpRight size={13} /> Go to CSET Assessment Tool
          </button>
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================================
   ABOUT
============================================================================ */
function AboutPage() {
  const { theme } = useContext(ThemeContext);
  const c = T[theme];
  return (
    <div>
      <PageHeader
        eyebrow="Platform"
        title="About This Platform"
        icon={Info}
        subtitle="Context, methodology, and scope notes for this research platform."
      />
      <Panel className="p-8">
        <h2
          className="text-xl font-bold mb-3"
          style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Methodology &amp; Scope Note
        </h2>
        <p
          className="text-[14px] leading-[1.8] mb-4"
          style={{ color: c.textMuted }}
        >
          This platform accompanies a critical gap analysis of the proposed EU
          Cybersecurity Act 2.0 — COM(2026) 11 final, published by the European
          Commission on 20 January 2026. All figures on these pages (the
          €367.8bn cost estimate, sector loss shares, penalty tiers, and
          sector/threshold data) are drawn directly from the underlying report
          and its cited sources — principally the CCCEU/KPMG economic
          assessment, the EDPB–EDPS joint opinion, and contemporaneous legal
          commentary — rather than official Commission figures, since CSA2
          remains under negotiation.
        </p>
        <p
          className="text-[14px] leading-[1.8] mb-4"
          style={{ color: c.textMuted }}
        >
          The CSET Assessment Tool is a direct interactive reconstruction of the
          report's Appendix A: it lets you configure an operator's sector, size,
          and supply chain and reproduces the same four findings the report's
          own CSET demonstration surfaced for its "EnerCo" case study — rather
          than a generic, unrelated compliance quiz.
        </p>
        <Callout tone="info">
          This build is an actively developed first release. Additional research
          pages — Statutory Context, Industry Coverage, Government Agencies,
          Case Studies, and a Reference Library — are planned next.
        </Callout>
      </Panel>
    </div>
  );
}

/* ============================================================================
   APP SHELL
============================================================================ */
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const c = T[theme];

  // Wrapping setActive: after switching pages, force a resize event once the
  // new page has painted. This fixes Recharts' ResponsiveContainer sometimes
  // measuring a 0-width container on mount when navigation happens alongside
  // another layout change (e.g. the search dropdown closing), which otherwise
  // left charts blank until the page was revisited.
  const navigate = (id) => {
    setActive(id);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    });
  };

  const pages = {
    dashboard: <DashboardPage />,
    "exec-summary": <ExecSummaryPage />,
    timeline: <TimelinePage />,
    comparative: <ComparativePage />,
    recommendations: <RecommendationsPage />,
    "risk-matrix": <RiskMatrixPage />,
    "cset-sim": <CSETSimPage />,
    reports: <ReportsPage setActive={navigate} />,
    about: <AboutPage />,
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      <div
        style={{
          background: c.bg,
          minHeight: "100vh",
          color: c.text,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-thumb { background: ${theme === "dark" ? "rgba(148,163,184,0.2)" : "rgba(15,23,42,0.15)"}; border-radius: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          body { margin: 0; }
        `}</style>
        <div className="flex">
          <Sidebar
            active={active}
            setActive={navigate}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />
          <div className="flex-1 min-w-0">
            <Topbar
              setOpen={setSidebarOpen}
              active={active}
              setActive={navigate}
            />
            <main className="p-4 md:p-8 max-w-[1400px] mx-auto">
              {pages[active]}
            </main>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
