/**
 * Ensures @tailwindcss/oxide loads (native or WASI). Runs on postinstall and prebuild.
 */
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const OXIDE_VERSION = "4.3.3";
const root = process.cwd();
const requireFromRoot = createRequire(join(root, "package.json"));

function linuxMusl() {
  if (process.platform !== "linux") return false;
  try {
    return readFileSync("/usr/bin/ldd", "utf8").includes("musl");
  } catch {
    return false;
  }
}

function resolveOxidePackage() {
  if (process.platform === "darwin") {
    return process.arch === "arm64"
      ? "@tailwindcss/oxide-darwin-arm64"
      : "@tailwindcss/oxide-darwin-x64";
  }
  if (process.platform === "linux") {
    const musl = linuxMusl();
    if (process.arch === "arm64") {
      return musl
        ? "@tailwindcss/oxide-linux-arm64-musl"
        : "@tailwindcss/oxide-linux-arm64-gnu";
    }
    if (process.arch === "x64") {
      return musl
        ? "@tailwindcss/oxide-linux-x64-musl"
        : "@tailwindcss/oxide-linux-x64-gnu";
    }
  }
  return null;
}

function tryLoadOxide() {
  try {
    requireFromRoot("@tailwindcss/oxide");
    return true;
  } catch (err) {
    console.error(
      "[tailwind-oxide] Load failed:",
      err instanceof Error ? err.message : err
    );
    if (err instanceof Error && err.cause) {
      console.error("[tailwind-oxide] Cause:", err.cause);
    }
    return false;
  }
}

function install(packages) {
  const list = Array.isArray(packages) ? packages : [packages];
  const specs = list.map((p) => `${p}@${OXIDE_VERSION}`).join(" ");
  console.warn(`[tailwind-oxide] Installing ${specs}...`);
  execSync(`npm install ${specs} --no-save --no-audit --no-fund --include=optional`, {
    stdio: "inherit",
    cwd: root,
    env: {
      ...process.env,
      npm_config_optional: "true",
      npm_config_include: "optional",
    },
  });
}

console.log(
  `[tailwind-oxide] node ${process.version} | ${process.platform}-${process.arch}`
);

if (tryLoadOxide()) {
  process.exit(0);
}

const platformPkg = resolveOxidePackage();
if (platformPkg) {
  const pkgDir = join(root, "node_modules", ...platformPkg.split("/"));
  if (!existsSync(pkgDir)) {
    install(platformPkg);
  } else if (!tryLoadOxide()) {
    // Folder exists but binding broken (wrong arch, corrupt install) — reinstall.
    install(platformPkg);
  }
}

if (!tryLoadOxide()) {
  console.warn(
    "[tailwind-oxide] Native binding unavailable; installing WASI fallback..."
  );
  install("@tailwindcss/oxide-wasm32-wasi");
}

// Last resort: both platform native + WASI (npm optional-deps bug on some hosts).
if (!tryLoadOxide() && platformPkg) {
  install([platformPkg, "@tailwindcss/oxide-wasm32-wasi"]);
}

if (!tryLoadOxide()) {
  console.error(
    "[tailwind-oxide] Could not load @tailwindcss/oxide. On the server run:\n" +
      "  rm -rf node_modules && npm install && npm run build"
  );
  process.exit(1);
}
