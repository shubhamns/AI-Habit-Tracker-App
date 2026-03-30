const getLastSevenDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });
};

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function HabitGrid({ habits, onToggle }) {
  const days = getLastSevenDays();

  return (
    <div className="glass-card overflow-hidden p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="pb-2 text-left text-xs uppercase tracking-[0.3em] text-ink/45 dark:text-slate-400">
                Habit
              </th>
              {days.map((day) => (
                <th
                  key={formatLocalDate(day)}
                  className="pb-2 text-center text-xs uppercase tracking-[0.3em] text-ink/45 dark:text-slate-400"
                >
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td className="rounded-l-2xl bg-white/50 px-4 py-4 dark:bg-slate-800/70">
                  <div>
                    <p className="font-semibold">{habit.name}</p>
                    <p className="text-sm text-ink/55 dark:text-slate-400">{habit.frequency}</p>
                  </div>
                </td>
                {days.map((day, index) => {
                  const isoDate = formatLocalDate(day);
                  const checked = habit.logs?.some((log) => log.date === isoDate && log.completed);
                  return (
                    <td
                      key={isoDate}
                      className={`${index === days.length - 1 ? "rounded-r-2xl" : ""} bg-white/50 px-4 py-4 text-center dark:bg-slate-800/70`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => onToggle(habit.id, isoDate, event.target.checked)}
                        className="h-5 w-5 rounded border-black/10 text-coral focus:ring-coral"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
