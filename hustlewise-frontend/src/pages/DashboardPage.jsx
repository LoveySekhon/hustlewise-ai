import { useState } from "react";
import API from "../services/api";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  
  const userId = 1;

  const handleLog = async () => {
    await API.post(`/progress/${userId}`, {
      hustle_id: 6,
      hours_worked: 2,
      output_count: 2,
      revenue_generated: 0,
      energy_level: 7
    });

    alert("Progress Logged");
  };

  const handleFetch = async () => {
    const res = await API.get(`/progress/${userId}`);
    setAnalytics(res.data.data);
  };

  return (
  <div className="dashboard-container">
    <h2>Progress Dashboard</h2>

    <div className="dashboard-actions">
      <button onClick={handleLog}>Log Today’s Work</button>
      <button onClick={handleFetch}>Refresh Analytics</button>
    </div>

    {analytics && (
      <div className="analytics-cards">
        <div className="analytics-card">
          <h4>Consistency</h4>
          <p>{analytics.consistency}%</p>
        </div>

        <div className="analytics-card">
          <h4>Momentum</h4>
          <p>{analytics.momentum}</p>
        </div>

        <div className="analytics-card">
          <h4>Dropout Risk</h4>
          <p>{analytics.dropoutRisk}%</p>
        </div>

        <div className="analytics-card">
          <h4>Success Likelihood</h4>
          <p>{analytics.successLikelihood}%</p>
        </div>
      </div>
    )}
  </div>
);
}