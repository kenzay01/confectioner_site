/**
 * Next.js needs sharp at build time for next/image (blur placeholders).
 * Skips work when a recent successful check is cached (faster rebuilds).
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const SHARP_VERSION = "0.35.4";
const root = process.cwd();
const requireFromRoot = createRequire(join(root, "package.json"));
const cacheDir = join(root, ".next", "cache");
const markerPath = join(cacheDir, "sharp-verified.json");

function lockfileFingerprint() {
  const lockPath = join(root, "package-lock.json");
  if (!existsSync(lockPath)) return "no-lockfile";
  const hash = createHash("sha256");
  hash.update(readFileSync(lockPath));
  hash.update(`|sharp:${SHARP_VERSION}`);
  return hash.digest("hex").slice(0, 16);
}

function sharpLoads() {
  try {
    requireFromRoot("sharp");
    return true;
  } catch {
    return false;
  }
}

function writeMarker() {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(
    markerPath,
    JSON.stringify({
      sharp: SHARP_VERSION,
      lock: lockfileFingerprint(),
      at: new Date().toISOString(),
    })
  );
}

function markerValid() {
  if (!existsSync(markerPath)) return false;
  try {
    const data = JSON.parse(readFileSync(markerPath, "utf8"));
    return (
      data.sharp === SHARP_VERSION &&
      data.lock === lockfileFingerprint() &&
      sharpLoads()
    );
  } catch {
    return false;
  }
}

if (markerValid()) {
  process.exit(0);
}

if (sharpLoads()) {
  writeMarker();
  process.exit(0);
}

console.log(
  `[sharp] node ${process.version} | ${process.platform}-${process.arch}`
);
console.warn(
  `[sharp] Installing sharp@${SHARP_VERSION} with WASM backend (works without native bindings)...`
);

execSync(
  `npm install sharp@${SHARP_VERSION} --cpu=wasm32 --no-save --no-audit --no-fund`,
  {
    stdio: "inherit",
    cwd: root,
  }
);

if (!sharpLoads()) {
  console.error(
    "[sharp] Still unavailable. Run on the server:\n" +
      `  npm install sharp@${SHARP_VERSION} --cpu=wasm32\n` +
      "  npm run build"
  );
  process.exit(1);
}

writeMarker();
console.log("[sharp] OK");
