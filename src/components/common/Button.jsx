
const variants = {
  primary: "bg-brand text-canvas hover:bg-brand/90 disabled:hover:bg-brand",
  secondary:
    "bg-surface text-ink-muted border border-border/50 hover:bg-surface-raised disabled:hover:bg-surface",
  ghost: "text-ink-muted hover:text-brand hover:bg-surface disabled:hover:bg-transparent",
  danger: "bg-danger text-canvas hover:bg-danger/90 disabled:hover:bg-danger",
  outline:
    "border border-border bg-transparent text-ink hover:bg-surface disabled:hover:bg-transparent",
  "outline-danger":
    "border border-danger/60 bg-transparent text-danger hover:bg-danger/10 disabled:hover:bg-transparent",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
  auth: "h-[52px] px-4 text-sm",
};

const radii = {
  full: "rounded-full",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  radius = "full",
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  const mono = size === "auth";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-bold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        mono ? "font-mono font-medium tracking-wide" : ""
      } ${variants[variant]} ${sizes[size]} ${radii[radius]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
