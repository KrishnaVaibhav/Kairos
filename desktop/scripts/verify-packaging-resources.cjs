const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const desktop = path.resolve(__dirname, "..");

function exists(p) {
	return fs.existsSync(p);
}

function fail(msg) {
	console.error(`\n[packaging-check] ${msg}`);
	process.exitCode = 1;
}

const checks = [
	{
		path: path.join(root, "dist_backend", "server"),
		why: "Missing frozen backend. Run PyInstaller first (see BUILD docs/workflow).",
	},
	{
		path: path.join(desktop, "build-resources", "chromium"),
		why: "Missing bundled Chromium resources.",
	},
	{
		path: path.join(desktop, "build-resources", "tectonic"),
		why: "Missing bundled Tectonic resources.",
	},
	{
		path: path.join(desktop, "build-resources", "cloudflared"),
		why: "Missing bundled cloudflared resources.",
	},
];

for (const c of checks) {
	if (!exists(c.path)) {
		fail(`${c.why}\nExpected path: ${c.path}`);
	}
}

if (process.exitCode) {
	console.error("\n[packaging-check] Aborting packaging due to missing resources.");
	process.exit(process.exitCode);
}

console.log("[packaging-check] OK: required packaging resources are present.");
