import { useEffect, useId, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import StarRating from "./StarRating";
import { renderMarkdown } from "../../utils/markdown";

function ReviewPanel({
  open,
  onClose,
  title,
  initialRating = 0,
  initialNotes = "",
  onSave,
  saving = false,
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [rating, setRating] = useState(initialRating);
  const [notes, setNotes] = useState(initialNotes);
  const [tab, setTab] = useState("write");
  const [error, setError] = useState("");

  // Reset local draft whenever the panel opens for a (possibly different) title.
  useEffect(() => {
    if (!open) return;
    setRating(initialRating || 0);
    setNotes(initialNotes || "");
    setTab("write");
    setError("");
  }, [open, initialRating, initialNotes]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSave(event) {
    event.preventDefault();
    setError("");

    if (!rating && !notes.trim()) {
      setError("Add a star rating or a note before saving.");
      return;
    }

    const result = onSave?.({
      userRating: rating || null,
      notes: notes.trim(),
    });

    if (result === false) {
      setError("Could not save this review. Storage may be full.");
    }
  }

  return (
    <div className="fixed inset-0 z-80 flex justify-end">
      <button
        type="button"
        aria-label="Close review panel"
        className="absolute inset-0 bg-canvas/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full max-w-md flex-col border-l border-border/50 bg-surface/95 shadow-[-20px_0_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-border/40 px-8 py-8">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              Private review
            </p>
            <h2
              id={titleId}
              className="truncate font-sora text-2xl font-bold text-brand"
            >
              Review & Notes
            </h2>
            {title && (
              <p className="mt-1 truncate text-sm text-ink-muted">{title}</p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/50 text-ink-muted transition-colors hover:border-brand/40 hover:text-brand"
            aria-label="Close"
          >
            <FiX aria-hidden="true" size={18} />
          </button>
        </header>

        <form
          onSubmit={handleSave}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-8 overflow-y-auto px-8 py-6">
            <StarRating value={rating} onChange={setRating} />

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
                  Private notes
                </p>
                <div
                  role="tablist"
                  aria-label="Notes mode"
                  className="flex gap-1 rounded-full border border-border/50 bg-canvas/40 p-1"
                >
                  {[
                    { id: "write", label: "Write" },
                    { id: "preview", label: "Preview" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === option.id}
                      onClick={() => setTab(option.id)}
                      className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-colors ${
                        tab === option.id
                          ? "bg-brand text-canvas"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                Supports Markdown
              </p>

              {tab === "write" ? (
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Write your thoughts here... Use # for headings, * for lists."
                  rows={10}
                  className="min-h-64 w-full resize-y rounded-xl border border-border/50 bg-[rgba(8,14,24,0.5)] px-4 py-4 text-base leading-relaxed text-ink placeholder:text-ink-faint/60 focus:border-brand focus:outline-none"
                />
              ) : (
                <div
                  role="tabpanel"
                  className="prose-review min-h-64 rounded-xl border border-border/50 bg-[rgba(8,14,24,0.5)] px-4 py-4 text-base leading-relaxed text-ink"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }}
                />
              )}
            </div>

            <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-4 text-xs leading-relaxed text-ink-muted">
              Your reviews and notes are private and stored only on this device.
              Only you can view them in your personal cinema vault.
            </div>

            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}
          </div>

          <div className="border-t border-border/40 px-8 py-8">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-brand font-hanken text-base font-bold uppercase tracking-wide text-brand-deep transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save review"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default ReviewPanel;
