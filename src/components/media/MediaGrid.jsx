import MediaCard from "./MediaCard";
import LoadingSpinner from "../common/LoadingSpinner";

function MediaGrid({ items, loading, error, emptyMessage = "Nothing to show yet." }) {
  if (loading) {
    return <LoadingSpinner size="lg" className="py-16" label="Loading titles" />;
  }

  if (error) {
    return (
      <p role="alert" className="py-16 text-center text-sm text-danger">
        {error.message}
      </p>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-ink-subtle">{emptyMessage}</p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <li key={`${item.media_type || "media"}-${item.id}`}>
          <MediaCard item={item} />
        </li>
      ))}
    </ul>
  );
}

export default MediaGrid;
