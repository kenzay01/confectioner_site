/**
 * Workaround for npm optional-deps bug (https://github.com/npm/cli/issues/4828).
 * Ensures the platform @tailwindcss/oxide-* package exists before next build.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const OXIDE_VERSION = "4.3.3";

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
    return musl
      ? "@tailwindcss/oxide-linux-x64-musl"
      : "@tailwindcss/oxide-linux-x64-gnu";
  }
  return null;
}

const pkg = resolveOxidePackage();

if (!pkg) {
  process.exit(0);
}

const pkgDir = join(process.cwd(), "node_modules", ...pkg.split("/"));

if (existsSync(pkgDir)) {
  process.exit(0);
}

console.warn(
  `[postinstall] Missing ${pkg}; installing ${OXIDE_VERSION} (npm optional-deps workaround)...`
);

execSync(`npm install ${pkg}@${OXIDE_VERSION} --no-save --no-package-lock`, {
  stdio: "inherit",
  env: { ...process.env, npm_config_optional: "true" },
});
