interface Props {
  contextSources: string[];
  onChange: (sources: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SourceGroup {
  label: string;
  tools: string[];
}

const SOURCE_GROUPS: SourceGroup[] = [
  {
    label: "AI conversations",
    tools: [
      "ChatGPT",
      "Claude Desktop",
      "Cursor",
      "Copilot",
      "Gemini",
      "Perplexity",
      "Windsurf",
      "Replit",
    ],
  },
  {
    label: "Communication",
    tools: [
      "Gmail",
      "Outlook",
      "Slack",
      "Discord",
      "WhatsApp",
      "Telegram",
      "iMessage",
      "Signal",
      "Teams",
    ],
  },
  {
    label: "Meetings",
    tools: [
      "Fathom",
      "Otter",
      "Fireflies",
      "Zoom",
      "Google Meet",
      "Loom",
      "Gong",
      "Grain",
    ],
  },
  {
    label: "Notes",
    tools: [
      "Apple Notes",
      "Notion",
      "Obsidian",
      "Google Docs",
      "Roam",
      "Logseq",
      "Bear",
      "Evernote",
      "Craft",
    ],
  },
  {
    label: "Code",
    tools: [
      "GitHub",
      "GitLab",
      "Bitbucket",
      "VS Code",
      "Vercel",
      "Supabase",
      "Firebase",
      "Railway",
      "AWS",
    ],
  },
  {
    label: "Project mgmt",
    tools: [
      "Linear",
      "Jira",
      "Asana",
      "Monday",
      "Trello",
      "ClickUp",
      "Basecamp",
      "Shortcut",
    ],
  },
  {
    label: "Files",
    tools: [
      "iCloud Drive",
      "Google Drive",
      "Dropbox",
      "OneDrive",
    ],
  },
  {
    label: "Social",
    tools: [
      "Twitter/X",
      "LinkedIn",
      "Instagram",
      "YouTube",
      "TikTok",
      "Substack",
      "Medium",
      "Ghost",
    ],
  },
  {
    label: "Finance",
    tools: [
      "Stripe",
      "Xero",
      "QuickBooks",
      "Google Sheets",
      "Airtable",
      "Excel",
    ],
  },
  {
    label: "CRM",
    tools: [
      "HubSpot",
      "Salesforce",
      "Pipedrive",
      "Close",
      "Apollo",
      "Clay",
    ],
  },
];

export default function Sources({
  contextSources,
  onChange,
  onNext,
  onBack,
}: Props) {
  const toggle = (tool: string) => {
    if (contextSources.includes(tool)) {
      onChange(contextSources.filter((t) => t !== tool));
    } else {
      onChange([...contextSources, tool]);
    }
  };

  const toggleGroup = (group: SourceGroup) => {
    const allSelected = group.tools.every((t) => contextSources.includes(t));
    if (allSelected) {
      onChange(contextSources.filter((t) => !group.tools.includes(t)));
    } else {
      const toAdd = group.tools.filter((t) => !contextSources.includes(t));
      onChange([...contextSources, ...toAdd]);
    }
  };

  return (
    <>
      <div className="step-title">Where does your context live?</div>
      <div className="step-description">
        Select everything you use. Your squirrel will know where to look when
        pulling in context. This maps to sync sources in your World config.
      </div>

      <div className="source-groups">
        {SOURCE_GROUPS.map((group) => {
          const selectedCount = group.tools.filter((t) =>
            contextSources.includes(t)
          ).length;
          return (
            <div key={group.label} className="source-group">
              <div
                className="source-group-header"
                onClick={() => toggleGroup(group)}
              >
                <span className="source-group-label">{group.label}</span>
                {selectedCount > 0 && (
                  <span className="source-group-count">{selectedCount}</span>
                )}
              </div>
              <div className="source-group-tools">
                {group.tools.map((tool) => (
                  <button
                    key={tool}
                    className={`tool-option ${
                      contextSources.includes(tool) ? "selected" : ""
                    }`}
                    onClick={() => toggle(tool)}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {contextSources.length > 0 && (
        <p
          style={{
            fontSize: 12,
            color: "var(--accent)",
            marginTop: 8,
            fontWeight: 500,
          }}
        >
          {contextSources.length} source{contextSources.length !== 1 ? "s" : ""}{" "}
          selected
        </p>
      )}

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          {contextSources.length > 0 ? "Next" : "Skip"}
        </button>
      </div>
    </>
  );
}
