export default function AIInsightsPanel({ insights, loading }) {
  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">AI Insights</p>
          <p className="text-sm text-ink/60 dark:text-slate-400">
            Mock intelligence generated from your habit patterns
          </p>
        </div>
        {loading && <span className="text-sm text-coral">Refreshing...</span>}
      </div>

      <div className="grid gap-4">
        {insights?.map((insight) => (
          <div
            key={insight.title}
            className="rounded-3xl border border-black/5 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-800/70"
          >
            <h3 className="text-base font-bold">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/70 dark:text-slate-300">{insight.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
