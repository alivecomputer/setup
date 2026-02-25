interface Props {
  name: string;
}

export default function Handoff({ name }: Props) {
  const copyCommand = () => {
    navigator.clipboard.writeText("cd ~/world && claude");
  };

  return (
    <div className="complete-screen">
      <pre className="walnut-art" style={{ fontSize: "6px" }}>{`  .-"""-.
 /  .-.  \\
|  /   \\  |
 \\  '-'  /
  '-...-'`}</pre>
      <div className="complete-title">{name}'s World is ready.</div>
      <div className="complete-subtitle">
        One more step. Open your terminal and run:
      </div>

      <div
        style={{
          background: "#1a1715",
          borderRadius: 12,
          padding: "16px 20px",
          marginTop: 20,
          width: "100%",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={copyCommand}
      >
        <code
          style={{
            color: "#b87333",
            fontFamily: "var(--font-mono)",
            fontSize: 15,
          }}
        >
          cd ~/world && claude
        </code>
        <span
          style={{
            color: "#8a8078",
            fontSize: 11,
            position: "absolute",
            right: 16,
            top: 18,
          }}
        >
          click to copy
        </span>
      </div>

      <div className="complete-subtitle" style={{ marginTop: 20 }}>
        Your squirrel already knows your name, your projects, your people, and
        your goals.
        <br /><br />
        Type{" "}
        <code style={{ color: "#b87333" }}>walnut:world</code> to see
        everything.
        <br /><br />
        Just start talking.
      </div>
    </div>
  );
}
