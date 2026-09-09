import { useId } from "react";
import { FiStar } from "react-icons/fi";

const MAX = 5;

function StarRating({
  value = 0,
  onChange,
  label = "Your rating",
  disabled = false,
}) {
  const labelId = useId();
  const rating = Math.min(MAX, Math.max(0, Number(value) || 0));

  function setRating(next) {
    if (disabled || !onChange) return;
    onChange(next);
  }

  function handleKeyDown(event) {
    if (disabled) return;

    let next;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = rating === 0 ? 1 : Math.min(MAX, rating + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = Math.max(1, rating - 1);
        break;
      case "Home":
        next = 1;
        break;
      case "End":
        next = MAX;
        break;
      case " ":
      case "Enter":
        // Space/Enter on a focused star is handled by the button itself.
        return;
      default:
        return;
    }

    event.preventDefault();
    setRating(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <p id={labelId} className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2"
      >
        {Array.from({ length: MAX }, (_, index) => {
          const starValue = index + 1;
          const checked = rating === starValue;
          const filled = starValue <= rating;

          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
              tabIndex={disabled ? -1 : rating === 0 ? (starValue === 1 ? 0 : -1) : checked ? 0 : -1}
              disabled={disabled}
              onClick={() => setRating(starValue)}
              className={`flex size-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 ${
                filled
                  ? "text-star"
                  : "text-ink-faint hover:text-star/70"
              }`}
            >
              <FiStar
                aria-hidden="true"
                size={28}
                fill={filled ? "currentColor" : "none"}
                strokeWidth={1.6}
              />
            </button>
          );
        })}
        <span className="ml-2 font-mono text-sm text-ink-muted">
          {rating > 0 ? `${rating} / ${MAX}` : "Unrated"}
        </span>
      </div>
    </div>
  );
}

export default StarRating;
