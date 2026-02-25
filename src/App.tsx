import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Welcome from "./steps/Welcome";
import WhatsAWorld from "./steps/WhatsAWorld";
import Identity from "./steps/Identity";
import YourWork from "./steps/YourWork";
import WhatsUp from "./steps/WhatsUp";
import People from "./steps/People";
import Life from "./steps/Life";
import Sources from "./steps/Sources";
import Preferences from "./steps/Preferences";
import Building from "./steps/Building";
import Handoff from "./steps/Handoff";

export type Step =
  | "welcome"
  | "whatsaworld"
  | "identity"
  | "yourwork"
  | "whatsup"
  | "people"
  | "life"
  | "sources"
  | "preferences"
  | "building"
  | "handoff";

export interface Person {
  name: string;
  relationship: string;
}

export interface Project {
  name: string;
  goal: string;
  codebasePath: string;
  stack: string;
  type: "venture" | "experiment";
}

export interface InstallState {
  name: string;
  roles: string[];
  projects: Project[];
  focusProject: string;
  focusTask: string;
  people: Person[];
  lifeAreas: string[];
  lifeGoals: string;
  contextSources: string[];
  theme: string;
  worldPath: string;
  homePath: string;
}

export default function App() {
  const [step, setStep] = useState<Step>("welcome");
  const [state, setState] = useState<InstallState>({
    name: "",
    roles: [],
    projects: [],
    focusProject: "",
    focusTask: "",
    people: [],
    lifeAreas: [],
    lifeGoals: "",
    contextSources: [],
    theme: "light",
    worldPath: "",
    homePath: "",
  });

  const allSteps: Step[] = [
    "welcome",
    "whatsaworld",
    "identity",
    "yourwork",
    "whatsup",
    "people",
    "life",
    "sources",
    "preferences",
    "building",
    "handoff",
  ];
  const stepIndex = allSteps.indexOf(step);

  return (
    <div className="app">
      <div className="header">
        {step === "welcome" && (
          <pre className="walnut-art">{`  .-"""-.
 /  .-.  \\
|  /   \\  |
 \\  '-'  /
  '-...-'`}</pre>
        )}
        <div className="title">Walnut</div>
        <div className="subtitle">Build Your World</div>
      </div>

      <div className="progress-bar">
        {allSteps.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === stepIndex ? "active" : ""} ${
              i < stepIndex ? "done" : ""
            }`}
          />
        ))}
      </div>

      <div className="content">
        {step === "welcome" && (
          <Welcome
            onNext={async () => {
              try {
                const home = await invoke<string>("get_home_dir");
                setState((s) => ({ ...s, homePath: home }));
              } catch {}
              setStep("whatsaworld");
            }}
          />
        )}
        {step === "whatsaworld" && (
          <WhatsAWorld
            onNext={() => setStep("identity")}
            onBack={() => setStep("welcome")}
          />
        )}
        {step === "identity" && (
          <Identity
            name={state.name}
            roles={state.roles}
            onNameChange={(name) => setState((s) => ({ ...s, name }))}
            onRolesChange={(roles) => setState((s) => ({ ...s, roles }))}
            onNext={() => setStep("yourwork")}
            onBack={() => setStep("whatsaworld")}
          />
        )}
        {step === "yourwork" && (
          <YourWork
            roles={state.roles}
            projects={state.projects}
            onChange={(projects) => setState((s) => ({ ...s, projects }))}
            onNext={() => setStep("whatsup")}
            onBack={() => setStep("identity")}
          />
        )}
        {step === "whatsup" && (
          <WhatsUp
            projects={state.projects}
            focusProject={state.focusProject}
            focusTask={state.focusTask}
            onChange={(updates) => setState((s) => ({ ...s, ...updates }))}
            onNext={() => setStep("people")}
            onBack={() => setStep("yourwork")}
          />
        )}
        {step === "people" && (
          <People
            people={state.people}
            onChange={(people) => setState((s) => ({ ...s, people }))}
            onNext={() => setStep("life")}
            onBack={() => setStep("whatsup")}
          />
        )}
        {step === "life" && (
          <Life
            lifeAreas={state.lifeAreas}
            lifeGoals={state.lifeGoals}
            onChange={(updates) => setState((s) => ({ ...s, ...updates }))}
            onNext={() => setStep("sources")}
            onBack={() => setStep("people")}
          />
        )}
        {step === "sources" && (
          <Sources
            contextSources={state.contextSources}
            onChange={(contextSources) =>
              setState((s) => ({ ...s, contextSources }))
            }
            onNext={() => setStep("preferences")}
            onBack={() => setStep("life")}
          />
        )}
        {step === "preferences" && (
          <Preferences
            theme={state.theme}
            worldPath={state.worldPath}
            homePath={state.homePath}
            onThemeChange={(theme) => setState((s) => ({ ...s, theme }))}
            onWorldPathChange={(worldPath) =>
              setState((s) => ({ ...s, worldPath }))
            }
            onNext={() => setStep("building")}
            onBack={() => setStep("sources")}
          />
        )}
        {step === "building" && (
          <Building state={state} onComplete={() => setStep("handoff")} />
        )}
        {step === "handoff" && <Handoff name={state.name} />}
      </div>
    </div>
  );
}
