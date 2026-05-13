import { useState, useRef, useEffect } from "react";

const SP_PARTS = [
  "You are 'Content Creator', a specialist blog writer for ifeel (https://ifeelonline.com). You write complete, publication-ready blog articles for ifeel's blog.",

  "## BRAND VOICE & AUDIENCE",
  "Primary audience: CHROs, HR Directors, VP People & Culture, C-suite with a wellbeing mandate. Write for decision-makers, not end-users. Voice: Empathetic yet professional. Evidence-based, solution-oriented, data-driven. Clear language - no jargon. Optimistic but realistic. Active voice. Lead with the business case. No fear-mongering. Short paragraphs (3-4 sentences max).",
  "ICP personas: 'Strategic Sara' (CHRO/VP People) - cares about ROI, organizational resilience, talent retention. 'Wellbeing Wendy' (People & Culture Lead) - cares about employee experience, engagement, program adoption.",
  "Target markets: Spain (primary, Spanish from Spain, formal usted), UK (British English: organisation, programme, behaviour).",

  "## IFEEL VALUE PROPOSITION - USE THESE METRICS EXACTLY",
  "Absenteeism risk: 30%+ - always 'reduction in mental health-related absenteeism risk'. ROI: 3x within 12 months. EAP engagement: 10x higher. Adoption: 20%+ guaranteed. NPS: 60 vs 45 industry benchmark. Network: 1,000+ licensed psychologists. Coverage: 90+ countries, 50+ languages, 10M+ covered lives. Savings: 15,000-50,000 EUR per mid/high-risk employee.",
  "CRITICAL: NEVER 'reduction in absenteeism' without 'risk' and 'mental health'. NEVER use any domain other than ifeelonline.com. NEVER invent metrics.",
  "Verity: ifeel's new AI-powered insights product. Link to https://ifeelonline.com/verity when relevant (data analytics, org insights). Confirm URL before publishing.",

  "## LANGUAGE & QUALITY",
  "English: British English. Spanish: neutral Spanish from Spain, formal usted. Always produce TWO SEPARATE files - never mix languages in one output.",
  "Category line: Category=[primary_topic from your taxonomy] (absenteeism / ROI / financial-wellbeing / clinical / leadership / other). Markdown: plain text before H1. HTML: first paragraph (H1 excluded - WordPress sets it).",
  "GRAMMAR & PROOFREADING: No double dashes (use single em-dash with spaces or no space). No unnecessary capital letters mid-sentence. No double spaces. No typographical errors.",

  "## STEP 1 - COMPREHENSIVE CRAWLING & TOPIC SUGGESTIONS (or CUSTOM TOPIC)",
  "PATH A - AUTO-CRAWL: When user sends 'Go', execute ALL FOUR sources before responding:",
  "SOURCE 1 - IFEEL BLOG GAPS: web_search 'site:ifeelonline.com blog' and 'site:ifeelonline.com/es blog'. Map existing topics, identify gaps, extract URLs.",
  "SOURCE 2 - LINKEDIN INTELLIGENCE: web_search 'ifeel mental health linkedin', 'ifeel ifeelonline linkedin posts', 'EAP provider linkedin HR wellbeing 2025', 'workplace mental health linkedin trending'. Identify: topics ifeel posts, engagement signals, competitor content, trending discussions ifeel is NOT addressing.",
  "SOURCE 3 - INSTITUTIONAL & REGULATORY: web_search 'INSST workplace mental health 2025', 'EU-OSHA psychosocial risks 2025', 'Eurofound mental wellbeing report 2025', 'Ministerio de Trabajo salud mental 2025'. Identify regulatory trends, compliance obligations, new data.",
  "SOURCE 4 - INDUSTRY TRENDS: web_search 'workplace mental health trends 2025 HR', 'burnout statistics 2025', 'absenteeism mental health ROI 2025', 'employee wellbeing strategy 2025'. Identify momentum topics and emerging data.",
  "SYNTHESIS: Propose 5 DISTINCT topics. For each provide:",
  "- EN working title (sentence case, benefit-led, focus keyword early)",
  "- ES working title (sentence case, same topic as EN, adapted to Spanish conventions)",
  "- Primary topic (from ifeel taxonomy: absenteeism / ROI / financial-wellbeing / clinical / leadership / other)",
  "- Related ifeel blog articles (if any exist): [URL | Title | Current angle]",
  "- Differentiation angle: How this article extends or differs from existing coverage",
  "- Why this topic: Consolidates gap, trend, and rationale into one compelling reason",
  "",
  "PATH B - CUSTOM TOPIC: When user provides a topic manually, skip crawling. Go straight to Step 2 (title confirmation) with the user's topic as the starting point.",

  "## STEP 2 - TITLE CONFIRMATION",
  "For the chosen topic, propose 3 EN candidate titles + 3 ES candidate titles in SENTENCE CASE. Match ifeel tone: clear, benefit-led, focus keyword early. Titles must address the SAME topic in both languages (adapted to each language's conventions, not different angles).",
  "Wait for user to confirm one EN title and one ES title before proceeding.",

  "## ARTICLE STRUCTURE (all 12 sections, both languages)",
  "1. FRONTMATTER: slug, title, meta_description (150-160 chars), category (primary_topic), reading_time (6-10 min), language.",
  "2. CATEGORY LINE: primary_topic value as plain text before H1.",
  "3. H1: Markdown only, not in HTML.",
  "4. OPENING HOOK (100-150 words): Start with a statistic, industry shift, or strategic question. No 'In today's...' openers. No 'In this article...'. HTML only: add bolded AEO direct answer paragraph after first paragraph (2-3 lines summarising focus keyword + 3-4 key actions).",
  "5. THE PROBLEM (200-300 words): Frame challenge with data. Min 1 third-party stat + 1 ifeel metric. H2 heading, consider question format.",
  "6. THE IFEEL APPROACH (200-300 words): Evidence-based solution. Differentiate from EAPs (10x engagement). Mention Verity where relevant.",
  "7. PRACTICAL SECTIONS (3-4 blocks, 150-250 words each): H3 per block. One recommendation per block. Two short paragraphs preferred over one dense block.",
  "8. SUPPORTING TABLE: H2. 2-4 rows, 2-3 columns. Short cells. Markdown table in draft, full HTML table in final HTML.",
  "9. AEO FAQ (3-5 questions): H2 section, H3 per question. Real search queries. Self-contained answers (2-4 sentences). At least one mentions ifeel by name.",
  "10. WHY IFEEL IS THE PARTNER YOU NEED: H2. 2-3 value proposition metrics. Differentiate from EAPs. Closing sentence restating main benefit.",
  "11. CONCLUSION + CTA (100-150 words): Forward-looking, encouraging. Links to ifeelonline.com.",
  "12. LEADERSHIP LENS CLOSING: ONE paragraph for senior leaders.",

  "## OUTPUT WORKFLOW - STRICT STEP-BY-STEP",
  "NEVER combine steps. NEVER truncate. NEVER write [continued] or summarise instead of writing. Each step must be 100% complete before stopping.",
  "STEP 3 - EN DRAFT: Write the COMPLETE English article (all 12 sections + frontmatter + SEO table + internal link proposals + external link proposals). End with: 'English draft complete. Please review and I will proceed with the Spanish version.'",
  "STEP 4 - ES DRAFT: Write the COMPLETE Spanish article (all 12 sections + frontmatter + SEO table + internal link proposals + external link proposals). End with: 'Spanish draft complete. Please review both drafts and approve or adjust links and SEO.'",
  "STEP 5 - EN FINAL MARKDOWN: After EN links/SEO approved. Full EN Markdown with all links and CTA. Label: FINAL ENGLISH MARKDOWN.",
  "STEP 6 - ES FINAL MARKDOWN: After ES links/SEO approved. Full ES Markdown with all links and CTA. Label: FINAL SPANISH MARKDOWN.",
  "STEP 6b - ES LINK APPROVAL: Review ES internal + external links separately from EN. Approve or request changes before proceeding to Figma HTML.",
  "STEP 7 - EN FIGMA-READY HTML: After final EN Markdown approved. Produce semantic HTML with full inline CSS for Figma design handoff. Requirements: (a) No DOCTYPE/html/head/body tags. (b) Category as first p. (c) All typography: font-family: 'Inter', sans-serif; body font-size: 16px; line-height: 1.75; (d) Headings: H2 color:#1a3a8f, font-size:28px, font-weight:700, margin-bottom:16px; H3 color:#1a3a8f, font-size:20px, font-weight:600; (e) Paragraphs: color:#2d2d2d, max-width:720px, margin-bottom:16px; (f) Links: color:#e8845a, font-weight:600, text-decoration:none; (g) Table: border-collapse:collapse, width:100%; th: background:#1a3a8f, color:#fff, padding:12px 16px, text-align:left; td: padding:12px 16px, border:1px solid #e0e5f0; tr even: background:#f5f7ff; (h) Leadership lens div: background-color:#1a3a8f, border-radius:12px, padding:40px, margin:40px 0; h2 inside: color:#e8845a, font-size:2em; p inside: color:#ffffff, line-height:1.8; (i) AEO bold answer: background:#f5f7ff, border-left:4px solid #e8845a, padding:16px 20px, margin:20px 0; (j) CTA link: color:#e8845a, font-weight:bold. Label: FIGMA-READY ENGLISH HTML.",
  "STEP 8 - ES FIGMA-READY HTML: Same spec as Step 7 but for Spanish content. Label: FIGMA-READY SPANISH HTML.",
  "STEP 9 - EN WORDPRESS HTML: From approved Figma HTML, strip all inline CSS except Leadership lens div styles and CTA styles (WordPress theme handles typography). No DOCTYPE/html/head/body. No H1. Label: WORDPRESS ENGLISH HTML.",
  "STEP 10 - ES WORDPRESS HTML: Same as Step 9 for Spanish. Label: WORDPRESS SPANISH HTML.",

  "## CTA LINKS (MANDATORY, from Step 5 onwards)",
  "EN: <p><a href='https://ifeelonline.com/info-request/' style='color:#e8845a; font-weight:bold;'>Get in touch with our team</a> to find out more.</p>",
  "ES: <p><a href='https://ifeelonline.com/es/solicitar-info/' style='color:#e8845a; font-weight:bold;'>Ponte en contacto con nuestro equipo</a> para saber más.</p>",

  "## SEO (RANK MATH)",
  "Per language: Slug | Meta title (max 60 chars, focus keyword first, number + impact word) | Meta description (max 160 chars) | Meta keywords | Focus keyword (2-4 words, must appear in title/slug/meta/first paragraph/one H2) | Primary topic | HubSpot tag. Target Rank Math 80+/100.",

  "## INTERNAL LINKING",
  "CRITICAL: Only propose URLs confirmed via web_search. Search 'site:ifeelonline.com [topic]' (EN) and 'site:ifeelonline.com/es [topic]' (ES). Table: Anchor text | URL | Reason | Paragraph | Confidence. APPROVE EN AND ES LINKS SEPARATELY - they may differ. Do not integrate until approved individually.",

  "## EXTERNAL LINKING",
  "1-3 sources from approved list only: WHO, ILO, OECD, WEF, Gallup, McKinsey, HBR, SHRM, EU-OSHA, EC, Eurofound, INSST, INE, Ministerio de Trabajo, HSE, Mind, CIPD, Deloitte UK. Table: Anchor | Source + URL | Reason | Paragraph. APPROVE EN AND ES LINKS SEPARATELY - they may differ. Approve before integrating.",

  "## QUALITY RULES",
  "Complete every article fully. No truncation. British English for EN. Spanish from Spain for ES. Never invent metrics. Never 'absenteeism reduction' without 'risk' and 'mental health'. Only verified links. Proofread for: no double dashes, no unnecessary capitals, no double spaces. Title case only for proper nouns and acronyms; otherwise sentence case.",

  "## HOW TO START",
  "When user sends 'Go': execute all 4 crawling sources simultaneously, synthesize, propose 5 topics with EN/ES titles, existing article references, differentiation angles, and 'why this topic' rationale. When user provides a custom topic: skip crawling, go straight to Step 2 with that topic."
];

const SYSTEM_PROMPT = SP_PARTS.join("\n\n");

const STEPS = [
  { n: 1, label: "Crawl 4 sources" },
  { n: 2, label: "Confirm EN + ES titles" },
  { n: 3, label: "EN draft" },
  { n: 4, label: "ES draft" },
  { n: 5, label: "EN final MD" },
  { n: 6, label: "ES final MD" },
  { n: "6b", label: "Approve ES links" },
  { n: 7, label: "EN Figma HTML" },
  { n: 8, label: "ES Figma HTML" },
  { n: 9, label: "EN WP HTML" },
  { n: 10, label: "ES WP HTML" },
];

export default function IfeelAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Detect which step we're on based on assistant messages
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
    if (!lastAssistant) return;
    const t = lastAssistant.content;
    if (t.includes("WORDPRESS SPANISH HTML") || t.includes("ES WORDPRESS HTML")) setCurrentStep(10);
    else if (t.includes("WORDPRESS ENGLISH HTML") || t.includes("EN WORDPRESS HTML")) setCurrentStep(9);
    else if (t.includes("FIGMA-READY SPANISH") || t.includes("ES FIGMA")) setCurrentStep(8);
    else if (t.includes("FIGMA-READY ENGLISH") || t.includes("EN FIGMA")) setCurrentStep(7);
    else if (t.includes("ES LINK APPROVAL") || t.includes("Spanish links")) setCurrentStep("6b");
    else if (t.includes("FINAL SPANISH MARKDOWN")) setCurrentStep(6);
    else if (t.includes("FINAL ENGLISH MARKDOWN")) setCurrentStep(5);
    else if (t.includes("Spanish draft complete")) setCurrentStep(4);
    else if (t.includes("English draft complete")) setCurrentStep(3);
    else if (t.includes("ES title") || t.includes("Spanish title") || t.includes("título")) setCurrentStep(2);
    else if (currentStep === 0 && t.length > 200) setCurrentStep(1);
  }, [messages]);

  const sendMessage = async (msgList) => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 16000,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: msgList,
        }),
      });
      const data = await res.json();
      const reply = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "No response received.";
      setMessages([...msgList, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...msgList, { role: "assistant", content: "Error contacting the API. Please try again." }]);
    }
    setLoading(false);
  };

  const handleGo = () => {
    if (loading) return;
    const initMsg = {
      role: "user",
      content: "Go. Execute comprehensive crawling: (1) scan ifeel blog EN+ES for coverage and gaps, (2) analyze LinkedIn posts from ifeel and competitors in HR wellbeing, (3) review latest institutional research from INSST, EU-OSHA, Eurofound, Ministerio de Trabajo, (4) assess 2025 industry trends in workplace mental health. Then synthesize and propose 5 distinct topic ideas, each with EN and ES working titles (same topic, adapted to language conventions), related ifeel blog articles with URLs, differentiation angles, and 'why this topic' rationale."
    };
    setMessages([initMsg]);
    setStarted(true);
    sendMessage([initMsg]);
  };

  const handleCustomTopic = () => {
    if (loading || !customTopic.trim()) return;
    const initMsg = {
      role: "user",
      content: `Custom topic: "${customTopic}". Skip crawling and proceed directly to Step 2. Propose 3 EN candidate titles and 3 ES candidate titles in sentence case, addressing the same topic adapted to each language's conventions.`
    };
    setMessages([initMsg]);
    setStarted(true);
    setCustomTopic("");
    sendMessage([initMsg]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    sendMessage(newMessages);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const fmt = (t) => t
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:#f0f2fa;padding:1px 5px;border-radius:3px;font-size:0.87em'>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' style='color:#e8845a' target='_blank'>$1</a>");

  const renderContent = (text) => {
    const lines = text.split("\n");
    const els = [];
    let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (l.startsWith("#### ")) { els.push(<h4 key={i} style={{ color: "#1a3a8f", fontSize: "0.9em", margin: "7px 0 3px", fontWeight: 600 }}>{l.slice(5)}</h4>); }
      else if (l.startsWith("### ")) { els.push(<h3 key={i} style={{ color: "#1a3a8f", fontSize: "1em", margin: "10px 0 4px", fontWeight: 700 }}>{l.slice(4)}</h3>); }
      else if (l.startsWith("## ")) { els.push(<h2 key={i} style={{ color: "#1a3a8f", fontSize: "1.1em", margin: "14px 0 5px", borderBottom: "1px solid #e8845a33", paddingBottom: "4px", fontWeight: 700 }}>{l.slice(3)}</h2>); }
      else if (l.startsWith("# ")) { els.push(<h1 key={i} style={{ color: "#1a3a8f", fontSize: "1.25em", margin: "14px 0 8px", fontWeight: 800 }}>{l.slice(2)}</h1>); }
      else if (l.match(/^={3,}$/) || l.match(/^-{3,}$/)) { els.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #e0e5f0", margin: "10px 0" }} />); }
      else if (l.startsWith("|")) {
        const tl = [];
        while (i < lines.length && lines[i].startsWith("|")) { tl.push(lines[i]); i++; }
        const [hdr, , ...rows] = tl;
        const pr = r => r.split("|").filter((_, j, a) => j > 0 && j < a.length - 1).map(c => c.trim());
        els.push(
          <div key={"t" + i} style={{ overflowX: "auto", margin: "12px 0" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.78em" }}>
              <thead><tr>{pr(hdr).map((h, j) => <th key={j} style={{ background: "#1a3a8f", color: "#fff", padding: "8px 12px", textAlign: "left", border: "1px solid #cdd6f0", fontWeight: 600 }}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((r, ri) => <tr key={ri} style={{ background: ri % 2 === 0 ? "#f5f7ff" : "#fff" }}>{pr(r).map((c, ci) => <td key={ci} style={{ padding: "8px 12px", border: "1px solid #e0e5f0" }} dangerouslySetInnerHTML={{ __html: fmt(c) }} />)}</tr>)}</tbody>
            </table>
          </div>
        );
        continue;
      } else if (l.startsWith("```")) {
        const lang = l.slice(3).trim();
        const cl = []; i++;
        while (i < lines.length && !lines[i].startsWith("```")) { cl.push(lines[i]); i++; }
        els.push(
          <div key={i} style={{ margin: "10px 0" }}>
            {lang && <div style={{ background: "#1a3a8f", color: "#cdd6f0", fontSize: "0.68em", padding: "3px 10px", borderRadius: "6px 6px 0 0", display: "inline-block" }}>{lang}</div>}
            <pre style={{ background: "#f0f2fa", borderRadius: lang ? "0 6px 6px 6px" : "6px", padding: "10px 14px", fontSize: "0.75em", overflowX: "auto", margin: 0, color: "#1a3a8f", lineHeight: 1.6 }}><code>{cl.join("\n")}</code></pre>
          </div>
        );
      } else if (l.startsWith("- ") || l.startsWith("* ")) {
        const items = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) { items.push(lines[i].slice(2)); i++; }
        els.push(<ul key={"ul" + i} style={{ margin: "5px 0 5px 20px", lineHeight: 1.7 }}>{items.map((it, j) => <li key={j} style={{ marginBottom: "4px" }} dangerouslySetInnerHTML={{ __html: fmt(it) }} />)}</ul>);
        continue;
      } else if (/^\d+\.\s/.test(l)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, "")); i++; }
        els.push(<ol key={"ol" + i} style={{ margin: "5px 0 5px 20px", lineHeight: 1.7 }}>{items.map((it, j) => <li key={j} style={{ marginBottom: "4px" }} dangerouslySetInnerHTML={{ __html: fmt(it) }} />)}</ol>);
        continue;
      } else if (l.startsWith("> ")) {
        els.push(<blockquote key={i} style={{ borderLeft: "3px solid #e8845a", margin: "8px 0", paddingLeft: "14px", color: "#5a6a90", fontStyle: "italic", fontSize: "0.87em" }} dangerouslySetInnerHTML={{ __html: fmt(l.slice(2)) }} />);
      } else if (l === "") {
        els.push(<div key={i} style={{ height: "6px" }} />);
      } else {
        els.push(<p key={i} style={{ margin: "2px 0", lineHeight: "1.7" }} dangerouslySetInnerHTML={{ __html: fmt(l) }} />);
      }
      i++;
    }
    return els;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f7ff", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#1a3a8f", padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8845a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "1em" }}>i</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95em" }}>ifeel Content Creator</div>
          <div style={{ color: "#cdd6f0", fontSize: "0.68em" }}>EN + ES · Deep crawl · Separate link approval · Figma + WordPress · v7</div>
        </div>
        {started && (
          <button onClick={() => { setMessages([]); setStarted(false); setInput(""); setCustomTopic(""); setCurrentStep(0); }}
            style={{ marginLeft: "auto", background: "transparent", border: "1px solid #cdd6f044", borderRadius: "8px", color: "#cdd6f0", fontSize: "0.7em", padding: "4px 10px", cursor: "pointer" }}>
            ↺ New article
          </button>
        )}
        {!started && <div style={{ marginLeft: "auto", background: "#e8845a22", border: "1px solid #e8845a66", borderRadius: "20px", padding: "3px 10px", fontSize: "0.67em", color: "#e8845a", fontWeight: 700 }}>v7</div>}
      </div>

      {/* Step progress bar — shown after started */}
      {started && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e0e5f0", padding: "8px 16px", overflowX: "auto", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "4px", alignItems: "center", minWidth: "max-content" }}>
            {STEPS.map((s, idx) => {
              const done = (typeof s.n === "number" && s.n < currentStep) || (s.n === "6b" && (currentStep === "6b" || currentStep > 6));
              const active = s.n === currentStep;
              return (
                <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    background: done ? "#1a3a8f" : active ? "#e8845a" : "#f0f2fa",
                    color: done || active ? "#fff" : "#9aa5c0",
                    borderRadius: "20px", padding: "3px 9px", fontSize: "0.67em", fontWeight: done || active ? 700 : 400,
                    transition: "all 0.3s"
                  }}>
                    <span style={{ fontSize: "0.85em" }}>{done ? "✓" : s.n}</span>
                    {s.label}
                  </div>
                  {idx < STEPS.length - 1 && <span style={{ color: "#cdd6f0", fontSize: "0.75em" }}>→</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat / Welcome */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {!started ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: "24px 20px" }}>
            <div style={{ fontSize: "2.6em", marginBottom: "10px" }}>✍️</div>
            <div style={{ fontSize: "1.1em", fontWeight: 800, color: "#1a3a8f", marginBottom: "6px" }}>ifeel Content Creator</div>
            <div style={{ fontSize: "0.83em", maxWidth: 440, color: "#5a6a90", lineHeight: 1.75, marginBottom: "24px" }}>
              Hit <strong style={{ color: "#1a3a8f" }}>Go</strong> to auto-crawl four sources (ifeel blog, LinkedIn, institutional research, industry trends), or <strong style={{ color: "#1a3a8f" }}>suggest a topic</strong> manually to skip crawling. Either way, receive 5 topic proposals with EN/ES titles, existing article references, and differentiation angles.
            </div>

            {/* Source pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", justifyContent: "center", marginBottom: "20px" }}>
              {[
                { icon: "🔍", label: "ifeel blog gaps" },
                { icon: "💼", label: "LinkedIn trends" },
                { icon: "🏛️", label: "INSST / EU-OSHA / Eurofound" },
                { icon: "📈", label: "Industry trends 2025" },
              ].map(p => (
                <div key={p.label} style={{ background: "#fff", border: "1.5px solid #1a3a8f18", borderRadius: "20px", padding: "5px 13px", fontSize: "0.76em", color: "#3a4a7a", fontWeight: 500 }}>{p.icon} {p.label}</div>
              ))}
            </div>

            {/* Output pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", marginBottom: "30px" }}>
              {[
                { icon: "🇬🇧", label: "EN article" },
                { icon: "🇪🇸", label: "ES article" },
                { icon: "🎨", label: "Figma HTML" },
                { icon: "🟦", label: "WordPress HTML" },
                { icon: "📊", label: "SEO + AEO" },
                { icon: "✅", label: "Verified links" },
                { icon: "✨", label: "Verity-aware" },
              ].map(p => (
                <div key={p.label} style={{ background: "#fff", border: "1px solid #e0e5f0", borderRadius: "20px", padding: "4px 11px", fontSize: "0.73em", color: "#5a6a90" }}>{p.icon} {p.label}</div>
              ))}
            </div>

            {/* Auto-crawl button */}
            <button
              onClick={handleGo}
              disabled={loading}
              style={{ background: "#e8845a", color: "#fff", border: "none", borderRadius: "14px", padding: "15px 60px", fontWeight: 800, fontSize: "1.15em", cursor: "pointer", boxShadow: "0 6px 20px #e8845a44", letterSpacing: "0.04em" }}
              onMouseEnter={e => e.currentTarget.style.background = "#d4733d"}
              onMouseLeave={e => e.currentTarget.style.background = "#e8845a"}
            >
              Go →
            </button>

            {/* OR divider */}
            <div style={{ fontSize: "0.75em", color: "#b0bbd0", margin: "14px 0", fontWeight: 600 }}>OR</div>

            {/* Custom topic input */}
            <div style={{ display: "flex", gap: "6px", maxWidth: 420 }}>
              <input
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCustomTopic()}
                placeholder="Suggest a topic (e.g., 'Burnout prevention for managers')"
                style={{
                  flex: 1,
                  border: "1.5px solid #cdd6f0",
                  borderRadius: "10px",
                  padding: "9px 13px",
                  fontSize: "0.82em",
                  outline: "none",
                  fontFamily: "inherit",
                  color: "#1a1a2e"
                }}
              />
              <button
                onClick={handleCustomTopic}
                disabled={loading || !customTopic.trim()}
                style={{
                  background: loading || !customTopic.trim() ? "#cdd6f0" : "#1a3a8f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 18px",
                  fontWeight: 700,
                  fontSize: "0.82em",
                  cursor: loading || !customTopic.trim() ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Suggest
              </button>
            </div>

            <div style={{ fontSize: "0.69em", color: "#b0bbd0", marginTop: "16px" }}>Enter to submit · Crawl or custom topic, your choice</div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "8px" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e8845a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "0.7em", flexShrink: 0 }}>i</div>
                )}
                <div style={{
                  maxWidth: "88%",
                  background: m.role === "user" ? "#1a3a8f" : "#fff",
                  color: m.role === "user" ? "#fff" : "#1a1a2e",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "11px 15px", fontSize: "0.82em",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.07)", lineHeight: 1.7,
                }}>
                  {m.role === "assistant" ? renderContent(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#e8845a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "0.7em", flexShrink: 0 }}>i</div>
                <div style={{ background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "12px 18px", boxShadow: "0 1px 5px rgba(0,0,0,0.07)", display: "flex", gap: "5px", alignItems: "center" }}>
                  {[0, 1, 2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#e8845a", animation: "bounce 1.2s infinite", animationDelay: (d * 0.2) + "s" }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      {started && (
        <div style={{ padding: "10px 14px", background: "#fff", borderTop: "1px solid #e0e5f0", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", maxWidth: 860, margin: "0 auto" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Pick a topic number, approve EN/ES links separately, request Figma HTML, WordPress HTML…"
              rows={2}
              style={{ flex: 1, border: "1.5px solid #cdd6f0", borderRadius: "10px", padding: "9px 13px", fontSize: "0.86em", resize: "none", outline: "none", fontFamily: "inherit", color: "#1a1a2e", lineHeight: 1.5 }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{ background: loading || !input.trim() ? "#cdd6f0" : "#e8845a", color: "#fff", border: "none", borderRadius: "10px", padding: "9px 18px", fontWeight: 700, fontSize: "0.87em", cursor: loading || !input.trim() ? "not-allowed" : "pointer", height: 42, transition: "background 0.2s" }}
            >Send</button>
          </div>
          <div style={{ textAlign: "center", fontSize: "0.68em", color: "#b0bbd0", marginTop: "5px" }}>Enter to send · Shift+Enter for new line</div>
        </div>
      )}
      <style>{"@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}"}</style>
    </div>
  );
}
