import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./Layouts/RootLayout";
import PageLoader from "./components/common/PageLoader";
import ProtectedRoute from "./components/common/ProtectedRoute";
import StartupAnimation from "./components/common/StartupAnimation";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import { WatchlistProvider } from "./context/WatchlistContext";

// Home ships in the main bundle since it's the entry point; the rest split out
// so the first paint isn't waiting on pages the user may never open. This is
// also what gives PageLoader something to cover — the chunk fetch.
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const MediaDetails = lazy(() => import("./pages/MediaDetails"));
const Search = lazy(() => import("./pages/Search"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Whole-page waits get the falling-cubes loader; in-page data waits get the
// small spinner (see MediaGrid).
function Page({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// Built once at module scope — rebuilding the router on every render would
// remount the whole tree and drop page state.
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route
        path="login"
        element={
          <Page>
            <Login />
          </Page>
        }
      />
      <Route
        path="signup"
        element={
          <Page>
            <Signup />
          </Page>
        }
      />
      <Route
        path="media/:id"
        element={
          <Page>
            <MediaDetails />
          </Page>
        }
      />
      <Route
        path="search"
        element={
          <Page>
            <Search />
          </Page>
        }
      />
      <Route
        path="watchlist"
        element={
          <ProtectedRoute>
            <Page>
              <Watchlist />
            </Page>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Page>
            <NotFound />
          </Page>
        }
      />
    </Route>,
  ),
);

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        {/* Sits above the router rather than replacing PageLoader: this is a
            one-time boot flourish, not a route transition. The app mounts and
            starts fetching behind it, so the intro overlaps work that was
            happening anyway instead of adding to it. */}
        <StartupAnimation />
        <RouterProvider router={router} />
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;
