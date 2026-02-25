"use client";

import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { InstallState } from "../App";

interface Props {
  state: InstallState;
  onComplete: () => void;
}

interface LogEntry {
  text: string;
  status:
    | "active"
    | "success"
    | "skip"
    | "error"
    | "info"
    | "explain"
    | "command";
}

export default function Building({ state, onComplete }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(true);
  const [allCommands, setAllCommands] = useState<string[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [phase, setPhase] = useState("Checking system...");
  const logRef = useRef<HTMLDivElement>(null);

  const log = (text: string, status: LogEntry["status"] = "info") => {
    setLogs((prev) => [...prev, { text, status }]);
    setTimeout(
      () => logRef.current?.scrollTo(0, logRef.current.scrollHeight),
      50
    );
  };

  const addCommand = (cmd: string) => {
    setAllCommands((prev) => [...prev, cmd]);
  };

  const checkCmd = async (cmd: string): Promise<boolean> => {
    try {
      await invoke<string>("check_command", { cmd });
      return true;
    } catch {
      return false;
    }
  };

  const tryOrFallback = async (
    label: string,
    explain: string,
    action: () => Promise<void>,
    fallbackCmd: string
  ) => {
    log(label, "active");
    log(explain, "explain");
    try {
      await action();
      log("done", "success");
    } catch {
      log(`couldn't do this automatically — copy this command instead:`, "skip");
      log(fallbackCmd, "command");
      addCommand(fallbackCmd);
      setHasErrors(true);
    }
  };

  useEffect(() => {
    const install = async () => {
      const home = state.homePath;
      const commands: string[] = [];

      // ── Phase 1: System checks ──────────────
      setPhase("Checking system...");

      log("checking homebrew...", "active");
      log(
        "homebrew installs developer tools on your mac. most developers have it.",
        "explain"
      );
      if (await checkCmd("brew")) {
        log("homebrew found", "success");
      } else {
        log("homebrew not installed. paste this into terminal:", "skip");
        const cmd =
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"';
        log(cmd, "command");
        addCommand(cmd);
        commands.push(cmd);
      }

      log("checking node.js...", "active");
      log(
        "node.js runs javascript. claude code needs it to work.",
        "explain"
      );
      if (await checkCmd("node")) {
        log("node found", "success");
      } else if (await checkCmd("brew")) {
        try {
          await invoke<string>("run_command", {
            cmd: "brew",
            args: ["install", "node"],
          });
          log("node installed", "success");
        } catch {
          const cmd = "brew install node";
          log("install failed. paste this into terminal:", "skip");
          log(cmd, "command");
          addCommand(cmd);
          commands.push(cmd);
        }
      } else {
        const cmd = "brew install node";
        log("needs homebrew first. after installing homebrew, run:", "skip");
        log(cmd, "command");
        addCommand(cmd);
        commands.push(cmd);
      }

      log("checking claude code...", "active");
      log(
        "claude code is the AI you'll talk to. it runs in terminal and remembers everything.",
        "explain"
      );
      if (await checkCmd("claude")) {
        log("claude code found", "success");
      } else if (await checkCmd("npm")) {
        try {
          await invoke<string>("run_command", {
            cmd: "npm",
            args: ["install", "-g", "@anthropic-ai/claude-code"],
          });
          log("claude code installed", "success");
        } catch {
          const cmd = "npm install -g @anthropic-ai/claude-code";
          log("install failed. paste this into terminal:", "skip");
          log(cmd, "command");
          addCommand(cmd);
          commands.push(cmd);
        }
      } else {
        const cmd = "npm install -g @anthropic-ai/claude-code";
        log("needs node first. after installing node, run:", "skip");
        log(cmd, "command");
        addCommand(cmd);
        commands.push(cmd);
      }

      // ── Phase 2: Create World ──────────────
      setPhase("Creating your World...");

      const worldPath = state.worldPath || `${home}/world`;

      await tryOrFallback(
        "creating ALIVE folders...",
        "five domains: archive, life, inputs, ventures, experiments",
        async () => {
          await invoke("create_dirs", {
            paths: [
              `${worldPath}/01_Archive`,
              `${worldPath}/02_Life/people`,
              `${worldPath}/03_Inputs`,
              `${worldPath}/04_Ventures`,
              `${worldPath}/05_Experiments`,
              `${worldPath}/.claude/rules`,
            ],
          });
        },
        `mkdir -p "${worldPath}"/{01_Archive,02_Life/people,03_Inputs,04_Ventures,05_Experiments,.claude/rules}`
      );

      // ~/world symlink
      if (worldPath !== `${home}/world`) {
        await tryOrFallback(
          "creating ~/world shortcut...",
          `~/world will point to ${worldPath}`,
          async () => {
            await invoke<boolean>("create_symlink", {
              target: worldPath,
              link: `${home}/world`,
            });
          },
          `ln -s "${worldPath}" ~/world`
        );
      }

      // ── Phase 3: Core files ──────────────
      setPhase("Writing core files...");

      const year = new Date().getFullYear();
      const now = new Date().toISOString().split(".")[0];
      const today = new Date().toISOString().split("T")[0];

      // .claude/CLAUDE.md
      const sourcesList =
        state.contextSources.length > 0
          ? state.contextSources
              .map((t) => `| ${t} | Available |`)
              .join("\n")
          : "";
      const contextSection = sourcesList
        ? `\n---\n\n## Context Sources\n\n| Source | Status |\n|--------|--------|\n${sourcesList}\n`
        : "";
      const rolesLine =
        state.roles.length > 0
          ? `**Roles:** ${state.roles.join(", ")}\n`
          : "";
      const lifeSection = state.lifeGoals
        ? `\n---\n\n## Notes\n\n${state.lifeGoals}\n`
        : "";

      await tryOrFallback(
        "writing CLAUDE.md...",
        "this tells every squirrel who you are",
        async () => {
          const claudeMd = `# ${state.name}'s World

**Build Your World.**

You are a Squirrel — one Claude session inside a worldbuilder's World. You read, you work, you close. The World belongs to the worldbuilder. You are here to help them build it.

---

## Who

**Worldbuilder:** ${state.name}
**Started:** ${year}
${rolesLine}${contextSection}${lifeSection}
---

**Version:** 0.1.0 Walnut
`;
          const wrote = await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/.claude/CLAUDE.md`,
            content: claudeMd,
          });
          if (!wrote) log("CLAUDE.md already exists — kept yours", "skip");

          // Multi-agent compatibility
          log("setting up multi-agent compatibility...", "active");
          log("one identity, every AI tool reads it", "explain");

          const agentFiles: [string, string][] = [
            [`${worldPath}/AGENTS.md`, "Zed, GitHub Copilot"],
            [`${worldPath}/.cursorrules`, "Cursor"],
            [`${worldPath}/.windsurfrules`, "Windsurf"],
          ];

          for (const [filePath] of agentFiles) {
            try {
              await invoke<boolean>("create_symlink", {
                target: `${worldPath}/.claude/CLAUDE.md`,
                link: filePath,
              });
            } catch {
              try {
                await invoke<boolean>("write_file_if_missing", {
                  path: filePath,
                  content: claudeMd,
                });
              } catch {}
            }
          }
          log("AGENTS.md, .cursorrules, .windsurfrules created", "success");
        },
        `# create manually in ${worldPath}/.claude/CLAUDE.md`
      );

      // .claude/settings.json
      await tryOrFallback(
        "writing settings.json...",
        "claude code configuration",
        async () => {
          await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/.claude/settings.json`,
            content: JSON.stringify(
              {
                permissions: {
                  allow: [
                    "Read",
                    "Write",
                    "Edit",
                    "Bash(ls:*)",
                    "Bash(cat:*)",
                    "Bash(mkdir:*)",
                  ],
                  deny: [],
                },
              },
              null,
              2
            ),
          });
        },
        `# create manually in ${worldPath}/.claude/settings.json`
      );

      // .claude/preferences.yaml
      const syncConfig =
        state.contextSources.length > 0
          ? `\nsync:\n${state.contextSources.map((t) => `  ${t.toLowerCase().replace(/\s+/g, "-")}: available`).join("\n")}\n`
          : "\nsync: {}\n";

      await tryOrFallback(
        "writing preferences.yaml...",
        "your customization file — edit anytime",
        async () => {
          await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/.claude/preferences.yaml`,
            content: `# Walnut Preferences
# Uncomment to override defaults.

theme: ${state.theme}
${syncConfig}`,
          });
        },
        `# create preferences at ${worldPath}/.claude/preferences.yaml`
      );

      // .claude/world-config.yaml
      await tryOrFallback(
        "writing world-config.yaml...",
        "world-level settings your squirrel reads on open",
        async () => {
          const lifeAreasYaml =
            state.lifeAreas.length > 0
              ? state.lifeAreas.map((a) => `  - ${a}`).join("\n")
              : "  []";
          await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/.claude/world-config.yaml`,
            content: `# World Config
worldbuilder: ${state.name}
version: 0.1.0
created: ${today}

life_areas:
${lifeAreasYaml}

theme: ${state.theme}
`,
          });
        },
        `# create world-config at ${worldPath}/.claude/world-config.yaml`
      );

      // ── Phase 4: Walnuts ──────────────
      setPhase("Creating walnuts...");

      // Life walnut
      await tryOrFallback(
        "creating life walnut...",
        "the foundation — everything else serves this",
        async () => {
          const lPath = `${worldPath}/02_Life`;
          await invoke("create_dirs", {
            paths: [
              `${lPath}/_core`,
              `${lPath}/_squirrels`,
              `${lPath}/_working`,
              `${lPath}/_references`,
            ],
          });
          await invoke<boolean>("write_file_if_missing", {
            path: `${lPath}/_core/key.md`,
            content: `---
type: life
goal: ${state.lifeGoals.split("\n")[0] || "Build the life that supports everything else"}
created: ${year}
rhythm: weekly
people: []
tags: [${state.lifeAreas.map((a) => `"${a}"`).join(", ")}]
---

${state.name}'s life. The foundation.
`,
          });
          await invoke<boolean>("write_file_if_missing", {
            path: `${lPath}/_core/now.md`,
            content: `---
phase: active
health: active
updated: ${now}
next: ${state.focusTask || "set up your world"}
squirrel: installer
links: []
---

## Open

- [ ] Bring in context from existing tools
`,
          });
          await invoke<boolean>("write_file_if_missing", {
            path: `${lPath}/_core/log.md`,
            content: `---
walnut: life
created: ${today}
last-entry: ${now}
entry-count: 1
summary: World created.
---

## ${now} — squirrel:installer

World created. Life walnut initialized.${state.lifeGoals ? `\nGoals: ${state.lifeGoals.split("\n")[0]}` : ""}

signed: squirrel:installer
`,
          });
          await invoke<boolean>("write_file_if_missing", {
            path: `${lPath}/_core/insights.md`,
            content: `---
walnut: life
created: ${today}
---

Insights surface here over time. Your squirrel adds patterns, observations, and
things worth remembering that don't fit in the log.
`,
          });
          await invoke<boolean>("write_file_if_missing", {
            path: `${lPath}/_core/tasks.md`,
            content: `---
walnut: life
created: ${today}
---

## Active

- [ ] Set up your World
- [ ] Bring in context from existing tools
`,
          });
        },
        `# life walnut at ${worldPath}/02_Life/`
      );

      // Project walnuts
      for (const project of state.projects) {
        const slug = project.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-$/, "");
        const domain =
          project.type === "venture" ? "04_Ventures" : "05_Experiments";
        const pPath = `${worldPath}/${domain}/${slug}`;
        const codebaseField = project.codebasePath
          ? `\ncodebase: ${project.codebasePath}`
          : "";
        const stackField = project.stack
          ? `\nstack: [${project.stack}]`
          : "";
        const isFocus = state.focusProject === project.name;

        await tryOrFallback(
          `creating ${project.type}: ${project.name}...`,
          project.goal || project.name,
          async () => {
            await invoke("create_dirs", {
              paths: [
                `${pPath}/_core`,
                `${pPath}/_squirrels`,
                `${pPath}/_working`,
                `${pPath}/_references`,
              ],
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/key.md`,
              content: `---
type: ${project.type}
goal: ${project.goal || project.name}
created: ${year}
rhythm: weekly
people: []
tags: []${codebaseField}${stackField}
---

${project.name}.
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/now.md`,
              content: `---
phase: starting
health: active
updated: ${now}
next: ${isFocus && state.focusTask ? state.focusTask : "define first milestone"}
squirrel: installer
links: []
---

## Open

- [ ] ${isFocus && state.focusTask ? state.focusTask : "Define first milestone"}
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/log.md`,
              content: `---
walnut: ${slug}
created: ${today}
last-entry: ${now}
entry-count: 1
summary: Walnut created during world setup.
---

## ${now} — squirrel:installer

Walnut created. Goal: ${project.goal || project.name}.${project.codebasePath ? `\nCodebase: ${project.codebasePath}` : ""}${project.stack ? `\nStack: ${project.stack}` : ""}

signed: squirrel:installer
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/insights.md`,
              content: `---
walnut: ${slug}
created: ${today}
---

Insights surface here over time.
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/tasks.md`,
              content: `---
walnut: ${slug}
created: ${today}
---

## Active

- [ ] ${isFocus && state.focusTask ? state.focusTask : "Define first milestone"}
`,
            });

            // AGENTS.md in codebase
            if (project.codebasePath) {
              const agentsContent = `# ${project.name}\n\nProject context: ~/world/${domain}/${slug}/\nRead _core/key.md for architecture decisions, team context, and session history.\n\n---\n\nGoal: ${project.goal || project.name}\n${project.stack ? `Stack: ${project.stack}\n` : ""}`;
              try {
                await invoke<boolean>("write_file_if_missing", {
                  path: `${project.codebasePath}/AGENTS.md`,
                  content: agentsContent,
                });
                log(
                  `  AGENTS.md written to ${project.codebasePath}`,
                  "success"
                );
              } catch {
                log(
                  `  couldn't write AGENTS.md to codebase — do it manually`,
                  "skip"
                );
              }
            }
          },
          `# ${project.type} at ${pPath}/`
        );
      }

      // People walnuts
      for (const person of state.people) {
        const slug = person.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-$/, "");
        await tryOrFallback(
          `creating person: ${person.name}...`,
          person.relationship,
          async () => {
            const pPath = `${worldPath}/02_Life/people/${slug}`;
            await invoke("create_dirs", {
              paths: [
                `${pPath}/_core`,
                `${pPath}/_squirrels`,
              ],
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/key.md`,
              content: `---
type: person
goal: ${person.relationship}
created: ${year}
people: []
tags: [${person.relationship.toLowerCase()}]
---

${person.name}. ${person.relationship}.
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/now.md`,
              content: `---
phase: active
updated: ${now}
next: add context
squirrel: installer
links: []
---
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/log.md`,
              content: `---
walnut: ${slug}
created: ${today}
last-entry: ${now}
entry-count: 1
summary: Person walnut created.
---

## ${now} — squirrel:installer

Person walnut created. Relationship: ${person.relationship}.

signed: squirrel:installer
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/insights.md`,
              content: `---
walnut: ${slug}
created: ${today}
---

What you know about ${person.name} surfaces here over time.
`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/_core/tasks.md`,
              content: `---
walnut: ${slug}
created: ${today}
---

## Active

- [ ] Add context about ${person.name}
`,
            });
          },
          `# person at ${worldPath}/02_Life/people/${slug}/`
        );
      }

      // ── Phase 5: Plugin ──────────────
      setPhase("Final steps...");

      log("walnut plugin...", "active");
      log("the plugin adds skills and hooks to claude code", "explain");
      const pluginCmd = "claude plugin install alivecomputer/walnut";
      log("run this in terminal after claude code is installed:", "skip");
      log(pluginCmd, "command");
      addCommand(pluginCmd);
      commands.push(pluginCmd);

      // ── Education panel ──────────────
      log("", "info");
      log("what's inside each walnut:", "info");
      log("  _core/key.md     — what it is (people, specs, evergreen)", "explain");
      log("  _core/now.md     — where it is right now (phase, next action)", "explain");
      log("  _core/log.md     — where it's been (signed entries, prepend-only)", "explain");
      log("  _core/insights.md — patterns and observations over time", "explain");
      log("  _core/tasks.md   — active and completed tasks", "explain");
      log("  _squirrels/      — session entries (yaml)", "explain");
      log("  _working/        — drafts, saves, work in progress", "explain");
      log("  _references/     — source material, attachments", "explain");

      // ── Summary ──────────────
      log("", "info");
      const created: string[] = ["02_Life"];
      state.projects.forEach((p) => {
        const domain =
          p.type === "venture" ? "04_Ventures" : "05_Experiments";
        created.push(
          `${domain}/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        );
      });
      state.people.forEach((p) =>
        created.push(
          `people/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        )
      );

      log(
        `${created.length} walnut${created.length !== 1 ? "s" : ""} created:`,
        "success"
      );
      created.forEach((w) => log(`  ${w}`, "success"));

      log("", "info");
      const launchCmd = "cd ~/world && claude";
      addCommand(launchCmd);
      commands.push(launchCmd);

      log("last step — open terminal and run:", "info");
      log(launchCmd, "command");
      log("", "info");
      log("your squirrel already knows your name, your projects,", "success");
      log("your people, and your goals. just start talking.", "success");

      setPhase("Done");
      setRunning(false);
    };

    install();
  }, []);

  const copyAll = () => {
    navigator.clipboard.writeText(allCommands.join("\n"));
  };

  return (
    <>
      <div className="step-title">
        {running ? phase : "Here's what to do"}
      </div>
      <div className="step-description">
        {running
          ? "Checking your system and building your World."
          : hasErrors
            ? "Some things need terminal. Copy the commands below — paste them in order."
            : "Almost everything's set up. Just the final steps in terminal."}
      </div>

      <div className="install-log" ref={logRef}>
        {logs.map((entry, i) => (
          <div
            key={i}
            className={`log-line ${entry.status}`}
            onClick={
              entry.status === "command"
                ? () => navigator.clipboard.writeText(entry.text)
                : undefined
            }
          >
            {entry.status === "active" && "\u25b8 "}
            {entry.status === "success" && "\u2713 "}
            {entry.status === "skip" && "  "}
            {entry.status === "error" && "\u2717 "}
            {entry.status === "explain" && "  "}
            {entry.status === "command" && "  $ "}
            {entry.text}
            {entry.status === "command" && (
              <span className="copy-hint"> &larr; click to copy</span>
            )}
          </div>
        ))}
        {running && (
          <div className="log-line active">
            <span className="spinner" /> working...
          </div>
        )}
      </div>

      {!running && (
        <div className="actions">
          <button className="btn btn-secondary" onClick={copyAll}>
            Copy all commands
          </button>
          <button className="btn btn-primary" onClick={onComplete}>
            Done
          </button>
        </div>
      )}
    </>
  );
}
