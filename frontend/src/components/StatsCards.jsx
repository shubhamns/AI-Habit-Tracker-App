const icons = ["Streak", "Today", "Weekly"];

export default function StatsCards({ stats }) {
  const cards = [
    { label: "Current streak", value: `${stats.current_streak} days` },
    { label: "Habits completed today", value: stats.completed_today },
    { label: "Weekly completion", value: `${stats.weekly_completion_rate}%` },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <div key={card.label} className="glass-card p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink/45 dark:text-slate-400">
            {icons[index]}
          </p>
          <p className="mt-4 text-sm text-ink/60 dark:text-slate-400">{card.label}</p>
          <h3 className="mt-1 text-3xl font-extrabold">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}
