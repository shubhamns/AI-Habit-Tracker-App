import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Charts({ weeklyProgress, habitCompletion }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="glass-card p-6">
        <div className="mb-6">
          <p className="text-lg font-bold">Weekly progress</p>
          <p className="text-sm text-ink/60 dark:text-slate-400">Completed habits across the past 7 days</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.15} />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#f26b5b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="mb-6">
          <p className="text-lg font-bold">Habit completion</p>
          <p className="text-sm text-ink/60 dark:text-slate-400">Completion totals by habit this week</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={habitCompletion}>
              <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.15} />
              <XAxis dataKey="habit" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="completed" fill="#1f7a8c" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
