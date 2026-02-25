import { useState } from "react";
import { Person } from "../App";

interface Props {
  people: Person[];
  onChange: (people: Person[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const RELATIONSHIPS = [
  "Partner",
  "Family",
  "Friend",
  "Cofounder",
  "Colleague",
  "Mentor",
  "Client",
  "Other",
];

export default function People({ people, onChange, onNext, onBack }: Props) {
  const [name, setName] = useState("");
  const [rel, setRel] = useState("");

  const add = () => {
    if (name.trim()) {
      onChange([
        ...people,
        { name: name.trim(), relationship: rel || "Other" },
      ]);
      setName("");
      setRel("");
    }
  };

  return (
    <>
      <div className="step-title">Who matters?</div>
      <div className="step-description">
        Partner, family, collaborators, clients — the people your squirrel
        should know about. Each one gets their own walnut in your World.
      </div>

      <div className="input-group">
        <div className="input-label">Name</div>
        <input
          className="input-field"
          type="text"
          placeholder="Ravi Patel"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              if (rel) add();
              else
                (
                  document.querySelector("#rel-select") as HTMLElement
                )?.focus();
            }
          }}
          autoFocus
        />
      </div>

      <div className="input-group">
        <div className="input-label">Relationship</div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            id="rel-select"
            className="input-field"
            value={rel}
            onChange={(e) => setRel(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">Pick one...</option>
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={add}
            style={{ flex: "none", padding: "12px 16px" }}
            disabled={!name.trim()}
          >
            +
          </button>
        </div>
      </div>

      {people.length > 0 && (
        <div style={{ marginTop: 4 }}>
          {people.map((p, i) => (
            <div key={i} className="person-row">
              <span className="person-name">{p.name}</span>
              <span className="person-rel">{p.relationship}</span>
              <button
                className="person-remove"
                onClick={() => onChange(people.filter((_, j) => j !== i))}
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
          {people.length > 0 ? "Next" : "Skip"}
        </button>
      </div>
    </>
  );
}
