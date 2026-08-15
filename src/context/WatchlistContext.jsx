import { createContext, useCallback, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

const WatchlistContext = createContext(null);
const WATCHLIST_KEY = "xplorem:watchlist";

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
  toggle: () => {},
};

function UserWatchlist({ userId, children }) {
  const [items, setItems] = useLocalStorage(`${WATCHLIST_KEY}:${userId}`, []);

  const isSaved = useCallback(
    (item) => items.some((savedItem) => mediaKey(savedItem) === mediaKey(item)),
    [items],
  );

  const toggle = useCallback((item) => {
    const normalized = normalizeItem(item);

    setItems((current) => {
      if (current.some((savedItem) => mediaKey(savedItem) === mediaKey(normalized))) {
        return current.filter((savedItem) => mediaKey(savedItem) !== mediaKey(normalized));
      }

      return [...current, normalized];
    });
  }, [setItems]);

  const value = useMemo(() => ({ items, isSaved, toggle }), [items, isSaved, toggle]);

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