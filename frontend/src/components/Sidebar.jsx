import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/habits", label: "Habits" },
  { to: "/analytics", label: "Analytics" },
  { to: "/insights", label: "AI Insights" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="glass-card flex w-full flex-col gap-8 p-6 lg:w-72">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal dark:text-teal/80">
          AI Habit Tracker
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">
          Build routines that actually stick.
        </h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-ink text-white shadow-lg dark:bg-coral"
                  : "text-ink/70 hover:bg-white/80 dark:text-slate-200 dark:hover:bg-slate-800"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-gradient-to-br from-coral to-teal p-5 text-white">
        <p className="text-sm font-semibold">Consistency cue</p>
        <p className="mt-2 text-sm text-white/85">
          Protect your streak with a quick 2-minute version of each habit on busy days.
        </p>
      </div>
    </aside>
  );
}
