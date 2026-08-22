/**
 * Starts the Vite app and giftistry-bun API, bound for LAN access.
 * Prints the phone URL (http://<lan-ip>:3000) and points the SPA at the LAN API.
 */
import { existsSync } from 'fs';
import { homedir, networkInterfaces } from 'os';
import { spawn } from 'child_process';
import { join } from 'path';

const ROOT = join(import.meta.dir, '..');
const API_ROOT = join(ROOT, '../giftistry-bun');
const WEB_PORT = 3000;
const API_PORT = 3001;

const BROWSER_NAMES = [
  'chromium',
  'chromium-browser',
  'google-chrome-stable',
  'google-chrome',
] as const;

interface NetworkAddress {
  address: string;
  family: string | number;
  internal: boolean;
}

function isPrivateIPv4(address: string): boolean {
  if (address.startsWith('192.168.')) return true;
  if (address.startsWith('10.')) return true;
  const match = /^172\.(\d+)\./.exec(address);
  if (!match) return false;
  const second = Number(match[1]);
  return second >= 16 && second <= 31;
}

function lanIPv4(): string {
  const candidates: string[] = [];

  for (const addrs of Object.values(networkInterfaces())) {
    for (const addr of (addrs ?? []) as NetworkAddress[]) {
      const isV4 = addr.family === 'IPv4' || addr.family === 4;
      if (!isV4 || addr.internal) continue;
      candidates.push(addr.address);
    }
  }

  const preferred =
    candidates.find((ip) => ip.startsWith('192.168.')) ??
    candidates.find((ip) => ip.startsWith('10.')) ??
    candidates.find((ip) => isPrivateIPv4(ip) && !ip.startsWith('172.17.')) ??
    candidates.find((ip) => isPrivateIPv4(ip));

  return preferred ?? candidates[0] ?? '127.0.0.1';
}

function isLoopbackUrl(value: string | undefined): boolean {
  if (!value) return true;
  try {
    const hostname = new URL(value).hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  } catch {
    return true;
  }
}

function resolveLanUrl(existing: string | undefined, lanUrl: string): string {
  if (!existing || isLoopbackUrl(existing)) {
    return lanUrl;
  }
  return existing;
}

function resolveChromiumPath(): string | undefined {
  const fromEnv = process.env.SCRAPE_PLAYWRIGHT_EXECUTABLE_PATH?.trim();
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const pathDirs = (process.env.PATH ?? '').split(':').filter(Boolean);
  const extraDirs = ['/run/current-system/sw/bin', join(homedir(), '.nix-profile', 'bin')];

  for (const dir of [...pathDirs, ...extraDirs]) {
    for (const name of BROWSER_NAMES) {
      const fullPath = join(dir, name);
      if (existsSync(fullPath)) return fullPath;
    }
  }

  return undefined;
}

const lanIp = lanIPv4();
const apiUrl = resolveLanUrl(process.env.VITE_API_URL, `http://${lanIp}:${API_PORT}`);
const appUrl = resolveLanUrl(process.env.GIFTISTRY_PUBLIC_APP_URL, `http://${lanIp}:${WEB_PORT}`);
const chromiumPath = resolveChromiumPath();

console.log(`[dev:all] Phone / LAN UI  ${appUrl}`);
console.log(`[dev:all] Phone / LAN API ${apiUrl}`);
if (chromiumPath) {
  console.log(`[dev:all] Playwright Chromium ${chromiumPath}`);
} else {
  console.log(
    '[dev:all] Playwright Chromium not found; set SCRAPE_PLAYWRIGHT_EXECUTABLE_PATH'
  );
}

const child = spawn(
  join(ROOT, 'node_modules/.bin/concurrently'),
  [
    '-n',
    'web,api',
    '-c',
    'cyan,magenta',
    `vite --host --port ${WEB_PORT}`,
    `cd "${API_ROOT}" && bun run dev`,
  ],
  {
    cwd: ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_API_URL: apiUrl,
      GIFTISTRY_PUBLIC_APP_URL: appUrl,
      ...(chromiumPath ? { SCRAPE_PLAYWRIGHT_EXECUTABLE_PATH: chromiumPath } : {}),
    },
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
