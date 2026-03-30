import { useTheme } from "react-theme-switcher-kit";

import { useAuth } from "../context/AuthContext";
import { useAppStore } from "../store/useAppStore";
import { saveTheme } from "../utils/theme";

export default function Topbar() {
  const { user, logout } = useAuth();
  const { search, setSearch } = useAppStore();
  const { currentTheme, toggleTheme } = useTheme();

  const setTheme = (theme) => {
    toggleTheme(theme);
    saveTheme(theme);
  };

  return (
    <div className="glass-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-md">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search habits, streaks, insights..."
          className="w-full rounded-2xl border border-black/5 bg-white/70 px-4 py-3 text-sm outline-none ring-0 placeholder:text-ink/45 focus:border-coral dark:border-white/10 dark:bg-slate-800 dark:placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        <button
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-slate-800"
        >
          {currentTheme === "dark" ? "Light" : "Dark"}
        </button>
        <div className="rounded-2xl bg-ink px-4 py-3 text-sm text-white dark:bg-coral">
          {user?.email}
        </div>
        <button
          onClick={logout}
          className="rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
