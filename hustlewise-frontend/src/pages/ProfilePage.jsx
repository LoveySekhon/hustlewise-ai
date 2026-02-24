import { useState } from "react";
import API from "../services/api";

export default function ProfilePage({ setRecommendations , setAiMode})  {
  const userId = 1;

  const [form, setForm] = useState({
    profession: "",
    monthly_income: "",
    available_hours: "",
    budget: "",
    risk_tolerance: "",
    skills : []
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  

 const handleSubmit = async () => {
  try {
    await API.post(`/recommendations/profile/${userId}`, form);

    const res = await API.get(`/recommendations/${userId}`);

    const backendMessage = res.data.message;

    if (backendMessage && backendMessage.toLowerCase().includes("fallback")) {
      setAiMode("fallback");
    } else {
      setAiMode("ai");
    }

    setRecommendations(res.data.data);

  } catch (error) {
    console.error(error);
    alert("Error generating recommendations");
  }
};

  const skillOptions = [
  { id: 1, name: "coding" },
  { id: 2, name: "video_editing" },
  { id: 3, name: "writing" },
  { id: 4, name: "marketing" },
  { id: 5, name: "sales" },
  { id: 6, name: "research" },
  { id: 7, name: "seo" },
  { id: 8, name: "automation" },
  { id: 9, name: "design" },
  { id: 10, name: "communication" },
  { id: 11, name: "analysis" },
  { id: 12, name: "content_strategy" },
  { id: 13, name: "ads_management" },
  { id: 14, name: "client_management" },
  { id: 15, name: "financial_literacy" },
  { id: 16, name: "problem_solving" },
  { id: 17, name: "risk_management" }
];
const handleSkillToggle = (id) => {
  setForm(prev => {
    const exists = prev.skills.includes(id);
    return {
      ...prev,
      skills: exists
        ? prev.skills.filter(skill => skill !== id)
        : [...prev.skills, id]
    };
  });
};


  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Enter Your Details</h2>

      <input name="profession" placeholder="Profession" onChange={handleChange} /><br /><br />
      <input name="monthly_income" placeholder="Monthly Income" type="number" onChange={handleChange} /><br /><br />
      <input name="available_hours" placeholder="Available Hours Per Day" type="number" onChange={handleChange} /><br /><br />
      <input name="budget" placeholder="Budget" type="number" onChange={handleChange} /><br /><br />
      <input name="risk_tolerance" placeholder="Risk Tolerance (1-10)" type="number" onChange={handleChange} /><br /><br />

        <h3>Select Your Skills</h3>
{skillOptions.map(skill => (
  <label key={skill.id} style={{ display: "block" }}>
    <input
      type="checkbox"
      onChange={() => handleSkillToggle(skill.id)}
    />
    {skill.name}
  </label>
))}
<br />
      <button onClick={handleSubmit}>
        Generate Personalized Plan
      </button>
    </div>
  );
}