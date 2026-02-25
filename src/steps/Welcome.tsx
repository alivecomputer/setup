import walnutIcon from "../assets/walnut-icon.svg";
import walnutWordmark from "../assets/walnut-wordmark.svg";

interface Props {
  onNext: () => void;
}

export default function Welcome({ onNext }: Props) {
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img
          src={walnutIcon}
          alt="Walnut"
          style={{ width: 80, height: 80, marginBottom: 16 }}
        />
        <img
          src={walnutWordmark}
          alt="Walnut"
          style={{ display: "block", margin: "0 auto", height: 28 }}
        />
      </div>

      <div className="step-title" style={{ textAlign: "center" }}>
        Build Your World
      </div>
      <div className="step-description" style={{ textAlign: "center" }}>
        Your context. Your files. Memory that compounds.
        <br /><br />
        This takes about 3 minutes. After that, you have a World.
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={onNext}>
          Let's go
        </button>
      </div>
    </>
  );
}
