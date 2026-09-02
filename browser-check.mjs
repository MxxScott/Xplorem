// Throwaway browser check: drives headless Chrome over CDP to confirm the 404
// page and MediaDetails actually render, rather than only that they compile.
import { spawn } from "child_process";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { WebSocket } from "ws";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:5199";
const PORT = 9333;
const profile = mkdtempSync(join(tmpdir(), "xplorem-check-"));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTargets() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {
      // Chrome not listening yet.
    }
    await sleep(250);
  }
  throw new Error("Chrome did not expose a CDP target");
}

async function run() {
  const target = await getTargets();
  const ws = new WebSocket(target.webSocketDebuggerUrl, {
    perMessageDeflate: false,
  });
  await new Promise((resolve, reject) => {
    ws.once("open", resolve);
    ws.once("error", reject);
  });

  let nextId = 1;
  const pending = new Map();
  const consoleErrors = [];

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
      return;
    }
    if (msg.method === "Runtime.exceptionThrown") {
      consoleErrors.push(
        msg.params?.exceptionDetails?.exception?.description ||
          msg.params?.exceptionDetails?.text ||
          "unknown exception",
      );
    }
  });

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = nextId++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("Runtime.enable");
  await send("Page.enable");

  async function visit(path, waitMs) {
    consoleErrors.length = 0;
    await send("Page.navigate", { url: `${BASE}${path}` });
    await sleep(waitMs);

    const result = await send("Runtime.evaluate", {
      expression: `(() => {
        const root = document.getElementById('root');
        const h1 = document.querySelector('h1');
        const text = root ? root.innerText : '';
        return JSON.stringify({
          h1: h1 ? h1.innerText : null,
          chars: text.length,
          h2s: Array.from(document.querySelectorAll('h2')).map(n => n.innerText),
          hasRouterDevError: text.includes('Unexpected Application Error'),
          bodyStart: text.slice(0, 160).replace(/\\s+/g, ' '),
        });
      })()`,
      returnByValue: true,
    });

    return {
      path,
      ...JSON.parse(result.result?.result?.value || "{}"),
      errors: [...consoleErrors],
    };
  }

  const checks = [];
  // Bad URL -> the new 404 page.
  checks.push(await visit("/this/route/does/not/exist", 3500));
  // Real movie -> MediaDetails with data.
  checks.push(await visit("/media/550?type=movie", 6000));
  // TV branch, which uses the other set of TMDB field names.
  checks.push(await visit("/media/1399?type=tv", 6000));
  // Garbage ?type= must fall back to movie rather than 404 the API call.
  checks.push(await visit("/media/550?type=bogus", 6000));

  for (const check of checks) {
    console.log(`\n=== ${check.path}`);
    console.log(`  h1:        ${check.h1}`);
    console.log(`  h2s:       ${JSON.stringify(check.h2s)}`);
    console.log(`  chars:     ${check.chars}`);
    console.log(`  devError:  ${check.hasRouterDevError}`);
    console.log(`  text:      ${check.bodyStart}`);
    if (check.errors.length) console.log(`  ERRORS:    ${check.errors.join(" | ")}`);
  }

  ws.close();
}

try {
  await run();
} catch (error) {
  console.error("CHECK FAILED:", error.message);
  process.exitCode = 1;
} finally {
  chrome.kill();
  await sleep(500);
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    // Chrome may still hold a lock; the temp dir is disposable either way.
  }
}
