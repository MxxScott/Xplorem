
const variants = {
  primary: "bg-brand text-canvas hover:bg-brand/90 disabled:hover:bg-brand",
  secondary:
    "bg-surface text-ink-muted border border-border/50 hover:bg-surface-raised disabled:hover:bg-surface",
  ghost: "text-ink-muted hover:text-brand hover:bg-surface disabled:hover:bg-transparent",
  danger: "bg-danger text-canvas hover:bg-danger/90 disabled:hover:bg-danger",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
