import { useCallback, useEffect, useState } from "react";

const initialState = { data: null, loading: true, error: null };

// Generic async handler for the tmdbApi functions. Pass a callback that takes
// an options bag ({ signal }) and returns a promise:
//
//   useFetch((options) => getTrending("all", "week", options), [])
//
// `deps` controls when the request re-runs, exactly like useEffect.
function useFetch(fetcher, deps = []) {
  const [state, setState] = useState(initialState);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function run() {
      try {
        const result = await fetcher({ signal: controller.signal });
        if (active) setState({ data: result, loading: false, error: null });
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setState({ data: null, loading: false, error });
        }
      }
    }

    run();

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  const reload = useCallback(() => {
    setState(initialState);
    setReloadCount((count) => count + 1);
  }, []);

  return { ...state, reload };
}

export default useFetch;
