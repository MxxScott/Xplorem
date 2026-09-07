import { createContext, useCallback, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";
import { useToast } from "./ToastContext";

const WatchlistContext = createContext(null);
const WATCHLIST_KEY = "xplorem:watchlist";
const STORAGE_ERROR =
  "Couldn't update your library. Storage may be full or unavailable.";

function mediaKey(item) {
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  return `${mediaType}:${item.id}`;
}

function normalizeItem(item) {
  return {
    ...item,
    media_type: item.media_type || (item.title ? "movie" : "tv"),
  };
}

const guestValue = {
  items: [],
  isSaved: () => false,
  getItem: () => null,
  toggle: () => false,
  saveReview: () => false,
};

function UserWatchlist({ userId, children }) {
  const [items, setItems] = useLocalStorage(`${WATCHLIST_KEY}:${userId}`, []);
  const toast = useToast();

  const isSaved = useCallback(
    (item) => items.some((savedItem) => mediaKey(savedItem) === mediaKey(item)),
    [items],
  );

  const getItem = useCallback(
    (item) =>
      items.find((savedItem) => mediaKey(savedItem) === mediaKey(item)) || null,
    [items],
  );

  const toggle = useCallback(
    (item) => {
      const normalized = normalizeItem(item);
      const removing = items.some(
        (savedItem) => mediaKey(savedItem) === mediaKey(normalized),
      );

      // Optimistic: setItems commits to React state first, then persists. A
      // failed write rolls the hook state back and we surface a toast.
      const ok = setItems((current) => {
        if (
          current.some(
            (savedItem) => mediaKey(savedItem) === mediaKey(normalized),
          )
        ) {
          return current.filter(
            (savedItem) => mediaKey(savedItem) !== mediaKey(normalized),
          );
        }

        return [...current, normalized];
      });

      if (!ok) {
        toast.error(STORAGE_ERROR);
        return false;
      }

      toast.success(
        removing ? "Removed from your library." : "Saved to your library.",
      );
      return true;
    },
    [items, setItems, toast],
  );

  const saveReview = useCallback(
    (item, { userRating, notes }) => {
      const normalized = normalizeItem(item);
      const reviewedAt = new Date().toISOString();

      const ok = setItems((current) => {
        const index = current.findIndex(
          (savedItem) => mediaKey(savedItem) === mediaKey(normalized),
        );

        const reviewFields = {
          userRating: userRating || null,
          notes: notes || "",
          reviewedAt,
        };

        if (index === -1) {
          return [...current, { ...normalized, ...reviewFields }];
        }

        return current.map((savedItem, itemIndex) =>
          itemIndex === index ? { ...savedItem, ...reviewFields } : savedItem,
        );
      });

      if (!ok) {
        toast.error(STORAGE_ERROR);
        return false;
      }

      toast.success("Review saved.");
      return true;
    },
    [setItems, toast],
  );

  const value = useMemo(
    () => ({ items, isSaved, getItem, toggle, saveReview }),
    [items, isSaved, getItem, toggle, saveReview],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

function WatchlistProvider({ children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <WatchlistContext.Provider value={guestValue}>
        {children}
      </WatchlistContext.Provider>
    );
  }

  return (
    <UserWatchlist key={user.id} userId={user.id}>
      {children}
    </UserWatchlist>
  );
}

export { WatchlistProvider };
export default WatchlistContext;
