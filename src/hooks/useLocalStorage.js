import { useCallback, useEffect, useState } from "react";

function readStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStored(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable (private mode) — keep the value in memory.
    }
  }, [key, value]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === key) setValue(readStored(key, initialValue));
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
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove];
}

export default useLocalStorage;
