import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiCalendar,
  FiEdit2,
  FiFilm,
  FiLock,
  FiLogOut,
  FiShare2,
  FiTv,
  FiUser,
} from "react-icons/fi";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";
import useWatchlist from "../hooks/useWatchlist";

function formatMemberSince(iso) {
  if (!iso) return "Member recently";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Member recently";
  return `Member since ${date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })}`;
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "XP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function StatCard({ icon: Icon, value, label, progress }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-surface/70 p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="font-sora text-2xl font-bold text-brand">{value}</p>
        <span className="flex size-10 items-center justify-center rounded-full border border-ink-muted/20 bg-ink/10 text-brand">
          <Icon aria-hidden="true" size={18} />
        </span>
      </div>
      <h3 className="font-mono text-sm text-ink-muted">{label}</h3>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#2f3540]">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
        />
      </div>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, changePassword, deleteAccount } =
    useAuth();
  const { items } = useWatchlist();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    nextPassword: "",
    confirm: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [autoplay, setAutoplay] = useState(true);

  const stats = useMemo(() => {
    const movies = items.filter((item) => item.media_type === "movie").length;
    const series = items.filter((item) => item.media_type === "tv").length;
    const reviews = items.filter(
      (item) => item.userRating || item.notes?.trim(),
    ).length;
    const rated = items.filter((item) => Number(item.vote_average) > 0);
    const avg =
      rated.length > 0
        ? (
            rated.reduce((sum, item) => sum + Number(item.vote_average), 0) /
            rated.length
          ).toFixed(1)
        : "—";

    return {
      movies,
      series,
      total: items.length,
      reviews,
      avg,
    };
  }, [items]);

  function handleSaveProfile(event) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    try {
      updateProfile({ name });
      setEditing(false);
      setProfileMessage("Profile updated.");
    } catch (error) {
      setProfileError(error.message);
    }
  }

  function handleChangePassword(event) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (passwordForm.nextPassword.length < 8) {
      setPasswordError("Use at least 8 characters for the new password.");
      return;
    }
    if (passwordForm.nextPassword !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      changePassword(passwordForm);
      setPasswordForm({ currentPassword: "", nextPassword: "", confirm: "" });
      setPasswordMessage("Password updated.");
    } catch (error) {
      setPasswordError(error.message);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setProfileMessage("Profile link copied.");
      return;
    }
    setProfileMessage(url);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this local account and its watchlist on this device? This cannot be undone.",
    );
    if (!confirmed) return;
    deleteAccount();
    navigate("/");
  }

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-0 size-64 rounded-full bg-brand/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-40 size-48 rounded-full bg-brand-bright/5 blur-3xl"
      />

      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-brand">
          Account settings
        </p>
        <h1 className="font-sora text-4xl font-semibold text-ink sm:text-5xl">
          Profile
        </h1>
      </header>

      <section className="relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-border/40 bg-surface/70 p-8 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="flex size-40 items-center justify-center rounded-full border-4 border-brand/30 bg-brand-deep font-sora text-4xl font-semibold text-brand">
              {initials(user?.name)}
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="absolute bottom-2 right-2 flex size-10 items-center justify-center rounded-full bg-brand-bright text-brand-deep"
              aria-label="Edit profile"
            >
              <FiEdit2 aria-hidden="true" size={16} />
            </button>
          </div>

          <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-sora text-3xl font-semibold leading-tight text-ink">
                {user?.name}
              </h2>
              <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/20 px-3 py-1 font-mono text-xs uppercase tracking-wide text-brand">
                Local
              </span>
            </div>
            <p className="text-lg text-ink-muted">
              Explorer · Personal watchlist on this device
            </p>
            <div className="flex flex-wrap gap-5 font-mono text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <FiCalendar aria-hidden="true" size={16} />
                {formatMemberSince(user?.createdAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiUser aria-hidden="true" size={16} />
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            radius="xl"
            onClick={() => setEditing((current) => !current)}
          >
            Edit Profile
          </Button>
          <Button radius="xl" onClick={handleShare}>
            <FiShare2 aria-hidden="true" size={16} />
            Share Profile
          </Button>
        </div>
      </section>

      {(profileMessage || profileError) && (
        <p
          role={profileError ? "alert" : "status"}
          className={`text-sm ${profileError ? "text-danger" : "text-brand"}`}
        >
          {profileError || profileMessage}
        </p>
      )}

      {editing && (
        <form
          onSubmit={handleSaveProfile}
          className="flex max-w-xl flex-col gap-4 rounded-3xl border border-border/40 bg-surface/70 p-6"
        >
          <Input
            appearance="auth"
            label="Display name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            icon={<FiUser aria-hidden="true" size={16} />}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" radius="xl">
              Save changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setName(user?.name || "");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FiFilm}
          value={stats.movies}
          label="Movies saved"
          progress={stats.movies ? Math.min(100, stats.movies * 8) : 8}
        />
        <StatCard
          icon={FiTv}
          value={stats.series}
          label="Series saved"
          progress={stats.series ? Math.min(100, stats.series * 12) : 8}
        />
        <StatCard
          icon={FiBookmark}
          value={stats.total}
          label="Library titles"
          progress={stats.total ? Math.min(100, stats.total * 6) : 8}
        />
        <StatCard
          icon={FiEdit2}
          value={stats.reviews}
          label="Reviews written"
          progress={stats.reviews ? Math.min(100, stats.reviews * 15) : 8}
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          <section className="rounded-3xl border border-border/40 bg-surface/70 p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h2 className="font-sora text-2xl font-medium text-ink">
                Local account
              </h2>
              <span className="rounded-full border border-brand/30 bg-brand/15 px-3 py-1 font-mono text-xs uppercase tracking-wide text-brand">
                Active
              </span>
            </div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
              Current plan
            </p>
            <p className="mb-3 font-sora text-2xl font-medium text-brand">
              Device-only cinema shelf
            </p>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-ink-muted">
              Your profile, watchlist, and settings stay in this browser. There
              is no cloud subscription — everything is private to this machine.
            </p>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-canvas/40 p-5">
                <p className="mb-2 font-mono text-xs uppercase text-ink-muted">
                  Storage
                </p>
                <p className="font-sora text-xl text-ink">localStorage</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-canvas/40 p-5">
                <p className="mb-2 font-mono text-xs uppercase text-ink-muted">
                  Library
                </p>
                <p className="font-sora text-xl text-ink">
                  {stats.total} {stats.total === 1 ? "title" : "titles"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/watchlist"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-base font-bold text-canvas transition-colors hover:bg-brand/90"
              >
                Open library
              </Link>
              <Button variant="secondary" radius="xl" onClick={() => setEditing(true)}>
                Edit profile
              </Button>
            </div>
          </section>

          <section className="rounded-3xl border border-border/40 bg-surface/70 p-8">
            <h2 className="mb-6 font-sora text-2xl font-medium text-ink">
              Viewing preferences
            </h2>
            <div className="flex flex-col divide-y divide-border/30">
              <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-sora text-lg text-ink">Preferred language</p>
                  <p className="font-mono text-sm text-ink-muted">
                    Primary metadata language for titles
                  </p>
                </div>
                <span className="rounded-xl border border-border/50 bg-canvas/50 px-4 py-2 font-mono text-sm text-ink">
                  English
                </span>
              </div>
              <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-sora text-lg text-ink">Subtitle style</p>
                  <p className="font-mono text-sm text-ink-muted">
                    Display preference for detail pages
                  </p>
                </div>
                <span className="rounded-xl border border-border/50 bg-canvas/50 px-4 py-2 font-mono text-sm text-ink">
                  Clean white
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <p className="font-sora text-lg text-ink">Autoplay trailers</p>
                  <p className="font-mono text-sm text-ink-muted">
                    Play hero trailers when available
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoplay}
                  onClick={() => setAutoplay((current) => !current)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    autoplay ? "bg-brand" : "bg-[#2f3540]"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-5 rounded-full bg-canvas transition-transform ${
                      autoplay ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section className="rounded-3xl border border-border/40 bg-surface/70 p-6">
            <h2 className="mb-5 font-sora text-xl font-medium text-ink">
              Security
            </h2>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <Input
                appearance="auth"
                label="Current password"
                type="password"
                autoComplete="current-password"
                icon={<FiLock aria-hidden="true" size={16} />}
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
              />
              <Input
                appearance="auth"
                label="New password"
                type="password"
                autoComplete="new-password"
                icon={<FiLock aria-hidden="true" size={16} />}
                value={passwordForm.nextPassword}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    nextPassword: event.target.value,
                  }))
                }
              />
              <Input
                appearance="auth"
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                icon={<FiLock aria-hidden="true" size={16} />}
                value={passwordForm.confirm}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    confirm: event.target.value,
                  }))
                }
              />
              {passwordError && (
                <p role="alert" className="text-sm text-danger">
                  {passwordError}
                </p>
              )}
              {passwordMessage && (
                <p role="status" className="text-sm text-brand">
                  {passwordMessage}
                </p>
              )}
              <Button type="submit" radius="xl" className="w-full">
                Update password
              </Button>
            </form>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-ink-muted transition-colors hover:text-danger"
            >
              <FiLogOut aria-hidden="true" size={16} />
              Logout
            </button>
          </section>

          <section className="rounded-3xl border border-border/40 bg-surface/70 p-6">
            <h2 className="mb-4 font-sora text-xl font-medium text-ink">
              Linked accounts
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-ink-muted">
              Social providers are shown in the design system but not wired —
              this build keeps accounts on-device only.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3">
                <span className="font-mono text-sm text-ink">Google</span>
                <span className="font-mono text-xs uppercase text-ink-faint">
                  Unavailable
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3">
                <span className="font-mono text-sm text-ink">Apple ID</span>
                <span className="font-mono text-xs uppercase text-ink-faint">
                  Unavailable
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-danger/30 bg-[rgba(147,0,10,0.05)] p-6">
            <h2 className="mb-2 font-sora text-xl font-medium text-danger">
              Danger zone
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-ink-muted">
              Removes this account and its watchlist from local storage on this
              device.
            </p>
            <Button
              variant="outline-danger"
              radius="xl"
              className="w-full"
              onClick={handleDelete}
            >
              Deactivate account
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
