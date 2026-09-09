import { useCallback, useEffect, useRef, useState } from "react";

function readStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function useLocalStorage(key, initialValue) {
  const [value, setValueState] = useState(() => readStored(key, initialValue));
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Write through immediately so callers can detect a failed persist and roll
  // the UI back in the same turn (optimistic updates). The previous effect-based
  // write swallowed QuotaExceededError after React had already committed.
  const setValue = useCallback(
    (updater) => {
      const previous = valueRef.current;
      const next = typeof updater === "function" ? updater(previous) : updater;

      valueRef.current = next;
      setValueState(next);

      try {
        window.localStorage.setItem(key, JSON.stringify(next));
        return true;
      } catch {
        valueRef.current = previous;
        setValueState(previous);
        return false;
      }
    },
    [key],
  );

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== key) return;
      const next = readStored(key, initialValue);
      valueRef.current = next;
      setValueState(next);
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
    valueRef.current = initialValue;
    setValueState(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove];
}

export default useLocalStorage;
