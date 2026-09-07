import { useId } from "react";

function Input({
  label,
  type = "text",
  error,
  hint,
  icon,
  trailing,
  labelAside,
  appearance = "default",
  className = "",
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;
  const isAuth = appearance === "auth";

  return (
    <div className="flex w-full flex-col gap-1.5">
      {(label || labelAside) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <label
              htmlFor={inputId}
              className={
                isAuth
                  ? "font-mono text-xs font-medium uppercase tracking-wide text-ink-muted"
                  : "text-sm font-bold text-ink-muted"
              }
            >
              {label}
            </label>
          )}
          {labelAside}
        </div>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 flex text-ink-subtle">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={`${
            isAuth
              ? "h-14.5 rounded-lg border bg-surface text-base text-ink placeholder:text-ink-faint/50 focus:border-brand focus:outline-none"
              : "h-10 rounded-full border bg-surface text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none"
          } w-full transition-colors ${
            icon ? (isAuth ? "pl-11 pr-4" : "pl-10 pr-4") : isAuth ? "px-4" : "px-4"
          } ${trailing ? "pr-11" : ""} ${
            error ? "border-danger" : isAuth ? "border-border" : "border-border/50"
          } ${className}`}
          {...props}
        />
        {trailing && (
          <span className="absolute right-3.5 flex text-ink-subtle">{trailing}</span>
        )}
      </div>
      {(error || hint) && (
        <p
          id={messageId}
          className={`text-sm ${error ? "text-danger" : "text-ink-subtle"}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export default Input;
