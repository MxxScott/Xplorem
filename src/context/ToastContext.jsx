import { createContext, useCallback, useMemo, useState } from "react";

const ToastContext = createContext(null);

let toastId = 0;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "info") => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      push,
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed bottom-6 right-6 z-100 flex w-[min(100%-2rem,22rem)] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
              toast.tone === "error"
                ? "border-danger/40 bg-canvas/95 text-danger"
                : toast.tone === "success"
                  ? "border-brand/40 bg-canvas/95 text-brand"
                  : "border-border/50 bg-canvas/95 text-ink"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="leading-relaxed">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 font-mono text-xs uppercase text-ink-faint transition-colors hover:text-ink"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider };
export default ToastContext;
