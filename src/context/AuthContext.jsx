import { createContext, useCallback, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

const USERS_KEY = "xplorem:users";
const SESSION_KEY = "xplorem:session";

// Client-side only. There is no server, so "accounts" are records in
// localStorage and the password is stored as a lightly obscured string — enough
// to keep it out of plain sight in devtools, NOT real security. Do not reuse a
// password here that matters anywhere else. See README for the tradeoff.
function obscure(password) {
  return btoa(unescape(encodeURIComponent(`xplorem:${password}`)));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function toSession(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage(USERS_KEY, []);
  const [session, setSession, clearSession] = useLocalStorage(SESSION_KEY, null);

  const signup = useCallback(
    ({ name, email, password }) => {
      const cleanEmail = normalizeEmail(email);

      if (users.some((user) => user.email === cleanEmail)) {
        throw new Error("An account with that email already exists.");
      }

      const user = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: cleanEmail,
        password: obscure(password),
        createdAt: new Date().toISOString(),
      };

      setUsers((current) => [...current, user]);
      setSession(toSession(user));
      return user;
    },
    [users, setUsers, setSession],
  );

  const login = useCallback(
    ({ email, password }) => {
      const cleanEmail = normalizeEmail(email);
      const user = users.find((candidate) => candidate.email === cleanEmail);

      if (!user || user.password !== obscure(password)) {
        throw new Error("Incorrect email or password.");
      }

      setSession(toSession(user));
      return user;
    },
    [users, setSession],
  );

  const logout = useCallback(() => clearSession(), [clearSession]);

  const updateProfile = useCallback(
    ({ name }) => {
      if (!session) throw new Error("You need to be signed in.");

      const trimmed = name.trim();
      if (!trimmed) throw new Error("Name is required.");

      setUsers((current) =>
        current.map((user) =>
          user.id === session.id ? { ...user, name: trimmed } : user,
        ),
      );
      setSession((current) => (current ? { ...current, name: trimmed } : current));
    },
    [session, setUsers, setSession],
  );

  const changePassword = useCallback(
    ({ currentPassword, nextPassword }) => {
      if (!session) throw new Error("You need to be signed in.");

      const user = users.find((candidate) => candidate.id === session.id);
      if (!user || user.password !== obscure(currentPassword)) {
        throw new Error("Current password is incorrect.");
      }

      setUsers((current) =>
        current.map((entry) =>
          entry.id === session.id
            ? { ...entry, password: obscure(nextPassword) }
            : entry,
        ),
      );
    },
    [session, users, setUsers],
  );

  const deleteAccount = useCallback(() => {
    if (!session) throw new Error("You need to be signed in.");

    const userId = session.id;
    setUsers((current) => current.filter((user) => user.id !== userId));
    clearSession();

    try {
      localStorage.removeItem(`xplorem:watchlist:${userId}`);
    } catch {
      // Storage may be unavailable; account records are already cleared.
    }
  }, [session, setUsers, clearSession]);

  const value = useMemo(
    () => ({
      user: session,
      isAuthenticated: Boolean(session),
      signup,
      login,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
    }),
    [
      session,
      signup,
      login,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
export default AuthContext;
