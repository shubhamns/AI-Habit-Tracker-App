import { useEffect, useState } from "react";

import api from "../axios/client";
import AIInsightsPanel from "../components/AIInsightsPanel";

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    const { data } = await api.get("/ai-insights");
    setInsights(data.insights);
    setLoading(false);
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return <AIInsightsPanel insights={insights} loading={loading} />;
}
