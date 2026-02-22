interface Props {
  theme: string;
  onChange: (theme: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const presets: { value: string; label: string; bg: string; text: string; accent: string; vibe: string }[] = [
  { value: "light", label: "Light", bg: "#faf8f5", text: "#1a1715", accent: "#b87333", vibe: "Warm paper, copper" },
  { value: "dark", label: "Dark", bg: "#0a0908", text: "#FFF8EE", accent: "#D97706", vibe: "Midnight amber" },
  { value: "midnight", label: "Midnight", bg: "#0f0f1a", text: "#e8e6f0", accent: "#6366f1", vibe: "Deep blue, indigo" },
  { value: "forest", label: "Forest", bg: "#0a1208", text: "#e8f0e6", accent: "#22c55e", vibe: "Dark green, emerald" },
];

export default function Theme({ theme, onChange, onNext, onBack }: Props) {
  return (
    <>
      <div className="step-title">Pick your look</div>
      <div className="step-description">
        This is how your published pages and your world feel.
        You can change this anytime.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {presets.map((p) => (
          <div
            key={p.value}
            onClick={() => onChange(p.value)}
            style={{
              border: theme === p.value ? `2px solid ${p.accent}` : "2px solid var(--border)",
              borderRadius: 12,
              padding: 16,
              cursor: "pointer",
              background: p.bg,
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.accent }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.text, opacity: 0.3 }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.text, opacity: 0.1 }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: p.text }}>{p.label}</div>
            <div style={{ fontSize: 11, color: p.text, opacity: 0.5, marginTop: 2 }}>{p.vibe}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
        Full color customization available later through walnut:worldbuilding.
        You can make it any color you want.
      </p>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </>
  );
}
