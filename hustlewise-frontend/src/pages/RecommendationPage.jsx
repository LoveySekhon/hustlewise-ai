export default function RecommendationPage({ recommendations, aiMode }) {
  if (!recommendations) return null;

  return (
    <div className="recommendation-container">
      
      <h2 className="section-title">Top Recommendations</h2>

      <div className="recommendation-list">
        {recommendations.recommendations.map((item) => (
          <div key={item.hustle_id} className="recommendation-card">
            <h3>{item.hustle_name}</h3>
            <p className="score">Final Score: {item.finalScore}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">AI Strategy</h2>

      {aiMode && (
        <div className={`ai-badge ${aiMode}`}>
          {aiMode === "ai"
            ? "🟢 AI Generated Strategy"
            : "🟡 Fallback Mode (Quota Limit Reached)"}
        </div>
      )}

      <div className="strategy-card">
        <h3>Why This Suits You</h3>
        <p>{recommendations.aiStrategy?.why_this_suits_you}</p>
      </div>

      <div className="strategy-card">
        <h3>Earning Expectation</h3>
        <p>{recommendations.aiStrategy?.earning_expectation}</p>
      </div>

      <div className="strategy-card">
        <h3>30-Day Roadmap</h3>
        <p style={{ whiteSpace: "pre-line" }}>
          {recommendations.aiStrategy?.roadmap_30_days}
        </p>
      </div>

      <div className="strategy-card warning">
        <h3>Honest Warning</h3>
        <p>{recommendations.aiStrategy?.honest_warning}</p>
      </div>

    </div>
  );
}