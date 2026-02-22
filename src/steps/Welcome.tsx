interface Props {
  onNext: () => void;
}

export default function Welcome({ onNext }: Props) {
  return (
    <>
      <div className="step-title">Your alive computer starts here.</div>
      <div className="step-description">
        Walnut creates a context system on your machine. Your decisions, your
        people, your projects — in files you own forever. Every conversation
        with AI compounds what came before.
        <br /><br />
        This takes about 2 minutes. After that, you have a World.
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={onNext}>
          Let's go
        </button>
      </div>
    </>
  );
}
