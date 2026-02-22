interface Props {
  name: string;
}

export default function Complete({ name }: Props) {
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
        Open terminal and run this. Then you're just chatting.
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
        <code style={{ color: "#b87333", fontFamily: "var(--font-mono)", fontSize: 15 }}>
          cd ~/world && claude
        </code>
        <span style={{ color: "#8a8078", fontSize: 11, position: "absolute", right: 16, top: 18 }}>
          click to copy
        </span>
      </div>

      <div className="complete-subtitle" style={{ marginTop: 16 }}>
        Then type <code style={{ color: "#b87333" }}>walnut:world</code> to see everything.
        <br /><br />
        Your squirrel is waiting.
      </div>
    </div>
  );
}
