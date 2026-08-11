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
      setSession({ id: user.id, name: user.name, email: user.email });
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

      setSession({ id: user.id, name: user.name, email: user.email });
      return user;
    },
    [users, setSession],
  );

  const logout = useCallback(() => clearSession(), [clearSession]);

  const value = useMemo(
    () => ({ user: session, isAuthenticated: Boolean(session), signup, login, logout }),
    [session, signup, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
export default AuthContext;
