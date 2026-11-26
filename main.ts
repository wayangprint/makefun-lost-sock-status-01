// Funniest Lost Sock Status Update — entry runner (revised).
//
// The entry is one fixed status update, assembled below from its two
// halves (setup + punchline) by buildStatusLine(). Nothing here reads the
// clock, the network, or any random source, so every run writes
// byte-identical output. No trailing newline is ever written: the gate
// counts entry.txt as 1-120 characters, so the file holds exactly the
// 109-character line and nothing else.
//
// Where entry.txt lands:
//   - MAKEFUN_OUTPUT_DIR when that variable is set (the grading sandbox
//     sets it to /output, and per-run scratch dirs are used while
//     verifying determinism), otherwise /output when that directory
//     already exists (the grading sandbox case), otherwise next to this
//     script (entry.txt in the repo folder, local runs only). The script
//     folder is never written when an output folder is available: the
//     grading sandbox mounts the repository read-only, so a write there
//     would throw and fail the run.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The two halves of the status update. Kept separate so the line is built
// by composition (buildStatusLine) instead of pasted as one literal:
//   SETUP    — where the sock is and who keeps calling it back.
//   PUNCHLINE — the sock's break-up with the dryer.
const SETUP = "Day 6 behind the radiator. The dryer keeps calling,";
const PUNCHLINE =
  "but I'm done being spun around by someone who shrinks me.";

// Gate: the entry must be a single line of 1-120 characters.
const MAX_ENTRY_CHARS = 120;

// Compose the final line from its halves, joined by a single space.
function buildStatusLine(): string {
  return `${SETUP} ${PUNCHLINE}`;
}

// Guard the gate before anything is written: wrong length or a stray
// newline would fail the check, so fail loudly here instead.
function validateLine(line: string): void {
  if (line.length === 0 || line.length > MAX_ENTRY_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_ENTRY_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

// Pick where entry.txt goes: explicit env override wins, then the
// grading sandbox's /output, then the script's own folder (local only).
function resolveOutputDir(): string {
  const override = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  if (override.length > 0) {
    return override;
  }
  if (existsSync("/output")) {
    return "/output";
  }
  return new URL(".", import.meta.url).pathname;
}

// Write the validated line with no trailing newline.
function writeLine(line: string, outDir: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), line, "utf8");
}

// Pipeline: build the line, guard the gate, then write it out.
const statusLine = buildStatusLine();
validateLine(statusLine);
writeLine(statusLine, resolveOutputDir());
process.stdout.write(statusLine + "\n");
