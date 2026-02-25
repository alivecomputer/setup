interface Props {
  lifeAreas: string[];
  lifeGoals: string;
  onChange: (updates: { lifeAreas?: string[]; lifeGoals?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const AREAS = [
  { id: "health", label: "Health", hint: "Fitness, sleep, nutrition, mental health" },
  { id: "finance", label: "Finance", hint: "Savings, debt, investments, income" },
  { id: "relationships", label: "Relationships", hint: "Partner, family, friendships" },
  { id: "growth", label: "Growth", hint: "Learning, skills, career development" },
  { id: "home", label: "Home", hint: "Living situation, environment, routines" },
  { id: "other", label: "Other", hint: "Anything else that matters to you" },
];

export default function Life({
  lifeAreas,
  lifeGoals,
  onChange,
  onNext,
  onBack,
}: Props) {
  const toggleArea = (id: string) => {
    if (lifeAreas.includes(id)) {
      onChange({ lifeAreas: lifeAreas.filter((a) => a !== id) });
    } else {
      onChange({ lifeAreas: [...lifeAreas, id] });
    }
  };

  return (
    <>
      <div className="step-title">Beyond work</div>
      <div className="step-description">
        Life is the foundation. Ventures and experiments serve life goals — not
        the other way around. What areas do you want your World to track?
      </div>

      <div className="input-group">
        <div className="input-label">Life areas</div>
        <div className="life-areas">
          {AREAS.map((area) => (
            <label
              key={area.id}
              className={`life-area-option ${
                lifeAreas.includes(area.id) ? "selected" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={lifeAreas.includes(area.id)}
                onChange={() => toggleArea(area.id)}
                style={{ display: "none" }}
              />
              <div className="life-area-check">
                {lifeAreas.includes(area.id) && (
                  <span style={{ fontSize: 12, lineHeight: 1 }}>&#10003;</span>
                )}
              </div>
              <div>
                <div className="life-area-label">{area.label}</div>
                <div className="life-area-hint">{area.hint}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="input-group">
        <div className="input-label">What are you building toward?</div>
        <textarea
          className="input-field"
          placeholder="Run a marathon in October. Pay off student loans by December. Move to Portland. Read 40 books this year. Be more present with the people I love."
          value={lifeGoals}
          onChange={(e) => onChange({ lifeGoals: e.target.value })}
          rows={3}
          style={{ resize: "vertical" }}
        />
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          Your squirrel reads this to understand the bigger picture. It shapes
          how it prioritizes and what it surfaces.
        </p>
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </>
  );
}
