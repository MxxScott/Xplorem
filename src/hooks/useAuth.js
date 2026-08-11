import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// Lives outside AuthContext.jsx so that file only exports components — sharing a
// module between a component and a plain function breaks Fast Refresh.
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}

export default useAuth;
