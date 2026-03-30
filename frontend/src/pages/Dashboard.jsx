import { useEffect, useState } from "react";

import api from "../axios/client";
import AIInsightsPanel from "../components/AIInsightsPanel";
import Charts from "../components/Charts";
import HabitGrid from "../components/HabitGrid";
import StatsCards from "../components/StatsCards";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({
    current_streak: 0,
    completed_today: 0,
    weekly_completion_rate: 0,
    weekly_progress: [],
    habit_completion: [],
  });
  const [insights, setInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const loadData = async () => {
    const [{ data: habitsData }, { data: statsData }, { data: insightsData }] = await Promise.all([
      api.get("/habits"),
      api.get("/stats"),
      api.get("/ai-insights"),
    ]);
    setHabits(habitsData);
    setStats(statsData);
    setInsights(insightsData.insights);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (habitId, date, completed) => {
    await api.post("/track", { habit_id: habitId, date, completed });
    setLoadingInsights(true);
    await loadData();
    setLoadingInsights(false);
  };

  return (
    <div className="space-y-4">
      <StatsCards stats={stats} />
      <Charts weeklyProgress={stats.weekly_progress} habitCompletion={stats.habit_completion} />
      <HabitGrid habits={habits} onToggle={handleToggle} />
      <AIInsightsPanel insights={insights} loading={loadingInsights} />
    </div>
  );
}
