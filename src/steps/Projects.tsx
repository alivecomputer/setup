import { useState } from "react";
import { Project } from "../App";

interface Props {
  mode: "builder" | "engineer" | "both";
  projects: Project[];
  onChange: (projects: Project[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Projects({ mode, projects, onChange, onNext, onBack }: Props) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [codebasePath, setCodebasePath] = useState("");
  const [stack, setStack] = useState("");
  const [type, setType] = useState<"venture" | "experiment">("venture");

  const isEngineer = mode === "engineer" || mode === "both";

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
    }
  };

  const title = isEngineer ? "What are you working on?" : "What are you building?";
  const desc = isEngineer
    ? "Your projects, codebases, clients. Each one becomes a walnut with its own context."
    : "Your ventures and experiments. Each one gets its own walnut.";

  return (
    <>
      <div className="step-title">{title}</div>
      <div className="step-description">{desc}</div>

      <div className="input-group">
        <div className="input-label">Project name</div>
        <input
          className="input-field"
          type="text"
          placeholder={isEngineer ? "my-api" : "My Company"}
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
          placeholder={isEngineer ? "Ship the v2 API" : "Launch by Q2"}
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
              placeholder="~/code/my-project"
              value={codebasePath}
              onChange={(e) => setCodebasePath(e.target.value)}
            />
          </div>
          <div className="input-group">
            <div className="input-label">Stack (optional)</div>
            <input
              className="input-field"
              type="text"
              placeholder="TypeScript, React, PostgreSQL"
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
                {p.type}{p.stack ? ` · ${p.stack}` : ""}
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
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>
          {projects.length > 0 ? "Next" : "Skip"}
        </button>
      </div>
    </>
  );
}
