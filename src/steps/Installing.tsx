"use client"

import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { InstallState } from "../App";

interface Props {
  state: InstallState;
  onComplete: () => void;
}

interface LogEntry {
  text: string;
  status: "active" | "success" | "skip" | "error" | "info" | "explain" | "command";
}

export default function Installing({ state, onComplete }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(true);
  const [allCommands, setAllCommands] = useState<string[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
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
    } catch (err) {
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

      // ── Homebrew ─────────────────────────────
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

      // ── Node.js ─────────────────────────────
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

      // ── Claude Code ─────────────────────────
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

      // ── Create World ────────────────────────
      const worldPath =
        state.location === "icloud"
          ? `${state.icloudPath}/world`
          : state.localPath || `${home}/world`;

      // Try icloud symlink
      if (state.location === "icloud" && state.icloudPath) {
        await tryOrFallback(
          "creating ~/icloud shortcut...",
          "so you never have to type the long icloud path",
          async () => {
            await invoke<boolean>("create_symlink", {
              target: state.icloudPath,
              link: `${home}/icloud`,
            });
          },
          `ln -s "${state.icloudPath}" ~/icloud`
        );
      }

      // Try folder creation
      await tryOrFallback(
        "creating your world folders...",
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

      // Try ~/world symlink
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

      // ── World identity ────────────────────
      const year = new Date().getFullYear();
      const now = new Date().toISOString().split(".")[0];
      const today = new Date().toISOString().split("T")[0];
      const toolsList = state.tools.length > 0
        ? state.tools.map((t) => `| ${t} | Available |`).join("\n")
        : "";
      const contextSection = toolsList
        ? `\n---\n\n## Context Sources\n\n| Source | Status |\n|--------|--------|\n${toolsList}\n`
        : "";
      const lifeSection = state.lifeGoals
        ? `\n---\n\n## Notes\n\n${state.lifeGoals}\n`
        : "";

      await tryOrFallback(
        "writing world identity...",
        "this tells every squirrel who you are",
        async () => {
          const claudeMd = `# ${state.name}'s World

**Build Your World.**

You are a Squirrel — one Claude session inside a worldbuilder's World. You read, you work, you close. The World belongs to the worldbuilder. You are here to help them build it.

---

## Who

**Worldbuilder:** ${state.name}
**Started:** ${year}
${contextSection}${lifeSection}
---

**Version:** 0.1.0 Walnut
`;
          const wrote = await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/.claude/CLAUDE.md`,
            content: claudeMd,
          });
          if (!wrote) log("CLAUDE.md already exists — kept yours", "skip");

          // Multi-agent compatibility — same identity for every AI tool
          log("setting up multi-agent compatibility...", "active");
          log("one identity, every AI tool reads it", "explain");

          const agentFiles: [string, string][] = [
            [`${worldPath}/AGENTS.md`, "Zed, GitHub Copilot"],
            [`${worldPath}/.cursorrules`, "Cursor"],
            [`${worldPath}/.windsurfrules`, "Windsurf"],
          ];

          for (const [filePath, tool] of agentFiles) {
            try {
              await invoke<boolean>("create_symlink", {
                target: `${worldPath}/.claude/CLAUDE.md`,
                link: filePath,
              });
            } catch {
              // File might already exist — write a copy instead of symlink
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

      // ── Life walnut ────────────────────────
      await tryOrFallback(
        "creating life walnut...",
        "the foundation — everything else serves this",
        async () => {
          await invoke("create_dirs", { paths: [`${worldPath}/02_Life/_squirrels`, `${worldPath}/02_Life/_scratch`] });
          await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/02_Life/key.md`,
            content: `---\ntype: life\ngoal: ${state.lifeGoals.split('\n')[0] || 'Build the life that supports everything else'}\ncreated: ${year}\nrhythm: weekly\npeople: []\ntags: []\n---\n\n${state.name}'s life. The foundation.\n`,
          });
          await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/02_Life/now.md`,
            content: `---\nphase: active\nhealth: active\nupdated: ${now}\nnext: set up your world\nsquirrel: installer\nlinks: []\n---\n\n## Open\n\n- [ ] Bring in context from existing tools\n`,
          });
        },
        `# life walnut at ${worldPath}/02_Life/`
      );

      // ── Project walnuts ────────────────────
      for (const project of state.projects) {
        const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
        const domain = project.type === "venture" ? "04_Ventures" : "05_Experiments";
        const pPath = `${worldPath}/${domain}/${slug}`;
        const codebaseField = project.codebasePath ? `\ncodebase: ${project.codebasePath}` : "";
        const stackField = project.stack ? `\nstack: [${project.stack}]` : "";

        await tryOrFallback(
          `creating ${project.type}: ${project.name}...`,
          project.goal || project.name,
          async () => {
            await invoke("create_dirs", { paths: [`${pPath}/_squirrels`, `${pPath}/_scratch`, `${pPath}/_references`] });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/key.md`,
              content: `---\ntype: ${project.type}\ngoal: ${project.goal || project.name}\ncreated: ${year}\nrhythm: weekly\npeople: []\ntags: []${codebaseField}${stackField}\n---\n\n${project.name}.\n`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/now.md`,
              content: `---\nphase: starting\nhealth: active\nupdated: ${now}\nnext: define first milestone\nsquirrel: installer\nlinks: []\n---\n\n## Open\n\n- [ ] Define first milestone\n`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/log.md`,
              content: `---\nwalnut: ${slug}\ncreated: ${today}\nlast-entry: ${now}\nentry-count: 1\nsummary: Walnut created during world setup.\n---\n\n## ${now} — squirrel:installer\n\nWalnut created. Goal: ${project.goal || project.name}.${project.codebasePath ? `\nCodebase: ${project.codebasePath}` : ""}${project.stack ? `\nStack: ${project.stack}` : ""}\n\nsigned: squirrel:installer\n`,
            });

            // If codebase path exists, write AGENTS.md there too
            if (project.codebasePath) {
              const agentsContent = `# ${project.name}\n\nProject context: ~/world/${domain}/${slug}/\nRead key.md for architecture decisions, team context, and session history.\n\n---\n\nGoal: ${project.goal || project.name}\n${project.stack ? `Stack: ${project.stack}\n` : ""}`;
              try {
                await invoke<boolean>("write_file_if_missing", {
                  path: `${project.codebasePath}/AGENTS.md`,
                  content: agentsContent,
                });
                log(`  AGENTS.md written to ${project.codebasePath}`, "success");
              } catch {
                log(`  couldn't write AGENTS.md to codebase — do it manually`, "skip");
              }
            }
          },
          `# ${project.type} at ${pPath}/`
        );
      }

      // ── People walnuts ─────────────────────
      for (const person of state.people) {
        const slug = person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
        await tryOrFallback(
          `creating person: ${person.name}...`,
          person.relationship,
          async () => {
            const pPath = `${worldPath}/02_Life/people/${slug}`;
            await invoke("create_dirs", { paths: [`${pPath}/_squirrels`] });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/key.md`,
              content: `---\ntype: person\ngoal: ${person.relationship}\ncreated: ${year}\npeople: []\ntags: [${person.relationship}]\n---\n\n${person.name}. ${person.relationship}.\n`,
            });
            await invoke<boolean>("write_file_if_missing", {
              path: `${pPath}/now.md`,
              content: `---\nphase: active\nupdated: ${new Date().toISOString().split('.')[0]}\nnext: add context\nsquirrel: installer\nlinks: []\n---\n`,
            });
          },
          `# person created at ${worldPath}/02_Life/people/${slug}/`
        );
      }

      // ── Preferences ────────────────────────
      const syncConfig = state.tools.length > 0
        ? `\nsync:\n${state.tools.map(t => `  ${t.toLowerCase().replace(/\s+/g, '-')}: available`).join('\n')}\n`
        : "\nsync: {}\n";

      await tryOrFallback(
        "creating preferences...",
        "you can customize everything later with walnut:worldbuilding",
        async () => {
          await invoke<boolean>("write_file_if_missing", {
            path: `${worldPath}/.claude/preferences.yaml`,
            content: `# Walnut Preferences\n# Uncomment to override defaults.\n\ntheme: vibrant\n${syncConfig}`,
          });
        },
        `# create preferences at ${worldPath}/.claude/preferences.yaml`
      );

      // ── Plugin install ─────────────────────
      log("walnut plugin...", "active");
      log("the plugin adds skills and hooks to claude code", "explain");
      const pluginCmd = "claude plugin install alivecomputer/walnut";
      log("run this in terminal after claude code is installed:", "skip");
      log(pluginCmd, "command");
      addCommand(pluginCmd);
      commands.push(pluginCmd);

      // ── Summary ────────────────────────────
      log("", "info");
      const created: string[] = ["02_Life"];
      state.projects.forEach(p => {
        const domain = p.type === "venture" ? "04_Ventures" : "05_Experiments";
        created.push(`${domain}/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
      });
      state.people.forEach(p => created.push(`people/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`));

      log(`${created.length} walnuts created. your squirrel already knows:`, "success");
      created.forEach(w => log(`  ${w}`, "success"));

      log("", "info");
      const launchCmd = "cd ~/world && claude";
      addCommand(launchCmd);
      commands.push(launchCmd);

      log("last step — open terminal and run:", "info");
      log(launchCmd, "command");
      log("", "info");
      log("your squirrel already knows your name, your venture,", "success");
      log("your people, and your goals. just start talking.", "success");

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
        {running ? "Building your World" : "Here's what to do"}
      </div>
      <div className="step-description">
        {running
          ? "Checking your system and setting up what we can."
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
            {entry.status === "active" && "▸ "}
            {entry.status === "success" && "✓ "}
            {entry.status === "skip" && "  "}
            {entry.status === "error" && "✗ "}
            {entry.status === "explain" && "  "}
            {entry.status === "command" && "  $ "}
            {entry.text}
            {entry.status === "command" && (
              <span className="copy-hint"> ← click to copy</span>
            )}
          </div>
        ))}
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
