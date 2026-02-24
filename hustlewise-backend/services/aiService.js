
require('dotenv').config();

const generateStrategy = async (userProfile, recommendation) => {
    try {
        const prompt = `
You are a strict, analytical side hustle advisor.

USER PROFILE:
Profession: ${userProfile.profession}
Monthly Income: ${userProfile.monthly_income}
Available Hours Per Day: ${userProfile.available_hours}
Budget: ${userProfile.budget}
Risk Tolerance (1-10): ${userProfile.risk_tolerance}

USER SELECTED SKILLS:
${recommendation.userSkills ? recommendation.userSkills.join(", ") : "Provided in system"}

TOP RECOMMENDED SIDE HUSTLE:
${recommendation.hustle_name}

Suitability Score: ${recommendation.finalScore}

IMPORTANT:
Explain specifically WHY this hustle fits THIS user based on:
- Their skills
- Their time availability
- Their budget
- Their risk tolerance

Also explain:
- Why this option is better than other common side hustles for someone like them.
- Mention at least one trade-off.
- Reference specific numeric inputs from the profile.

Return STRICT JSON:
{
  "why_this_suits_you": "",
  "earning_expectation": "",
  "roadmap_30_days": "",
  "honest_warning": ""
}
`;

        const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Gemini Response Error:", data);
            return "AI response unavailable.";
        }

    } catch (error) {
        console.error("Gemini REST Error:", error.message);
        return "AI strategy generation failed.";
    }
};

module.exports = {
    generateStrategy
};