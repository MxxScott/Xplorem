import { lazy } from "react";

// One reload per tab, remembered across the reload itself — sessionStorage
// survives a refresh, a module-scope variable would not.
const RELOAD_FLAG = "xplorem:chunk-reload";

// Private browsing modes can throw on access rather than just returning null,
// and a storage failure should never be what breaks the page.
function hasReloaded() {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) === "1";
  } catch {
    return false;
  }
}

function setReloaded(value) {
  try {
    if (value) sessionStorage.setItem(RELOAD_FLAG, "1");
    else sessionStorage.removeItem(RELOAD_FLAG);
  } catch {
    // Storage unavailable: skip the reload attempt and let the route's
    // errorElement handle it instead of retrying forever.
  }
}

// A code-split chunk can fail to arrive for reasons that have nothing to do
// with the code in it: the dev server restarted (so the URL this tab still
// remembers is gone), a deploy replaced the hashed filename, or the network
// blipped mid-request. React only sees a rejected promise and reports
// "Failed to fetch dynamically imported module", which reads like a bug in the
// page the user was opening.
//
// Failed module loads are not cached, so the cheapest fix is to ask again. If
// the second attempt also fails the URL itself is stale, and only a fresh
// index.html can hand out current chunk names — hence the one-time reload,
// gated so a chunk that is genuinely missing surfaces the error boundary
// instead of putting the app in a refresh loop.
function lazyWithRetry(importer) {
  return lazy(async () => {
    try {
      const module = await importer();
      // Getting here after a reload means the recovery worked, so let a future
      // failure use its reload too.
      if (hasReloaded()) setReloaded(false);
      return module;
    } catch (error) {
      try {
        return await importer();
      } catch {
        if (!hasReloaded()) {
          setReloaded(true);
          window.location.reload();
          // The reload is already in flight. Resolving or rejecting now would
          // flash the error screen on the way out, so stay pending instead.
          return new Promise(() => {});
        }

        // Surface the original failure — it names the module that could not be
        // fetched, which is the useful half of the message.
        throw error;
      }
    }
  });
}

export default lazyWithRetry;
