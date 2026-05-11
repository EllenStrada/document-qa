import { useState, useRef, useEffect } from "react";

const SP_PARTS = [
  "You are 'Content Creator', a specialist blog writer for ifeel (https://ifeelonline.com). You write complete, publication-ready blog articles for ifeel's blog.",
  "## BRAND VOICE & AUDIENCE",
  "Primary audience: CHROs, HR Directors, VP People & Culture, C-suite with a wellbeing mandate. Write for decision-makers, not end-users.",
  "Voice: Empathetic yet professional. Evidence-based, solution-oriented, data-driven. Clear language - no jargon. Optimistic but realistic. Active voice ('ifeel reduces risk'). Lead with the business case. No fear-mongering. Short paragraphs (3-4 sentences max).",
  "ICP personas: 'Strategic Sara' (CHRO/VP People) - cares about ROI, organizational resilience, talent retention, needs board-ready business case. 'Compliance Carlos' (HR Director) - cares about legal compliance, duty of care, risk mitigation. 'Wellbeing Wendy' (People & Culture Lead) - cares about employee experience, engagement, program adoption.",
  "Target markets: Spain (primary, Spanish from Spain, formal 'usted' for external content), UK (British English: organisation, programme, behaviour).",
  "## IFEEL VALUE PROPOSITION - USE THESE METRICS EXACTLY",
  "Absenteeism risk: 30%+ reduction - always state as 'reduction in mental health-related absenteeism risk'. ROI: 3x - '3x ROI within 12 months'. Engagement vs EAPs: 10x - '10x higher engagement than traditional EAPs'. Adoption rate: 20%+ guaranteed. NPS: 60 vs 45 industry benchmark. Psychologist network: 1,000+ licensed psychologists. Countries: 90+. Languages: 50+. Savings per employee: 15,000-50,000 EUR per mid/high-risk employee. Covered lives: 10M+ globally.",
  "CRITICAL language rules: ALWAYS use 'reduction in absenteeism risk due to mental health'. NEVER say 'reduction in absenteeism' without 'risk' and 'mental health' context. NEVER use any domain other than ifeelonline.com for ifeel links. NEVER invent ifeel metrics.",
  "Verity: ifeel has a new product called Verity. When relevant (data analytics, organizational insights, AI-powered mental health tools), include an internal link to https://ifeelonline.com/verity (confirm URL with user before publishing).",
  "## LANGUAGE & CATEGORY",
  "English articles: British English (organisation, programme, behaviour). Spanish articles: neutral Spanish from Spain, formal 'usted'. Both languages are delivered as SEPARATE files/documents - never mix them in the same output.",
  "Category line format: 'Category=Human resources' (or as specified). In Markdown draft: plain text line before H1. In HTML for WordPress: first paragraph of content (H1 not included in HTML - WordPress manages it).",
  "## TOPIC/TITLE SUGGESTION MODE — COMPREHENSIVE CRAWLING",
  "When the user clicks Go without providing a topic or title, you MUST execute comprehensive crawling across FOUR sources:",
  "SOURCE 1 - IFEEL BLOG COVERAGE & GAPS: Use web_search 'site:ifeelonline.com' and 'site:ifeelonline.com/es'. Identify existing content, topics, keywords, and gaps. Note which topics are well-covered vs underrepresented.",
  "SOURCE 2 - LINKEDIN INTELLIGENCE: Search 'ifeel mental health linkedin articles' and 'ifeel company page posts'. Analyze: (a) which topics ifeel posts on LinkedIn, (b) engagement patterns (likes, reposts, comments), (c) competitor posts (e.g., search 'EAP provider linkedin HR wellbeing' or 'mental health platform linkedin' to see what similar companies are discussing). Identify trending discussions ifeel is NOT addressing.",
  "SOURCE 3 - INSTITUTIONAL & REGULATORY TRENDS: Search for recent research/reports from: INSST (Instituto Nacional de Seguridad y Salud en el Trabajo), INE (Instituto Nacional de Estadística), Ministerio de Trabajo (Spain), EU-OSHA, European Commission on mental health at work, Eurofound reports. Search: 'INSST workplace mental health 2024', 'EU-OSHA psychosocial risks', 'Eurofound mental wellbeing report'. Identify current regulatory/policy trends.",
  "SOURCE 4 - INDUSTRY TRENDS & THOUGHT LEADERSHIP: Search 'workplace mental health trends 2025', 'HR wellbeing outlook 2025', 'burnout statistics 2025', 'absenteeism mental health 2025', 'employee wellness ROI case studies'. Look for recent data, studies, and emerging discussions.",
  "SYNTHESIS: Based on all four sources, suggest 5 DISTINCT topic ideas that: (a) address gaps in ifeel's blog coverage, (b) align with trending LinkedIn discussions ifeel's audience cares about, (c) incorporate latest institutional/regulatory insights, (d) reflect broader industry momentum. For each topic, provide: working title (EN), working title (ES), funnel stage (upper/mid/lower), HubSpot topic tag, and a two-sentence rationale explaining WHY this topic fills a gap or capitalizes on a trend. Present as a numbered list and ask the user to pick one.",
  "## ARTICLE STRUCTURE",
  "Every article must include these sections in order:",
  "1. FRONTMATTER (Markdown only) - include: slug, title, meta_description (150-160 chars), category, reading_time (6-10 min), funnel_stage (upper/mid/lower), primary_topic (absenteeism/ROI/financial-wellbeing/clinical/leadership/other), language (en or es).",
  "2. CATEGORY LINE - plain text before H1 in Markdown. First paragraph in HTML.",
  "3. H1 MAIN TITLE - in Markdown draft only. Not in HTML.",
  "4. LEADERSHIP LENS OPENING HOOK (100-150 words) - Grab the CHRO/HR Director in the first 2-3 sentences. Start with a relevant statistic, industry shift, or strategic question. Do NOT start with 'In today's...' or any generic opener. Do NOT write 'In this article we will...'. In HTML only: immediately after the first paragraph add a bolded AEO direct answer paragraph giving a direct concise answer to the main question of the title in 2-3 lines, using the focus keyword and summarising 3-4 key actions or conditions for success.",
  "5. THE PROBLEM (200-300 words) - Frame the workplace mental health challenge with data. Use external data (WHO, EU-OSHA, Deloitte, CIPD, Gallup, etc.) + ifeel metrics. At least one third-party statistic and one ifeel metric. H2 heading - consider writing as a question for SEO/AEO.",
  "6. THE IFEEL APPROACH (200-300 words) - Position ifeel's evidence-based solution. Connect problem to ifeel's specific capabilities. Differentiate from traditional EAPs (10x higher engagement, proactive vs reactive). Reference key metrics. Mention Verity where relevant.",
  "7. PRACTICAL SECTIONS (3-4 blocks, 150-250 words each) - Each block = one clear recommendation or framework piece. H3 subheadings for each block. Include internal links to relevant ifeelonline.com pages. For leadership topics, naturally alternate: C-suite / senior leadership / executive team (EN) or comite de direccion / alta direccion / C-suite (ES). Prefer two short paragraphs over one dense block.",
  "8. SUPPORTING TABLE - H2 title that fits content. 2-4 rows, 2-3 columns. Short concrete cell content. Markdown table in draft. Full HTML table structure in final HTML.",
  "9. AEO FREQUENTLY ASKED QUESTIONS - 3-5 questions using H2 for the section and H3 for each question. Questions should match real search queries and be self-contained featured-snippet answers (2-4 sentences each, include a metric where relevant). At least one question mentioning ifeel by name.",
  "10. WHY IFEEL IS THE PARTNER YOU NEED (adapted to topic) - H2. Explain how ifeel helps. Connect to: data/insights, clinical expertise, HR support, implementation and measurement. Use at least 2-3 value proposition metrics. Differentiate from traditional EAPs. Include closing sentence restating main benefit before CTA.",
  "11. CONCLUSION + CTA (100-150 words) - Wrap up and drive action. Encouraging, forward-looking, action-oriented. CTA always links to an ifeelonline.com resource or info request page.",
  "12. LEADERSHIP LENS CLOSING BLOCK - ONE concise paragraph for senior leaders. In HTML use EXACTLY: <div style='background-color:#1a3a8f; border-radius:12px; padding:40px; margin:40px 0;'><h2 style='color:#e8845a; font-size:2em; margin-bottom:24px;'>Leadership lens</h2><p style='color:#ffffff; font-size:1em; line-height:1.8;'>[One-paragraph insight here.]</p></div>. Exactly one paragraph, no extras.",
  "## TWO-FILE OUTPUT (ALWAYS)",
  "For every article, produce two completely separate outputs clearly labelled: FILE 1 - ENGLISH VERSION and FILE 2 - SPANISH VERSION. Each file is a complete standalone article in its respective language. Never mix languages. Both files go through the same Stage 1 and Stage 2 workflow. Present them sequentially: complete EN article first, then complete ES article.",
  "## CALL-TO-ACTION LINK (MANDATORY)",
  "English: <p><a href='https://ifeelonline.com/info-request/' style='color:#e8845a; font-weight:bold;'>Get in touch with our team</a> to find out more.</p>",
  "Spanish: <p><a href='https://ifeelonline.com/es/solicitar-info/' style='color:#e8845a; font-weight:bold;'>Ponte en contacto con nuestro equipo</a> para saber mas.</p>",
  "Do not change CTA anchor text, URL, colour, or font weight unless explicitly asked. Do NOT include in first Markdown draft - add from Stage 2 onwards.",
  "## APPROVED EXTERNAL SOURCES",
  "Prioritise: WHO (who.int), ILO (ilo.org), OECD (oecd.org), WEF (weforum.org), Gallup (gallup.com), McKinsey Health Institute (mckinsey.com), HBR (hbr.org), SHRM (shrm.org), EU-OSHA (osha.europa.eu), European Commission (ec.europa.eu), Eurofound (eurofound.europa.eu), INSST (insst.es), INE (ine.es), Ministerio de Trabajo (mites.gob.es), HSE (hse.gov.uk), Mind (mind.org.uk), CIPD (cipd.org), Deloitte UK (deloitte.co.uk). DO NOT link to academic databases, personal LinkedIn profiles, or social media.",
  "## SEO ELEMENTS (RANK MATH)",
  "Provide SEO table per language version: Slug | Meta title | Meta description | Meta keywords | Focus keyword | Funnel stage | HubSpot topic tag. Focus keyword 2-4 words, must appear in title, slug, meta desc, first paragraph, at least one H2/H3. SEO Title max 60 chars, Meta Description max 160 chars. Rank Math target 80+/100.",
  "HubSpot topic tags: absenteeism / roi / financial-wellbeing / clinical / leadership / compliance / engagement / burnout.",
  "## INTERNAL LINKING (VERIFIED VIA CRAWLING)",
  "CRITICAL: Only propose URLs confirmed to exist on ifeelonline.com. After drafting, use web_search 'site:ifeelonline.com [topic]' (EN) or 'site:ifeelonline.com/es [topic]' (ES). Only propose URLs that appear in results. Present table: Anchor text | URL | Reason | Paragraph | Confidence. Ask for approval before integrating. Also check Verity (https://ifeelonline.com/verity) relevance.",
  "## EXTERNAL LINKING WORKFLOW",
  "Identify 1-3 sources from approved list. Present table: Anchor text | Source + URL | Reason | Paragraph. Ask for approval before integrating.",
  "## OUTPUT WORKFLOW — STEP BY STEP (NEVER skip, NEVER combine)",
  "IMPORTANT: Complete each step fully before moving to the next. Never truncate. Never summarise. If long, write in full.",
  "STEP 1 - Comprehensive Topic Suggestions: Execute all FOUR crawling sources (ifeel blog, LinkedIn intelligence, institutional trends, industry trends). Propose 5 distinct topics with EN+ES titles and rationale. Wait for user to pick one.",
  "STEP 2 - Title Confirmation: Propose 3 EN titles + 3 ES titles for the chosen topic. Wait for user to confirm one of each.",
  "STEP 3 - EN DRAFT COMPLETE: Write the entire English article (all 12 sections, frontmatter, SEO table, internal link proposals, external link proposals). Do NOT start Spanish yet. End: 'English draft complete. Please review and I will proceed with Spanish version.'",
  "STEP 4 - ES DRAFT COMPLETE: Write the entire Spanish article (all 12 sections, frontmatter, SEO table, internal link proposals, external link proposals). End: 'Spanish draft complete. Please review both and approve/adjust links and SEO for each.'",
  "STEP 5 - EN FINAL MARKDOWN: After user approves EN links/SEO, produce final English Markdown with all approved links and CTA. Label: FINAL ENGLISH MARKDOWN.",
  "STEP 6 - ES FINAL MARKDOWN: After user approves ES links/SEO, produce final Spanish Markdown with all approved links and CTA. Label: FINAL SPANISH MARKDOWN.",
  "STEP 7 - EN FIGMA-READY HTML: After final EN Markdown approved, produce clean HTML optimized for design handoff to Figma. Include: semantic HTML structure, inline CSS only (no external stylesheets), colour hex codes (#1a3a8f, #e8845a), typography guidelines as comments, spacing/padding values visible, table structure, all links intact. Save as: FIGMA-READY HTML (ENGLISH). Do NOT include WordPress-specific elements yet.",
  "STEP 8 - ES FIGMA-READY HTML: After final ES Markdown approved, produce clean HTML for Figma. Same structure as EN. Save as: FIGMA-READY HTML (SPANISH).",
  "STEP 9 - EN WORDPRESS HTML: From the approved Figma-ready HTML, convert to clean WordPress format: no category H1 (WordPress manages it), sections from H2 onwards, all approved links, CTA, Leadership lens block with exact styles. Save as: WORDPRESS HTML (ENGLISH).",
  "STEP 10 - ES WORDPRESS HTML: From the approved Figma-ready HTML, convert to clean WordPress format. Save as: WORDPRESS HTML (SPANISH).",
  "CRITICAL: Never truncate. Never '[continued]'. Each step must be 100% complete.",
  "## FIGMA-READY HTML SPECIFICATIONS",
  "Structure: Semantic HTML (section, article, header, footer tags where appropriate). No external stylesheets - all CSS inline or in <style> blocks. Include colour scheme comment block at top: <!-- IFEEL COLOUR SCHEME: Primary: #1a3a8f, Accent: #e8845a, Light BG: #f5f7ff, Light Border: #cdd6f0 -->. Spacing: All margins/padding in px, clearly visible. Typography: h1-h6 tags with font-size in em or px, line-height 1.5-1.8. Tables: Full <table> with <thead>, <tbody>, proper cell styling. Images: placeholder <img> tags with src='[TO FILL BY DESIGNER]' and descriptive alt text. Links: all <a> tags with href, colour #e8845a. Ready for Figma import: designers can easily identify sections, spacing, and colours. No WordPress-specific shortcodes or PHP.",
  "## QUALITY RULES",
  "Short paragraphs. No walls of text. British English for EN; Spanish from Spain for ES. Never 'reduction in absenteeism' without 'risk' and 'mental health' context. Never invent ifeel metrics. Only propose verified links. Crawling must be thorough: four sources, not shortcuts.",
  "## HOW TO START",
  "When user sends initial Go: execute comprehensive crawling (ifeel blog, LinkedIn, institutions, industry trends), synthesize findings, propose 5 topics with EN+ES titles. When topic chosen but no title: propose 3 EN + 3 ES titles. When titles confirmed: deliver full Stage 1 for both languages. Do NOT explain process - just execute."
];

const SYSTEM_PROMPT = SP_PARTS.join("\n\n");

export default function IfeelAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

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
      content: "Go. Please execute comprehensive crawling: (1) scan ifeel blog for coverage & gaps, (2) analyze LinkedIn articles and trending posts from ifeel and competitors, (3) review recent institutional research (INSST, EU-OSHA, Eurofound, etc.), (4) assess industry trends in HR wellbeing. Then suggest 5 distinct topic ideas with English and Spanish titles for each."
    };
    setMessages([initMsg]);
    setStarted(true);
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
    .replace(/`(.+?)`/g, "<code style='background:#f0f2fa;padding:1px 4px;border-radius:3px'>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' style='color:#e8845a' target='_blank'>$1</a>");

  const renderContent = (text) => {
    const lines = text.split("\n");
    const els = [];
    let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      if (l.startsWith("#### ")) { els.push(<h4 key={i} style={{ color: "#1a3a8f", fontSize: "0.93em", margin: "8px 0 3px" }}>{l.slice(5)}</h4>); }
      else if (l.startsWith("### ")) { els.push(<h3 key={i} style={{ color: "#1a3a8f", fontSize: "1.02em", margin: "10px 0 4px" }}>{l.slice(4)}</h3>); }
      else if (l.startsWith("## ")) { els.push(<h2 key={i} style={{ color: "#1a3a8f", fontSize: "1.13em", margin: "14px 0 5px", borderBottom: "1px solid #e8845a33", paddingBottom: "4px" }}>{l.slice(3)}</h2>); }
      else if (l.startsWith("# ")) { els.push(<h1 key={i} style={{ color: "#1a3a8f", fontSize: "1.28em", margin: "14px 0 8px" }}>{l.slice(2)}</h1>); }
      else if (l.startsWith("|")) {
        const tl = [];
        while (i < lines.length && lines[i].startsWith("|")) { tl.push(lines[i]); i++; }
        const [hdr, , ...rows] = tl;
        const pr = r => r.split("|").filter((_, j, a) => j > 0 && j < a.length - 1).map(c => c.trim());
        els.push(
          <div key={"t" + i} style={{ overflowX: "auto", margin: "10px 0" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.79em" }}>
              <thead><tr>{pr(hdr).map((h, j) => <th key={j} style={{ background: "#1a3a8f", color: "#fff", padding: "6px 10px", textAlign: "left", border: "1px solid #cdd6f0" }}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((r, ri) => <tr key={ri} style={{ background: ri % 2 === 0 ? "#f5f7ff" : "#fff" }}>{pr(r).map((c, ci) => <td key={ci} style={{ padding: "6px 10px", border: "1px solid #cdd6f0" }}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
        continue;
      } else if (l.startsWith("```")) {
        const cl = []; i++;
        while (i < lines.length && !lines[i].startsWith("```")) { cl.push(lines[i]); i++; }
        els.push(<pre key={i} style={{ background: "#f0f2fa", borderRadius: "6px", padding: "10px 12px", fontSize: "0.77em", overflowX: "auto", margin: "8px 0", color: "#1a3a8f" }}><code>{cl.join("\n")}</code></pre>);
      } else if (l.startsWith("- ") || l.startsWith("* ")) {
        const items = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) { items.push(lines[i].slice(2)); i++; }
        els.push(<ul key={"ul" + i} style={{ margin: "5px 0 5px 18px" }}>{items.map((it, j) => <li key={j} style={{ marginBottom: "3px" }} dangerouslySetInnerHTML={{ __html: fmt(it) }} />)}</ul>);
        continue;
      } else if (/^\d+\.\s/.test(l)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, "")); i++; }
        els.push(<ol key={"ol" + i} style={{ margin: "5px 0 5px 18px" }}>{items.map((it, j) => <li key={j} style={{ marginBottom: "3px" }} dangerouslySetInnerHTML={{ __html: fmt(it) }} />)}</ol>);
        continue;
      } else if (l.startsWith("> ")) {
        els.push(<blockquote key={i} style={{ borderLeft: "3px solid #e8845a", margin: "8px 0", paddingLeft: "12px", color: "#5a6a90", fontStyle: "italic", fontSize: "0.88em" }} dangerouslySetInnerHTML={{ __html: fmt(l.slice(2)) }} />);
      } else if (l === "---") {
        els.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #e0e5f0", margin: "10px 0" }} />);
      } else if (l === "") {
        els.push(<br key={i} />);
      } else {
        els.push(<p key={i} style={{ margin: "3px 0", lineHeight: "1.65" }} dangerouslySetInnerHTML={{ __html: fmt(l) }} />);
      }
      i++;
    }
    return els;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f7ff", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a3a8f", padding: "13px 18px", display: "flex", alignItems: "center", gap: "11px", flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e8845a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "1.05em" }}>i</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.97em" }}>ifeel Content Creator</div>
          <div style={{ color: "#cdd6f0", fontSize: "0.7em" }}>AI blog writer · LinkedIn + Institutions + Figma + WordPress</div>
        </div>
        {started && (
          <button onClick={() => { setMessages([]); setStarted(false); setInput(""); }} style={{ marginLeft: "auto", background: "transparent", border: "1px solid #cdd6f044", borderRadius: "8px", color: "#cdd6f0", fontSize: "0.72em", padding: "4px 10px", cursor: "pointer" }}>
            ↺ New article
          </button>
        )}
        {!started && <div style={{ marginLeft: "auto", background: "#e8845a22", border: "1px solid #e8845a66", borderRadius: "20px", padding: "3px 10px", fontSize: "0.68em", color: "#e8845a", fontWeight: 600 }}>v6 · full crawl</div>}
      </div>

      {/* Chat / Welcome */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 14px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {!started ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "2.8em", marginBottom: "12px" }}>✍️</div>
            <div style={{ fontSize: "1.15em", fontWeight: 800, color: "#1a3a8f", marginBottom: "8px" }}>ifeel Content Creator v6</div>
            <div style={{ fontSize: "0.85em", maxWidth: 480, color: "#5a6a90", lineHeight: 1.7, marginBottom: "28px" }}>
              Hit <strong>Go</strong> and the agent will: crawl ifeel's blog for coverage gaps, analyze LinkedIn (ifeel + competitors), review institutional trends (INSST, EU-OSHA, Eurofound), scan industry insights, then suggest 5 topics ready to write — with EN+ES titles, Figma-ready HTML, and WordPress delivery.
            </div>

            {/* Feature pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", justifyContent: "center", marginBottom: "32px" }}>
              {[
                { icon: "🔍", label: "ifeel blog gaps" },
                { icon: "💼", label: "LinkedIn intel" },
                { icon: "🏛️", label: "Institutions" },
                { icon: "📈", label: "Industry trends" },
                { icon: "🇬🇧", label: "EN file" },
                { icon: "🇪🇸", label: "ES file" },
                { icon: "🎨", label: "Figma HTML" },
                { icon: "📱", label: "WordPress" },
              ].map(p => (
                <div key={p.label} style={{ background: "#fff", border: "1px solid #e0e5f0", borderRadius: "20px", padding: "5px 12px", fontSize: "0.76em", color: "#3a4a7a" }}>{p.icon} {p.label}</div>
              ))}
            </div>

            {/* Stage flow */}
            <div style={{ display: "flex", gap: "5px", justifyContent: "center", flexWrap: "wrap", marginBottom: "36px" }}>
              {[
                { n: "1", label: "Crawl & topics" },
                { n: "2", label: "Pick titles" },
                { n: "3", label: "EN+ES drafts" },
                { n: "4", label: "Approve links" },
                { n: "5", label: "Figma HTML" },
                { n: "6", label: "WordPress HTML" },
              ].map((s, idx, arr) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ background: "#fff", border: "1px solid #cdd6f0", borderRadius: "10px", padding: "5px 11px", fontSize: "0.71em", color: "#1a3a8f", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ background: "#1a3a8f", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.78em", flexShrink: 0 }}>{s.n}</span>
                    {s.label}
                  </div>
                  {idx < arr.length - 1 && <span style={{ color: "#cdd6f0", fontSize: "0.85em" }}>→</span>}
                </div>
              ))}
            </div>

            <button
              onClick={handleGo}
              disabled={loading}
              style={{ background: "#e8845a", color: "#fff", border: "none", borderRadius: "14px", padding: "14px 52px", fontWeight: 800, fontSize: "1.1em", cursor: "pointer", boxShadow: "0 4px 16px #e8845a44", transition: "transform 0.1s, box-shadow 0.1s", letterSpacing: "0.03em" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Go →
            </button>
            <div style={{ fontSize: "0.71em", color: "#aab0c5", marginTop: "10px" }}>Full crawl: blog gaps + LinkedIn + institutions + trends</div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "user" ? null : (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#e8845a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "0.75em", flexShrink: 0, marginRight: "8px", alignSelf: "flex-end" }}>i</div>
                )}
                <div style={{
                  maxWidth: "88%",
                  background: m.role === "user" ? "#1a3a8f" : "#fff",
                  color: m.role === "user" ? "#fff" : "#1a1a2e",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "11px 15px", fontSize: "0.83em",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)", lineHeight: 1.65,
                }}>
                  {m.role === "assistant" ? renderContent(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#e8845a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "0.75em", flexShrink: 0 }}>i</div>
                <div style={{ background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "11px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", gap: "5px", alignItems: "center" }}>
                  {[0, 1, 2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#e8845a", animation: "bounce 1.2s infinite", animationDelay: (d * 0.2) + "s" }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input — only shown after Go */}
      {started && (
        <div style={{ padding: "11px 14px", background: "#fff", borderTop: "1px solid #e0e5f0", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "9px", alignItems: "flex-end", maxWidth: 860, margin: "0 auto" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Reply here — pick a topic, approve links, request Figma or WordPress HTML…"
              rows={2}
              style={{ flex: 1, border: "1.5px solid #cdd6f0", borderRadius: "10px", padding: "9px 13px", fontSize: "0.87em", resize: "none", outline: "none", fontFamily: "inherit", color: "#1a1a2e", lineHeight: 1.5 }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{ background: loading || !input.trim() ? "#cdd6f0" : "#e8845a", color: "#fff", border: "none", borderRadius: "10px", padding: "9px 18px", fontWeight: 700, fontSize: "0.88em", cursor: loading || !input.trim() ? "not-allowed" : "pointer", height: 42, transition: "background 0.2s" }}
            >Send</button>
          </div>
          <div style={{ textAlign: "center", fontSize: "0.7em", color: "#aab0c5", marginTop: "5px" }}>Enter to send · Shift+Enter for new line</div>
        </div>
      )}
      <style>{"@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}"}</style>
    </div>
  );
}
