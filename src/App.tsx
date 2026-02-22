import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Welcome from "./steps/Welcome";
import Identity from "./steps/Identity";
import WhatYouDo from "./steps/WhatYouDo";
import Projects from "./steps/Projects";
import People from "./steps/People";
import Life from "./steps/Life";
import ClaudePlan from "./steps/ClaudePlan";
import Theme from "./steps/Theme";
import Location from "./steps/Location";
import Installing from "./steps/Installing";
import Complete from "./steps/Complete";

export type Step =
  | "welcome"
  | "identity"
  | "whatyoudo"
  | "projects"
  | "people"
  | "life"
  | "claudeplan"
  | "theme"
  | "location"
  | "installing"
  | "complete";

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
  mode: "builder" | "engineer" | "both";
  projects: Project[];
  people: Person[];
  lifeGoals: string;
  tools: string[];
  claudePlan: "light" | "daily" | "unlimited";
  theme: string;
  location: "icloud" | "local";
  localPath: string;
  icloudPath: string;
  homePath: string;
}

export default function App() {
  const [step, setStep] = useState<Step>("welcome");
  const [state, setState] = useState<InstallState>({
    name: "",
    mode: "builder",
    projects: [],
    people: [],
    lifeGoals: "",
    tools: [],
    claudePlan: "daily",
    theme: "light",
    location: "local",
    localPath: "",
    icloudPath: "",
    homePath: "",
  });

  const allSteps: Step[] = [
    "welcome",
    "identity",
    "whatyoudo",
    "projects",
    "people",
    "life",
    "claudeplan",
    "theme",
    "location",
    "installing",
    "complete",
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
                const icloud = await invoke<string>("get_icloud_path").catch(() => "");
                setState((s) => ({ ...s, homePath: home, icloudPath: icloud }));
              } catch {}
              setStep("identity");
            }}
          />
        )}
        {step === "identity" && (
          <Identity
            name={state.name}
            onNameChange={(name) => setState((s) => ({ ...s, name }))}
            onNext={() => setStep("whatyoudo")}
            onBack={() => setStep("welcome")}
          />
        )}
        {step === "whatyoudo" && (
          <WhatYouDo
            mode={state.mode}
            onChange={(mode) => setState((s) => ({ ...s, mode }))}
            onNext={() => setStep("projects")}
            onBack={() => setStep("identity")}
          />
        )}
        {step === "projects" && (
          <Projects
            mode={state.mode}
            projects={state.projects}
            onChange={(projects) => setState((s) => ({ ...s, projects }))}
            onNext={() => setStep("people")}
            onBack={() => setStep("whatyoudo")}
          />
        )}
        {step === "people" && (
          <People
            people={state.people}
            onChange={(people) => setState((s) => ({ ...s, people }))}
            onNext={() => setStep("life")}
            onBack={() => setStep("projects")}
          />
        )}
        {step === "life" && (
          <Life
            lifeGoals={state.lifeGoals}
            tools={state.tools}
            onChange={(updates) => setState((s) => ({ ...s, ...updates }))}
            onNext={() => setStep("claudeplan")}
            onBack={() => setStep("people")}
          />
        )}
        {step === "claudeplan" && (
          <ClaudePlan
            plan={state.claudePlan}
            onChange={(claudePlan) => setState((s) => ({ ...s, claudePlan }))}
            onNext={() => setStep("theme")}
            onBack={() => setStep("life")}
          />
        )}
        {step === "theme" && (
          <Theme
            theme={state.theme}
            onChange={(theme) => setState((s) => ({ ...s, theme }))}
            onNext={() => setStep("location")}
            onBack={() => setStep("claudeplan")}
          />
        )}
        {step === "location" && (
          <Location
            state={state}
            onChange={(updates) => setState((s) => ({ ...s, ...updates }))}
            onNext={() => setStep("installing")}
            onBack={() => setStep("life")}
          />
        )}
        {step === "installing" && (
          <Installing state={state} onComplete={() => setStep("complete")} />
        )}
        {step === "complete" && <Complete name={state.name} />}
      </div>
    </div>
  );
}
