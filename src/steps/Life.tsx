import { useState } from "react";

interface Props {
  lifeGoals: string;
  tools: string[];
  onChange: (updates: { lifeGoals?: string; tools?: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

const TOOL_CATEGORIES: { label: string; tools: string[] }[] = [
  {
    label: "AI",
    tools: [
      "ChatGPT", "Claude Desktop", "Cursor", "Codex", "Windsurf",
      "Gemini", "Perplexity", "Midjourney", "DALL-E", "Copilot",
      "Aider", "Zed AI", "Replit",
    ],
  },
  {
    label: "Communication",
    tools: [
      "Gmail", "Outlook", "Slack", "Discord", "WhatsApp",
      "Telegram", "iMessage", "Signal", "Microsoft Teams",
      "Zoom", "Google Meet",
    ],
  },
  {
    label: "Calls & meetings",
    tools: [
      "Fathom", "Otter", "Fireflies", "Loom", "Grain",
      "Gong", "Riverside", "Descript",
    ],
  },
  {
    label: "Notes & docs",
    tools: [
      "Apple Notes", "Notion", "Obsidian", "Google Docs",
      "Roam Research", "Logseq", "Craft", "Bear", "Ulysses",
      "Evernote", "OneNote", "Coda",
    ],
  },
  {
    label: "Project management",
    tools: [
      "Linear", "Jira", "Asana", "Monday", "Trello",
      "Basecamp", "ClickUp", "Shortcut", "Height",
    ],
  },
  {
    label: "Code & dev",
    tools: [
      "GitHub", "GitLab", "Bitbucket", "VS Code", "Vercel",
      "Netlify", "Railway", "Supabase", "Firebase", "AWS",
      "Docker", "Terraform",
    ],
  },
  {
    label: "Design",
    tools: [
      "Figma", "Framer", "Canva", "Adobe Creative Suite",
      "Sketch", "Whimsical", "Miro", "FigJam",
    ],
  },
  {
    label: "Social & content",
    tools: [
      "Twitter/X", "LinkedIn", "Instagram", "YouTube",
      "TikTok", "Substack", "Medium", "Ghost",
      "Buffer", "Typefully", "Beehiiv",
    ],
  },
  {
    label: "Finance & ops",
    tools: [
      "Stripe", "Xero", "QuickBooks", "Wave",
      "Airtable", "Google Sheets", "Excel",
    ],
  },
  {
    label: "CRM & sales",
    tools: [
      "HubSpot", "Salesforce", "Pipedrive", "Close",
      "Apollo", "Clay", "Instantly",
    ],
  },
  {
    label: "Storage & files",
    tools: [
      "iCloud Drive", "Google Drive", "Dropbox", "OneDrive",
      "Box",
    ],
  },
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap((c) => c.tools);

export default function Life({ lifeGoals, tools, onChange, onNext, onBack }: Props) {
  const [filter, setFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const toggleTool = (tool: string) => {
    if (tools.includes(tool)) {
      onChange({ tools: tools.filter((t) => t !== tool) });
    } else {
      onChange({ tools: [...tools, tool] });
    }
  };

  const addCustom = () => {
    if (customInput.trim() && !tools.includes(customInput.trim())) {
      onChange({ tools: [...tools, customInput.trim()] });
      setCustomInput("");
    }
  };

  const filtered = filter
    ? ALL_TOOLS.filter((t) => t.toLowerCase().includes(filter.toLowerCase()))
    : activeCategory
    ? TOOL_CATEGORIES.find((c) => c.label === activeCategory)?.tools || []
    : [];

  const showAll = !filter && !activeCategory;

  return (
    <>
      <div className="step-title">Your context</div>
      <div className="step-description">
        Where does your information live today? Select everything you use —
        your squirrel will know where to look when building your world.
      </div>

      <div className="input-group">
        <div className="input-label">Life goals (freeform)</div>
        <textarea
          className="input-field"
          placeholder="What matters beyond work — health, family, financial goals, what you're building toward..."
          value={lifeGoals}
          onChange={(e) => onChange({ lifeGoals: e.target.value })}
          rows={2}
          style={{ resize: "none" }}
        />
      </div>

      <div className="input-group">
        <div className="input-label">
          Where does your context live? ({tools.length} selected)
        </div>

        {/* Search */}
        <input
          className="input-field"
          type="text"
          placeholder="Search tools..."
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setActiveCategory(null); }}
          style={{ marginBottom: 8 }}
        />

        {/* Category tabs */}
        {!filter && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {TOOL_CATEGORIES.map((cat) => {
              const count = cat.tools.filter((t) => tools.includes(t)).length;
              return (
                <button
                  key={cat.label}
                  className={`tool-option ${activeCategory === cat.label ? "selected" : ""}`}
                  onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                  style={{ fontSize: 11, padding: "4px 10px" }}
                >
                  {cat.label}{count > 0 ? ` (${count})` : ""}
                </button>
              );
            })}
          </div>
        )}

        {/* Tool grid */}
        {(filter || activeCategory) && (
          <div className="tool-grid" style={{ maxHeight: 160, overflowY: "auto" }}>
            {filtered.map((tool) => (
              <button
                key={tool}
                className={`tool-option ${tools.includes(tool) ? "selected" : ""}`}
                onClick={() => toggleTool(tool)}
              >
                {tool}
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>No matches</p>
            )}
          </div>
        )}

        {/* Show all when no filter */}
        {showAll && (
          <div className="tool-grid" style={{ maxHeight: 160, overflowY: "auto" }}>
            {TOOL_CATEGORIES.map((cat) => (
              cat.tools.filter((t) => tools.includes(t)).map((tool) => (
                <button
                  key={tool}
                  className="tool-option selected"
                  onClick={() => toggleTool(tool)}
                >
                  {tool}
                </button>
              ))
            ))}
            {tools.filter(t => !ALL_TOOLS.includes(t)).map((tool) => (
              <button
                key={tool}
                className="tool-option selected"
                onClick={() => toggleTool(tool)}
              >
                {tool}
              </button>
            ))}
            {tools.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Pick a category above or search
              </p>
            )}
          </div>
        )}

        {/* Custom tool input */}
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <input
            className="input-field"
            type="text"
            placeholder="Something else? Add it"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            style={{ fontSize: 13 }}
          />
          <button
            className="btn btn-secondary"
            onClick={addCustom}
            style={{ flex: "none", padding: "8px 14px", fontSize: 13 }}
            disabled={!customInput.trim()}
          >
            +
          </button>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </>
  );
}
