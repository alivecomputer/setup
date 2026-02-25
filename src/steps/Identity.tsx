interface Props {
  name: string;
  roles: string[];
  onNameChange: (name: string) => void;
  onRolesChange: (roles: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ROLES = [
  "Founder",
  "Creator",
  "Engineer",
  "Freelancer",
  "Designer",
  "Operator",
  "Student",
  "Other",
];

export default function Identity({
  name,
  roles,
  onNameChange,
  onRolesChange,
  onNext,
  onBack,
}: Props) {
  const toggleRole = (role: string) => {
    if (roles.includes(role)) {
      onRolesChange(roles.filter((r) => r !== role));
    } else {
      onRolesChange([...roles, role]);
    }
  };

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

      <div className="input-group">
        <div className="input-label">What describes you? (pick all that fit)</div>
        <div className="role-chips">
          {ROLES.map((role) => (
            <button
              key={role}
              className={`role-chip ${roles.includes(role) ? "selected" : ""}`}
              onClick={() => toggleRole(role)}
            >
              {role}
            </button>
          ))}
        </div>
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
