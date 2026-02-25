interface Props {
  theme: string;
  worldPath: string;
  homePath: string;
  onThemeChange: (theme: string) => void;
  onWorldPathChange: (path: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const presets: {
  value: string;
  label: string;
  bg: string;
  text: string;
  accent: string;
  vibe: string;
}[] = [
  {
    value: "light",
    label: "Light",
    bg: "#faf8f5",
    text: "#1a1715",
    accent: "#b87333",
    vibe: "Warm paper, copper",
  },
  {
    value: "dark",
    label: "Dark",
    bg: "#0a0908",
    text: "#FFF8EE",
    accent: "#D97706",
    vibe: "Midnight amber",
  },
  {
    value: "midnight",
    label: "Midnight",
    bg: "#0f0f1a",
    text: "#e8e6f0",
    accent: "#6366f1",
    vibe: "Deep blue, indigo",
  },
  {
    value: "forest",
    label: "Forest",
    bg: "#0a1208",
    text: "#e8f0e6",
    accent: "#22c55e",
    vibe: "Dark green, emerald",
  },
];

export default function Preferences({
  theme,
  worldPath,
  homePath,
  onThemeChange,
  onWorldPathChange,
  onNext,
  onBack,
}: Props) {
  const defaultPath = `${homePath}/world`;

  return (
    <>
      <div className="step-title">Preferences</div>
      <div className="step-description">
        Pick a look and choose where your World lives. Both can be changed
        later.
      </div>

      <div className="input-group">
        <div className="input-label">Theme</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {presets.map((p) => (
            <div
              key={p.value}
              onClick={() => onThemeChange(p.value)}
              style={{
                border:
                  theme === p.value
                    ? `2px solid ${p.accent}`
                    : "2px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                background: p.bg,
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: p.accent,
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: p.text,
                    opacity: 0.3,
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: p.text,
                    opacity: 0.1,
                  }}
                />
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: p.text }}>
                {p.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: p.text,
                  opacity: 0.5,
                  marginTop: 2,
                }}
              >
                {p.vibe}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="input-group">
        <div className="input-label">World location</div>
        <input
          className="input-field"
          type="text"
          placeholder={defaultPath}
          value={worldPath}
          onChange={(e) => onWorldPathChange(e.target.value)}
        />
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          Leave blank for{" "}
          <code style={{ color: "var(--accent)" }}>~/world</code>. Your World
          is just a folder of files — you can move it anytime.
        </p>
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Build My World
        </button>
      </div>
    </>
  );
}
