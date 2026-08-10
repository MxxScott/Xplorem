
const sizes = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-[3px]",
};

function LoadingSpinner({ size = "md", label = "Loading", className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center ${className}`}
    >
      <span
        className={`animate-spin rounded-full border-border border-t-brand ${sizes[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
