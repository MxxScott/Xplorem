import { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./Layouts/RootLayout";
import PageLoader from "./components/common/PageLoader";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RouteError from "./components/common/RouteError";
import StartupAnimation from "./components/common/StartupAnimation";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { WatchlistProvider } from "./context/WatchlistContext";
import lazyWithRetry from "./utils/lazyWithRetry";

// Home ships in the main bundle since it's the entry point; the rest split out
// so the first paint isn't waiting on pages the user may never open. This is
// also what gives PageLoader something to cover — the chunk fetch.
//
// NotFound is deliberately NOT split. It's the fallback for a broken URL and
// RouteError reuses it for 404 responses, so it has to be renderable at the
// moment chunk loading is what failed — fetching a chunk to explain that a
// chunk could not be fetched is the one case guaranteed not to work.
//
// lazyWithRetry rather than React.lazy: a chunk request that fails once (dev
// server restarted, deploy swapped the hashed filenames, flaky network) is
// retried, then recovered with a single reload, instead of dumping the user on
// an error screen for a problem that a re-request fixes.
const Login = lazyWithRetry(() => import("./pages/Login"));
const Signup = lazyWithRetry(() => import("./pages/Signup"));
const MediaDetails = lazyWithRetry(() => import("./pages/MediaDetails"));
const Search = lazyWithRetry(() => import("./pages/Search"));
const Watchlist = lazyWithRetry(() => import("./pages/Watchlist"));

// Whole-page waits get the falling-cubes loader; in-page data waits get the
// small spinner (see MediaGrid).
function Page({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// Built once at module scope — rebuilding the router on every render would
// remount the whole tree and drop page state.
//
// errorElement on the layout route catches anything thrown below it — including
// the lazy-import failures React.lazy surfaces as render errors — and keeps the
// nav and footer in place, so an error inside one page doesn't blank the app.
// The child routes get their own so an error in a page can be recovered from
// without unmounting the layout.
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<RouteError />}>
      <Route index element={<Home />} errorElement={<RouteError />} />
      <Route
        path="login"
        element={
          <Page>
            <Login />
          </Page>
        }
        errorElement={<RouteError />}
      />
      <Route
        path="signup"
        element={
          <Page>
            <Signup />
          </Page>
        }
        errorElement={<RouteError />}
      />
      <Route
        path="media/:id"
        element={
          <Page>
            <MediaDetails />
          </Page>
        }
        errorElement={<RouteError />}
      />
      <Route
        path="search"
        element={
          <Page>
            <Search />
          </Page>
        }
        errorElement={<RouteError />}
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
        errorElement={<RouteError />}
      />
      {/* No <Page> wrapper — NotFound is statically imported, so there is no
          chunk to suspend on. */}
      <Route path="*" element={<NotFound />} errorElement={<RouteError />} />
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
