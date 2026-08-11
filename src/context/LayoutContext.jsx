import { createContext, useMemo, useState } from "react";

const LayoutContext = createContext(null);

// Chrome that reacts to page content lives here. The Sidebar renders in
// RootLayout but needs to know whether Home's hero is on screen, and the two
// are siblings — this is the seam between them. Pages without a hero simply
// never flip the flag, so the sidebar keeps its solid background there.
function LayoutProvider({ children }) {
  const [isOverHero, setIsOverHero] = useState(false);

  const value = useMemo(() => ({ isOverHero, setIsOverHero }), [isOverHero]);

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export { LayoutProvider };
export default LayoutContext;
