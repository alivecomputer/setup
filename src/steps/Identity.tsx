interface Props {
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Identity({ name, onNameChange, onNext, onBack }: Props) {
  return (
    <>
      <div className="step-title">Who are you?</div>
      <div className="step-description">
        Your World knows who built it. This is how your squirrels address you.
      </div>

      <div className="input-group">
        <div className="input-label">Your name</div>
        <input
          className="input-field"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onNext()}
          autoFocus
        />
      </div>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!name.trim()}
        >
          Next
        </button>
      </div>
    </>
  );
}
