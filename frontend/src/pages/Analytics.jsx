import { useEffect, useState } from "react";

import api from "../axios/client";
import Charts from "../components/Charts";
import StatsCards from "../components/StatsCards";

export default function Analytics() {
  const [stats, setStats] = useState({
    current_streak: 0,
    completed_today: 0,
    weekly_completion_rate: 0,
    weekly_progress: [],
    habit_completion: [],
  });

  useEffect(() => {
    api.get("/stats").then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="space-y-4">
      <StatsCards stats={stats} />
      <Charts weeklyProgress={stats.weekly_progress} habitCompletion={stats.habit_completion} />
    </div>
  );
}
