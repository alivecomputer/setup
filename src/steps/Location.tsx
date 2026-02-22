import { InstallState } from "../App";

interface Props {
  state: InstallState;
  onChange: (updates: Partial<InstallState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Location({ state, onChange, onNext, onBack }: Props) {
  const hasIcloud = !!state.icloudPath;

  return (
    <>
      <div className="step-title">Where should your World live?</div>
      <div className="step-description">
        Your World is a folder of files on your machine. Local is fastest.
        iCloud syncs across Macs but can be slower.
      </div>

      <div
        className={`location-option ${state.location === "local" ? "selected" : ""}`}
        onClick={() => onChange({ location: "local" })}
      >
        <div className="location-dot" />
        <div>
          <div className="location-name">
            Local
            <span
              style={{
                fontSize: 10,
                background: "rgba(184, 115, 51, 0.1)",
                color: "var(--accent)",
                padding: "2px 8px",
                borderRadius: 10,
                marginLeft: 8,
              }}
            >
              recommended
            </span>
          </div>
          <div className="location-path">~/world — fast, first principles</div>
        </div>
      </div>

      {hasIcloud && (
        <div
          className={`location-option ${state.location === "icloud" ? "selected" : ""}`}
          onClick={() => onChange({ location: "icloud" })}
        >
          <div className="location-dot" />
          <div>
            <div className="location-name">iCloud Drive</div>
            <div className="location-path">syncs across Macs — can be slower</div>
          </div>
        </div>
      )}

      {state.location === "local" && (
        <div className="input-group" style={{ marginTop: 12 }}>
          <div className="input-label">Folder path</div>
          <input
            className="input-field"
            type="text"
            placeholder={`${state.homePath}/world`}
            value={state.localPath}
            onChange={(e) => onChange({ localPath: e.target.value })}
          />
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Leave blank for ~/world
          </p>
        </div>
      )}

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Build My World</button>
      </div>
    </>
  );
}
