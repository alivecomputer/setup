import { Project } from "../App";

interface Props {
  projects: Project[];
  focusProject: string;
  focusTask: string;
  onChange: (updates: { focusProject?: string; focusTask?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function WhatsUp({
  projects,
  focusProject,
  focusTask,
  onChange,
  onNext,
  onBack,
}: Props) {
  const hasProjects = projects.length > 0;
  const selected = focusProject || (projects.length === 1 ? projects[0].name : "");

  return (
    <>
      <div className="step-title">What's first?</div>
      <div className="step-description">
        Your squirrel needs one thing to start: what you're doing next.
      </div>

      {hasProjects && projects.length > 1 && (
        <div className="input-group">
          <div className="input-label">Which one needs you first?</div>
          <div className="focus-options">
            {projects.map((p) => (
              <div
                key={p.name}
                className={`location-option ${
                  focusProject === p.name ? "selected" : ""
                }`}
                onClick={() => onChange({ focusProject: p.name })}
              >
                <div className="location-dot" />
                <div>
                  <div className="location-name">{p.name}</div>
                  {p.goal && (
                    <div
                      className="location-path"
                      style={{ fontFamily: "var(--font)", fontSize: 12 }}
                    >
                      {p.goal}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasProjects && projects.length === 1 && (
        <div className="input-group">
          <div className="input-label">Your focus</div>
          <div
            className="location-option selected"
            style={{ cursor: "default" }}
          >
            <div className="location-dot" />
            <div>
              <div className="location-name">{projects[0].name}</div>
            </div>
          </div>
        </div>
      )}

      <div className="input-group">
        <div className="input-label">
          {selected
            ? `What's the next thing you need to do with ${selected}?`
            : "What's the next thing you need to do?"}
        </div>
        <input
          className="input-field"
          type="text"
          placeholder="e.g., Reply to the client brief, finish the landing page, review the Q1 numbers"
          value={focusTask}
          onChange={(e) => onChange({ focusTask: e.target.value })}
          autoFocus={!hasProjects || projects.length <= 1}
        />
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          This becomes the first thing your squirrel reads when you open a session.
          Be specific. "Ship the landing page" beats "work on the website."
        </p>
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          {focusTask.trim() ? "Next" : "Skip"}
        </button>
      </div>
    </>
  );
}
