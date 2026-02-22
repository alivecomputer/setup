interface Props {
  plan: "light" | "daily" | "unlimited";
  onChange: (plan: "light" | "daily" | "unlimited") => void;
  onNext: () => void;
  onBack: () => void;
}

const plans: {
  value: "light" | "daily" | "unlimited";
  label: string;
  price: string;
  desc: string;
  rec?: boolean;
}[] = [
  {
    value: "light",
    label: "Claude Pro",
    price: "$20/mo",
    desc: "Good for getting started. A few sessions a day. You'll know when you need more.",
  },
  {
    value: "daily",
    label: "Claude Max 5x",
    price: "$100/mo",
    desc: "For daily use. Most worldbuilders land here. Enough for multiple sessions and deep work.",
    rec: true,
  },
  {
    value: "unlimited",
    label: "Claude Max 20x",
    price: "$200/mo",
    desc: "Fully unlimited. For engineers, founders, and people who live in their World all day.",
  },
];

export default function ClaudePlan({ plan, onChange, onNext, onBack }: Props) {
  return (
    <>
      <div className="step-title">Claude account</div>
      <div className="step-description">
        Walnut runs on Claude Code, which needs an Anthropic account.
        You'll log in via browser when you first open it — takes 30 seconds.
        Here's what we recommend based on how much you'll use it.
      </div>

      {plans.map((p) => (
        <div
          key={p.value}
          className={`location-option ${plan === p.value ? "selected" : ""}`}
          onClick={() => onChange(p.value)}
          style={{ position: "relative" }}
        >
          <div className="location-dot" />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="location-name">
                {p.label}
                {p.rec && (
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
                )}
              </div>
              <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
                {p.price}
              </span>
            </div>
            <div className="location-path" style={{ fontFamily: "var(--font)", fontSize: 12, marginTop: 2 }}>
              {p.desc}
            </div>
          </div>
        </div>
      ))}

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
        Don't have an account yet? You'll create one when Claude Code opens.
        It walks you through it. No credit card needed for the free tier.
      </p>

      <a
        href="https://console.anthropic.com"
        target="_blank"
        rel="noopener"
        style={{
          display: "block",
          textAlign: "center",
          fontSize: 12,
          color: "var(--accent)",
          marginTop: 8,
          textDecoration: "none",
        }}
      >
        Create an Anthropic account →
      </a>

      <div className="actions">
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next</button>
      </div>
    </>
  );
}
