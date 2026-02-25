interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function WhatsAWorld({ onNext, onBack }: Props) {
  return (
    <>
      <div className="step-title">What's a World?</div>

      <div className="world-panels">
        <div className="world-panel">
          <div className="world-panel-icon">?</div>
          <div className="world-panel-label">The problem</div>
          <div className="world-panel-text">
            Every conversation with AI starts from zero. You explain the same
            projects, the same people, the same decisions — session after session.
            The smartest tool you've ever used has the memory of a goldfish.
          </div>
        </div>

        <div className="world-panel">
          <div className="world-panel-icon">/</div>
          <div className="world-panel-label">The solution</div>
          <div className="world-panel-text">
            A World is a folder on your machine. Your projects, your people, your
            knowledge — in simple files that any AI can read. When you start a
            session, it reads your files first. It knows you.
          </div>
        </div>

        <div className="world-panel">
          <div className="world-panel-icon">5</div>
          <div className="world-panel-label">How it works</div>
          <div className="world-panel-text">Five domains. One system.</div>
          <div className="alive-domains">
            <div className="alive-domain">
              <span className="alive-letter">A</span>
              <span className="alive-word">Archive</span>
              <span className="alive-desc">Where completed things rest</span>
            </div>
            <div className="alive-domain">
              <span className="alive-letter">L</span>
              <span className="alive-word">Life</span>
              <span className="alive-desc">Your foundation — health, money, relationships</span>
            </div>
            <div className="alive-domain">
              <span className="alive-letter">I</span>
              <span className="alive-word">Inputs</span>
              <span className="alive-desc">Things to process — emails, notes, transcripts</span>
            </div>
            <div className="alive-domain">
              <span className="alive-letter">V</span>
              <span className="alive-word">Ventures</span>
              <span className="alive-desc">Anything that pays you — job, business, clients</span>
            </div>
            <div className="alive-domain">
              <span className="alive-letter">E</span>
              <span className="alive-word">Experiments</span>
              <span className="alive-desc">Things you're testing — no pressure to earn</span>
            </div>
          </div>
        </div>

        <div className="world-panel">
          <div className="world-panel-icon">🐿️</div>
          <div className="world-panel-label">The squirrel</div>
          <div className="world-panel-text">
            The Squirrel is the caretaker. It runs inside every session — reading
            your context, stashing decisions, routing what matters. Take your walnut
            to Claude Code, Cursor, Replit — the squirrel adapts. Your context isn't
            rented. It's not stored on anyone's server. It's files on your machine.
            Yours today. Yours in 2036.
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Build mine
        </button>
      </div>
    </>
  );
}
