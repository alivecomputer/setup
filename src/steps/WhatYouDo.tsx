interface Props {
  mode: "builder" | "engineer" | "both";
  onChange: (mode: "builder" | "engineer" | "both") => void;
  onNext: () => void;
  onBack: () => void;
}

const options: { value: "builder" | "engineer" | "both"; label: string; desc: string }[] = [
  {
    value: "builder",
    label: "I'm building something",
    desc: "A business, a product, a creative project. You want to track decisions, people, and progress.",
  },
  {
    value: "engineer",
    label: "I'm an engineer",
    desc: "You have codebases. You want AI sessions that know your architecture, your team, and your decisions across projects.",
  },
  {
    value: "both",
    label: "Both",
    desc: "You build products AND write code. Most founders and technical creators.",
  },
];

export default function WhatYouDo({ mode, onChange, onNext, onBack }: Props) {
  return (
    <>
      <div className="step-title">What do you do?</div>
      <div className="step-description">
        This shapes how your World gets set up. You can change it later.
      </div>

      {options.map((opt) => (
        <div
          key={opt.value}
          className={`location-option ${mode === opt.value ? "selected" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          <div className="location-dot" />
          <div>
            <div className="location-name">{opt.label}</div>
            <div className="location-path" style={{ fontFamily: "var(--font)", fontSize: 12 }}>
              {opt.desc}
            </div>
          </div>
        </div>
      ))}

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </>
  );
}
