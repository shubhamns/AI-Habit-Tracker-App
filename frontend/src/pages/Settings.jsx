import { useTheme } from "react-theme-switcher-kit";

import { useAuth } from "../context/AuthContext";
import { saveTheme } from "../utils/theme";

export default function Settings() {
  const { user } = useAuth();
  const { currentTheme, toggleTheme } = useTheme();

  const setTheme = (theme) => {
    toggleTheme(theme);
    saveTheme(theme);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-extrabold">Profile</h2>
        <p className="mt-4 text-sm text-ink/60 dark:text-slate-400">Signed in as</p>
        <p className="mt-1 text-lg font-semibold">{user?.email}</p>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-2xl font-extrabold">Appearance</h2>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-2xl px-4 py-3 font-semibold ${
              currentTheme === "light"
                ? "bg-ink text-white"
                : "border border-black/10 dark:border-white/10"
            }`}
          >
            Light mode
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-2xl px-4 py-3 font-semibold ${
              currentTheme === "dark"
                ? "bg-coral text-white"
                : "border border-black/10 dark:border-white/10"
            }`}
          >
            Dark mode
          </button>
        </div>
      </div>
    </div>
  );
}
