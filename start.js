#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const isWin = process.platform === "win32";
const npm = isWin ? "npm.cmd" : "npm";

console.log("Starting Kang Tools...\n");

const child = spawn(npm, ["run", "dev"], {
  cwd: path.resolve(__dirname),
  stdio: "inherit",
  shell: true,
});

child.on("error", (err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
