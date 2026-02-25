import { useState } from "react";
import { Project } from "../App";

interface Props {
  roles: string[];
  projects: Project[];
  onChange: (projects: Project[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function YourWork({
  roles,
  projects,
  onChange,
  onNext,
  onBack,
}: Props) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [codebasePath, setCodebasePath] = useState("");
  const [stack, setStack] = useState("");
  const [type, setType] = useState<"venture" | "experiment">("venture");

  const isEngineer = roles.includes("Engineer");

  const add = () => {
    if (name.trim()) {
      onChange([
        ...projects,
        {
          name: name.trim(),
          goal: goal.trim(),
          codebasePath: codebasePath.trim(),
          stack: stack.trim(),
          type,
        },
      ]);
      setName("");
      setGoal("");
      setCodebasePath("");
      setStack("");
      setType("venture");
    }
  };

  return (
    <>
      <div className="step-title">What are you working on?</div>
      <div className="step-description">
        Each project becomes a walnut with its own memory. Add what you're
        actively building — you can always add more later.
      </div>

      <div className="type-education">
        {roles.includes("Founder") && (
          <div className="type-edu-hint">
            Your business is a <strong>venture</strong>. Side projects you're testing are <strong>experiments</strong>.
          </div>
        )}
        {roles.includes("Engineer") && (
          <div className="type-edu-hint">
            Your job or main project is a <strong>venture</strong>. That weekend project or open source thing? <strong>Experiment</strong>.
          </div>
        )}
        {roles.includes("Creator") && (
          <div className="type-edu-hint">
            Your channel, newsletter, or client work is a <strong>venture</strong>. That format you're testing or skill you're learning? <strong>Experiment</strong>.
          </div>
        )}
        {roles.includes("Freelancer") && (
          <div className="type-edu-hint">
            Each client can be its own <strong>venture</strong>. That service you're thinking about launching but haven't yet? <strong>Experiment</strong>.
          </div>
        )}
        {roles.includes("Student") && (
          <div className="type-edu-hint">
            Your course or degree is a <strong>venture</strong> (it's an investment). That thing you're exploring on the side? <strong>Experiment</strong>.
          </div>
        )}
        {!roles.some(r => ["Founder", "Engineer", "Creator", "Freelancer", "Student"].includes(r)) && (
          <div className="type-edu-hint">
            If it pays you or you're investing in it seriously — <strong>venture</strong>. If you're just seeing what happens — <strong>experiment</strong>.
          </div>
        )}
        <div className="type-edu-row">
          <div className="type-edu-label">Venture</div>
          <div className="type-edu-desc">
            Anything that pays you — your job, business, clients, freelance work.
          </div>
        </div>
        <div className="type-edu-row">
          <div className="type-edu-label">Experiment</div>
          <div className="type-edu-desc">
            Things you're testing. No pressure to earn. Experiments can fail.
          </div>
        </div>
      </div>

      <div className="input-group">
        <div className="input-label">Project name</div>
        <input
          className="input-field"
          type="text"
          placeholder="Moonbeam Labs"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="input-group">
        <div className="input-label">One-line goal</div>
        <input
          className="input-field"
          type="text"
          placeholder="Ship the mvp by March"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>

      {isEngineer && (
        <>
          <div className="input-group">
            <div className="input-label">Codebase path (optional)</div>
            <input
              className="input-field"
              type="text"
              placeholder="~/code/moonbeam-api"
              value={codebasePath}
              onChange={(e) => setCodebasePath(e.target.value)}
            />
          </div>
          <div className="input-group">
            <div className="input-label">Stack (optional)</div>
            <input
              className="input-field"
              type="text"
              placeholder="TypeScript, Next.js, PostgreSQL"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="input-group">
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className={`tool-option ${type === "venture" ? "selected" : ""}`}
            onClick={() => setType("venture")}
          >
            Venture
          </button>
          <button
            className={`tool-option ${type === "experiment" ? "selected" : ""}`}
            onClick={() => setType("experiment")}
          >
            Experiment
          </button>
        </div>
      </div>

      <button
        className="btn btn-secondary"
        onClick={add}
        disabled={!name.trim()}
        style={{ marginBottom: 12, width: "100%" }}
      >
        + Add project
      </button>

      {projects.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {projects.map((p, i) => (
            <div key={i} className="person-row">
              <span className="person-name">{p.name}</span>
              <span className="person-rel">
                {p.type}
                {p.stack ? ` \u00b7 ${p.stack}` : ""}
              </span>
              <button
                className="person-remove"
                onClick={() => onChange(projects.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          {projects.length > 0 ? "Next" : "Skip"}
        </button>
      </div>
    </>
  );
}
