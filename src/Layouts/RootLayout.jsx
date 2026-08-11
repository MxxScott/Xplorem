import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { LayoutProvider } from "../context/LayoutContext";

function RootLayout() {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {/* Sidebar is fixed, so it sits outside the flow and the content below
            only needs to reserve room for the collapsed rail. */}
        <Sidebar />
        {/* No max-width here on purpose: a wrapper would trap the hero, and
            escaping it needs 100vw (overflows past the scrollbar) or
            overflow-x:hidden (breaks the sticky navbar). Pages set their own
            max-width instead, so full-bleed sections just work. */}
        <main className="min-w-0 flex-1 px-6 py-8 lg:pl-24">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LayoutProvider>
  );
}

export default RootLayout;
