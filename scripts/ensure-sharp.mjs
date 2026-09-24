/**
 * Next.js needs sharp at build time for next/image (blur placeholders).
 * On some Linux hosts npm skips @img/sharp-* optional packages — install WASM sharp.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { join } from "node:path";

const SHARP_VERSION = "0.35.4";
const root = process.cwd();
const requireFromRoot = createRequire(join(root, "package.json"));

function sharpLoads() {
  try {
    requireFromRoot("sharp");
    return true;
  } catch (err) {
    console.error(
      "[sharp] Load failed:",
      err instanceof Error ? err.message : err
    );
    return false;
  }
}

console.log(
  `[sharp] node ${process.version} | ${process.platform}-${process.arch}`
);

if (sharpLoads()) {
  process.exit(0);
}

console.warn(
  `[sharp] Installing sharp@${SHARP_VERSION} with WASM backend (works without native bindings)...`
);

execSync(`npm install sharp@${SHARP_VERSION} --cpu=wasm32 --no-save --no-audit --no-fund`, {
  stdio: "inherit",
  cwd: root,
});

if (!sharpLoads()) {
  console.error(
    "[sharp] Still unavailable. Run on the server:\n" +
      `  npm install sharp@${SHARP_VERSION} --cpu=wasm32\n` +
      "  npm run build"
  );
  process.exit(1);
}

console.log("[sharp] OK");
