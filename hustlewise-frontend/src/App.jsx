import { useState } from "react";
import ProfilePage from "./pages/ProfilePage";
import RecommendationPage from "./pages/RecommendationPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [aiMode, setAiMode] = useState(null); // ✅ Added

  return (
    <div style={{ padding: "20px" }}>
      <h1>HustleWise AI</h1>

      <ProfilePage 
        setRecommendations={setRecommendations}
        setAiMode={setAiMode}   // ✅ Pass this down
      />

      <RecommendationPage 
        recommendations={recommendations} 
        aiMode={aiMode}         // ✅ Now this exists
      />

      <DashboardPage />
    </div>
  );
}

export default App;