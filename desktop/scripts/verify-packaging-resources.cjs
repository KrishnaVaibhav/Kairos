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

// PyInstaller bundles config.example.json verbatim (server.spec datas=[...]) —
// a syntax error here ships silently and only surfaces as a broken first-run
// config seed on the user's machine, so catch it at package time instead.
const configExamplePath = path.join(root, "config.example.json");
if (exists(configExamplePath)) {
	try {
		JSON.parse(fs.readFileSync(configExamplePath, "utf-8"));
	} catch (e) {
		fail(`config.example.json is not valid JSON: ${e.message}\nPath: ${configExamplePath}`);
	}
} else {
	fail(`Missing config.example.json (bundled as the first-run config seed).\nExpected path: ${configExamplePath}`);
}

if (process.exitCode) {
	console.error("\n[packaging-check] Aborting packaging due to missing resources.");
	process.exit(process.exitCode);
}

console.log("[packaging-check] OK: required packaging resources are present.");
