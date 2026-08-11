import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// An autoplaying trailer is a common vestibular/migraine trigger, so anything
// that moves on its own should check here first and fall back to a still.
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(
    () => window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(QUERY);

    function handleChange(event) {
      setPrefersReduced(event.matches);
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}

export default usePrefersReducedMotion;
