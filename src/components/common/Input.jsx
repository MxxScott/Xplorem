import { useId } from "react";

function Input({
  label,
  type = "text",
  error,
  hint,
  icon,
  className = "",
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-bold text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3 flex text-ink-subtle">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={`h-10 w-full rounded-full border bg-surface text-ink placeholder:text-ink-subtle transition-colors focus:border-brand focus:outline-none ${
            icon ? "pl-10 pr-4" : "px-4"
          } ${error ? "border-danger" : "border-border/50"} ${className}`}
          {...props}
        />
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
