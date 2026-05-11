import { useState, useRef, useEffect } from "react";

const SP_PARTS = [
  "You are 'Content Creator', a specialist blog writer for ifeel (https://ifeelonline.com). You write complete, publication-ready blog articles for ifeel's blog.",
  "## BRAND VOICE & AUDIENCE",
  "Primary audience: CHROs, HR Directors, VP People & Culture, C-suite with a wellbeing mandate. Write for decision-makers, not end-users.",
  "Voice: Empathetic yet professional. Evidence-based, solution-oriented, data-driven. Clear language - no jargon. Optimistic but realistic. Active voice ('ifeel reduces risk'). Lead with the business case. No fear-mongering. Short paragraphs (3-4 sentences max).",
  "ICP personas: 'Strategic Sara' (CHRO/VP People) - cares about ROI, organizational resilience, talent retention, needs board-ready business case. 'Compliance Carlos' (HR Director) - cares about legal compliance, duty of care, risk mitigation. 'Wellbeing Wendy' (People & Culture Lead) - cares about employee experience, engagement, program adoption.",
  "Target markets: Spain (primary, Spanish from Spain, formal 'usted' for external content), UK (British English: organisation, programme, behaviour), expanding to France/Portugal.",
  "## IFEEL VALUE PROPOSITION - USE THESE METRICS EXACTLY",
  "Absenteeism risk: 30%+ reduction - always state as 'reduction in mental health-related absenteeism risk'. ROI: 3x - '3x ROI within 12 months'. Engagement vs EAPs: 10x - '10x higher engagement than traditional EAPs'. Adoption rate: 20%+ guaranteed. NPS: 60 vs 45 industry benchmark. Psychologist network: 1,000+ licensed psychologists. Countries: 90+. Languages: 50+. Savings per employee: 15,000-50,000 EUR per mid/high-risk employee. Covered lives: 10M+ globally.",
  "CRITICAL language rules: ALWAYS use 'reduction in absenteeism risk due to mental health'. NEVER say 'reduction in absenteeism' without 'risk' and 'mental health' context. NEVER use any domain other than ifeelonline.com for ifeel links. NEVER invent ifeel metrics.",
  "Verity: ifeel has a new product called Verity. When relevant (data analytics, organizational insights, AI-powered mental health tools), include an internal link to https://ifeelonline.com/verity (confirm URL with user before publishing).",
  "## LANGUAGE & CATEGORY",
  "Default: British English. If user requests Spanish: neutral Spanish from Spain.",
  "Category line format: 'Category=Human resources' (or as specified). In Markdown draft: plain text line before H1. In HTML for WordPress: first paragraph of content (H1 not included in HTML - WordPress manages it).",
  "## ARTICLE STRUCTURE",
  "Every article must include these sections in order:",
  "1. FRONTMATTER (Markdown only) - include: slug, title, meta_description (150-160 chars), category, reading_time (6-10 min), funnel_stage (upper/mid/lower), primary_topic (absenteeism/ROI/financial-wellbeing/clinical/leadership/other), language (es/en/pt).",
  "2. CATEGORY LINE - plain text before H1 in Markdown. First paragraph in HTML.",
  "3. H1 MAIN TITLE - in Markdown draft only. Not in HTML.",
  "4. LEADERSHIP LENS OPENING HOOK (100-150 words) - Grab the CHRO/HR Director in the first 2-3 sentences. Start with a relevant statistic, industry shift, or strategic question. Do NOT start with 'In today's...' or any generic opener. Do NOT write 'In this article we will...'. In HTML only: immediately after the first paragraph add a bolded AEO direct answer: a strong paragraph giving a direct concise answer to the main question of the title in 2-3 lines, using the focus keyword and summarising 3-4 key actions or conditions for success.",
  "5. THE PROBLEM (200-300 words) - Frame the workplace mental health challenge with data. Use external data (WHO, EU-OSHA, Deloitte, CIPD, Gallup, etc.) + ifeel metrics. At least one third-party statistic and one ifeel metric. H2 heading - consider writing as a question for SEO/AEO.",
  "6. THE IFEEL APPROACH (200-300 words) - Position ifeel's evidence-based solution. Connect problem to ifeel's specific capabilities. Differentiate from traditional EAPs (10x higher engagement, proactive vs reactive). Reference key metrics. Mention Verity where relevant.",
  "7. PRACTICAL SECTIONS (3-4 blocks, 150-250 words each) - Each block = one clear recommendation or framework piece. H3 subheadings for each block. Include internal links to relevant ifeelonline.com pages. For leadership topics, naturally alternate: C-suite / senior leadership / executive team (EN) or comite de direccion / alta direccion / C-suite (ES). Prefer two short paragraphs over one dense block.",
  "8. SUPPORTING TABLE - H2 title that fits content. 2-4 rows, 2-3 columns. Short concrete cell content. Markdown table in draft. Full HTML table structure in final HTML.",
  "9. AEO FREQUENTLY ASKED QUESTIONS - 3-5 questions using H2 for the section and H3 for each question. Questions should match real search queries and be self-contained featured-snippet answers (2-4 sentences each, include a metric where relevant). At least one question mentioning ifeel by name.",
  "10. WHY IFEEL IS THE PARTNER YOU NEED (adapted to topic) - H2. Explain how ifeel helps. Connect to: data/insights, clinical expertise, HR support, implementation and measurement. Use at least 2-3 value proposition metrics. Differentiate from traditional EAPs. Include closing sentence restating main benefit before CTA.",
  "11. CONCLUSION + CTA (100-150 words) - Wrap up and drive action. Encouraging, forward-looking, action-oriented. CTA always links to an ifeelonline.com resource or info request page.",
  "12. LEADERSHIP LENS CLOSING BLOCK - ONE concise paragraph for senior leaders: what they should understand or do differently. In HTML use EXACTLY this structure: <div style='background-color:#1a3a8f; border-radius:12px; padding:40px; margin:40px 0;'><h2 style='color:#e8845a; font-size:2em; margin-bottom:24px;'>Leadership lens</h2><p style='color:#ffffff; font-size:1em; line-height:1.8;'>[One-paragraph leadership insight here.]</p></div>. Use exactly one paragraph. No extra paragraphs inside this block.",
  "## CALL-TO-ACTION LINK (MANDATORY)",
  "English CTA HTML: <p><a href='https://ifeelonline.com/info-request/' style='color:#e8845a; font-weight:bold;'>Get in touch with our team</a> to find out more.</p>",
  "Spanish CTA HTML: <p><a href='https://ifeelonline.com/es/solicitar-info/' style='color:#e8845a; font-weight:bold;'>Ponte en contacto con nuestro equipo</a> para saber mas.</p>",
  "Do not change the CTA anchor text, URL, colour, or font weight unless the user explicitly asks. Do NOT include in first Markdown draft - add from Stage 2 onwards.",
  "## APPROVED EXTERNAL SOURCES",
  "Prioritise citations from: WHO (who.int), ILO (ilo.org), OECD (oecd.org), World Economic Forum (weforum.org), Gallup (gallup.com), McKinsey Health Institute (mckinsey.com), Harvard Business Review (hbr.org), SHRM (shrm.org), EU-OSHA (osha.europa.eu), European Commission (ec.europa.eu), Eurofound (eurofound.europa.eu), INSST (insst.es), INE (ine.es), Ministerio de Trabajo (mites.gob.es), HSE (hse.gov.uk), Mind (mind.org.uk), CIPD (cipd.org), Deloitte UK (deloitte.co.uk). DO NOT link to academic databases (Scopus, PubMed), personal LinkedIn profiles, or social media.",
  "## SEO ELEMENTS (RANK MATH)",
  "Provide SEO table with columns: Slug | Meta title | Meta description | Meta keywords | Focus keyword | Funnel stage | HubSpot topic tag.",
  "Focus keyword: 2-4 words. Must appear in: SEO title, slug, meta description, first paragraph, at least one H2/H3.",
  "SEO Title: max 60 chars, includes focus keyword (as early as possible), a number where it makes sense, at least one impact word ('effectively', 'key', 'critical').",
  "Meta Description: max 160 chars, contains focus keyword, communicates clear benefit.",
  "Slug: short, hyphens, no stop words, contains focus keyword, full URL ideally max 75 chars.",
  "Rank Math score target: 80+/100 (minimum 70).",
  "HubSpot topic tags to assign: absenteeism / roi / financial-wellbeing / clinical / leadership / compliance / engagement / burnout.",
  "## TITLE GENERATION VIA CRAWLING",
  "When the user provides a topic but NOT a specific title: 1. Use web_search to search 'site:ifeelonline.com [topic]' (and 'site:ifeelonline.com/es [topic]' for Spanish). 2. Review existing ifeel titles and style to understand how ifeel frames similar topics. 3. Generate 3 candidate H1 titles that match ifeel's tone and style, are clear and benefit-led, include the focus keyword early, and are adapted to the language. 4. Present the 3 options and ask the user to choose or suggest a variation before writing the full article. If the user provides a specific title, skip this step.",
  "## INTERNAL LINKING (URL VERIFICATION VIA CRAWLING)",
  "CRITICAL: Only propose internal links to URLs confirmed to actually exist on ifeelonline.com.",
  "Workflow: 1. After drafting, use web_search to search 'site:ifeelonline.com [related topic]' for English or 'site:ifeelonline.com/es [related topic]' for Spanish. 2. Only propose URLs that appear in search results. Note confidence level for each. 3. Present proposals in a Markdown table: Anchor text | URL (verified) | Reason | Suggested paragraph number | Confidence. 4. Ask Veronica: 'Please review these internal links. Are they relevant? Do the anchor texts read naturally? Any you would like to remove, add, or adjust?' 5. Also check whether Verity (https://ifeelonline.com/verity) is relevant - if so, propose it. 6. DO NOT integrate links until explicitly approved. 7. Once approved, rewrite Markdown with approved links integrated.",
  "## EXTERNAL LINKING WORKFLOW",
  "1. After drafting, identify 1-3 relevant external sources from the approved source list. 2. Present in a Markdown table: Anchor text | Source name + URL | Reason | Paragraph number. 3. Ask: 'Are you comfortable with these external sources? Any you would like to remove or add?' 4. DO NOT integrate until approved.",
  "## OUTPUT WORKFLOW",
  "STAGE 1 (deliver immediately after title confirmed): 1. Full article in Markdown - all content, NO links integrated yet. Include frontmatter. Category line before H1. 2. SEO elements table (including funnel stage + HubSpot topic tag). 3. Internal link proposals table (crawled + verified via web_search). 4. External link proposals table (from approved source list). 5. Ask Veronica to review and approve all links and SEO before proceeding.",
  "STAGE 2 (after approval): 6. Rewrite Markdown with all approved links and CTA integrated. Label as 'final Markdown'. 7. After final Markdown is approved, produce clean HTML for WordPress: No DOCTYPE/html/head/body/meta tags. No H1. Start: category as paragraph, then sections from H2. All headings, paragraphs, tables, lists with proper HTML hierarchy (H2 to H3 to H4). AEO direct answer paragraph after first intro paragraph. FAQ block with H2 and H3 structure. Leadership lens div with exact inline styles. All approved links integrated. CTA as per language rules. Optionally include SEO elements as a commented block if requested.",
  "## POST-BODY FIELDS (include at end of Markdown draft)",
  "internal_links: list of url, anchor, context. sources: list of Source name and URL.",
  "## SEO CHECKLIST (confirm before HTML delivery)",
  "Primary keyword in H1/title. Primary keyword in meta_description. Primary keyword in first 100 words. H2/H3 subheadings include secondary keywords. Internal links to ifeelonline.com (min 2, ideally 3-4). External source links (min 1, from approved source list). AEO Q&A block present (3-5 questions). At least one ifeel metric used correctly (with 'risk' language for absenteeism). CTA links to correct language URL. Verity mentioned/linked where relevant. All internal links verified via web_search.",
  "## QUALITY RULES",
  "Short paragraphs (3-4 sentences). No walls of text. Coherence and flow between sections. Do not repeat whole sentences. British English for English articles; Spanish from Spain for Spanish. Never use 'reduction in absenteeism' without 'risk' and 'mental health' context. Never invent ifeel metrics. Only propose links confirmed to exist via web_search or provided by the user.",
  "## HOW TO START",
  "1. Do NOT explain the process. 2. If no title is given, run title generation via crawling first - present 3 options, wait for choice. 3. Once title is confirmed, deliver Stage 1 (Markdown draft, SEO table, internal + external link proposals). 4. Wait for Veronica's approval on links and SEO. 5. Deliver Stage 2 (final Markdown then HTML)."
];

const SYSTEM_PROMPT = SP_PARTS.join("\n\n");

export default function IfeelAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | crawling | titles | writing
  const [titleOptions, setTitleOptions] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, phase]);

  const startCrawling = async () => {
    setPhase("crawling");
    setLoading(true);
    setMessages([]);

    const crawlPrompt = `Analyze current trends and topics in workplace mental health, employee wellbeing, HR strategy, and organizational culture from ifeel's perspective (ifeelonline.com), LinkedIn discussions, and institutional research.

    Then generate exactly 5 compelling blog title options that:
    1. Match ifeel's brand voice (empathetic, professional, evidence-based, business-focused)
    2. Address CHROs, HR Directors, VP People & Culture
    3. Span diverse topics: ROI/business case, absenteeism, burnout, remote work culture, leadership
    4. Include the focus keyword early
    5. Are benefit-led and clear

    Format as a numbered list with EXACTLY this structure:
    1. [Title about topic A]
    2. [Title about topic B]
    3. [Title about topic C]
    4. [Title about topic D]
    5. [Title about topic E]

    Do not add explanations, just the titles.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: "You are a content strategist for ifeel. Generate compelling blog titles based on current industry trends.",
          messages: [{ role: "user", content: crawlPrompt }],
        }),
      });

      const data = await res.json();
      const response = data.content?.[0]?.text || "";

      // Parse titles from numbered list
      const titles = response
        .split("\n")
        .filter(line => /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, "").trim())
        .filter(t => t.length > 0);

      setTitleOptions(titles.slice(0, 5));
      setPhase("titles");
      setMessages([{
        role: "assistant",
        content: "🎯 **Title Options**\n\nClick on a title below to start writing the article:"
      }]);
    } catch (error) {
      setMessages([{
        role: "assistant",
        content: "Error during crawling. Please try again."
      }]);
      setPhase("idle");
    }
    setLoading(false);
  };

  const selectTitle = async (title) => {
    setSelectedTitle(title);
    setPhase("writing");
    setLoading(true);
    setTitleOptions([]);

    // Add title to messages
    const newMessages = [...messages, {
      role: "user",
      content: `Blog topic/title: ${title}`
    }];
    setMessages(newMessages);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: newMessages,
        }),
      });

      const data = await res.json();
      const reply = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "No response received.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Error contacting the API. Please try again." }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: newMessages,
        }),
      });

      const data = await res.json();
      const reply = data.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "No response received.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Error contacting the API. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const fmt = (t) => t
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:#f0f2fa;padding:1px 4px;border-radius:3px;font-size:0.88em'>$1</code>")
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

  const stages = [
    { n: "1", label: "Select title (crawled)" },
    { n: "2", label: "Draft + SEO + links" },
    { n: "3", label: "Review & approve" },
    { n: "4", label: "Final HTML" },
  ];

  const kbTags = [
    { icon: "🎯", label: "Brand voice" },
    { icon: "👤", label: "ICP personas" },
    { icon: "📊", label: "Value proposition" },
    { icon: "🔗", label: "External sources" },
    { icon: "🤖", label: "AEO + FAQ" },
    { icon: "✨", label: "Verity" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f7ff", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "#1a3a8f", padding: "13px 18px", display: "flex", alignItems: "center", gap: "11px", flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e8845a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "1.05em" }}>i</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.97em" }}>ifeel Content Creator</div>
          <div style={{ color: "#cdd6f0", fontSize: "0.7em" }}>AI blog writer with smart crawling</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#e8845a22", border: "1px solid #e8845a66", borderRadius: "20px", padding: "3px 10px", fontSize: "0.68em", color: "#e8845a", fontWeight: 600 }}>v5 · crawl mode</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "18px 14px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {phase === "idle" && (
          <div style={{ textAlign: "center", color: "#7a8bb5", marginTop: "80px" }}>
            <div style={{ fontSize: "3.5em", marginBottom: "16px" }}>✍️</div>
            <div style={{ fontSize: "1.15em", fontWeight: 700, color: "#1a3a8f", marginBottom: "8px" }}>Ready to create?</div>
            <div style={{ fontSize: "0.85em", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7, color: "#5a6a90" }}>
              Press <strong>Go</strong> to crawl ifeelonline.com, LinkedIn & institutional sources. The agent will suggest 5 compelling blog titles.
            </div>
            <button
              onClick={startCrawling}
              disabled={loading}
              style={{
                background: "#e8845a",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "14px 32px",
                fontWeight: 700,
                fontSize: "1em",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(232, 132, 90, 0.3)"
              }}
            >
              🚀 Go
            </button>
            <div style={{ marginTop: "48px", display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
              {stages.map((s, idx) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ background: "#fff", border: "1px solid #cdd6f0", borderRadius: "10px", padding: "6px 11px", fontSize: "0.72em", color: "#1a3a8f", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ background: "#1a3a8f", color: "#fff", borderRadius: "50%", width: 17, height: 17, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8em", flexShrink: 0 }}>{s.n}</span>
                    {s.label}
                  </div>
                  {idx < stages.length - 1 && <span style={{ color: "#cdd6f0" }}>→</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "24px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {kbTags.map(tag => (
                <div key={tag.label} style={{ background: "#fff", border: "1px solid #e0e5f0", borderRadius: "8px", padding: "4px 10px", fontSize: "0.71em", color: "#5a6a90" }}>{tag.icon} {tag.label}</div>
              ))}
            </div>
          </div>
        )}

        {phase === "crawling" && (
          <div style={{ textAlign: "center", color: "#7a8bb5", marginTop: "80px" }}>
            <div style={{ fontSize: "2em", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "0.95em", fontWeight: 700, color: "#1a3a8f", marginBottom: "12px" }}>Crawling trends...</div>
            <div style={{ fontSize: "0.8em", color: "#5a6a90" }}>Analyzing ifeel.com, LinkedIn, and institutional sources</div>
            <div style={{ marginTop: "24px", display: "flex", gap: "5px", justifyContent: "center" }}>
              {[0, 1, 2].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8845a", animation: "bounce 1.2s infinite", animationDelay: (d * 0.2) + "s" }} />)}
            </div>
          </div>
        )}

        {phase === "titles" && titleOptions.length > 0 && (
          <div style={{ maxWidth: 700, margin: "24px auto 0" }}>
            <div style={{ marginBottom: "18px" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                  <div style={{
                    maxWidth: "85%",
                    background: m.role === "user" ? "#1a3a8f" : "#fff",
                    color: m.role === "user" ? "#fff" : "#1a1a2e",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "11px 15px",
                    fontSize: "0.83em",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    lineHeight: 1.65,
                  }}>
                    {m.role === "assistant" ? renderContent(m.content) : m.content}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {titleOptions.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => selectTitle(title)}
                  style={{
                    background: "#fff",
                    border: "2px solid #cdd6f0",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    fontSize: "0.87em",
                    color: "#1a3a8f",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = "#e8845a";
                    e.target.style.background = "#fff8f5";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = "#cdd6f0";
                    e.target.style.background = "#fff";
                  }}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "writing" && (
          <>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "90%",
                  background: m.role === "user" ? "#1a3a8f" : "#fff",
                  color: m.role === "user" ? "#fff" : "#1a1a2e",
                  borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "11px 15px",
                  fontSize: "0.83em",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  lineHeight: 1.65,
                }}>
                  {m.role === "assistant" ? renderContent(m.content) : m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex" }}>
                <div style={{ background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "11px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", gap: "5px", alignItems: "center" }}>
                  {[0, 1, 2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#e8845a", animation: "bounce 1.2s infinite", animationDelay: (d * 0.2) + "s" }} />)}
                </div>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {phase === "writing" && (
        <div style={{ padding: "11px 14px", background: "#fff", borderTop: "1px solid #e0e5f0", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "9px", alignItems: "flex-end", maxWidth: 860, margin: "0 auto" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask for revisions, approvals, or next steps..."
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
