const db = require('../config/db');
const { calculateFinalScore } = require('../services/scoringEngine');
const { generateStrategy } = require('../services/aiService');

const getRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;

        // 1️⃣ Get user profile
        const [profileRows] = await db.promise().query(
            'SELECT * FROM user_profiles WHERE user_id = ?',
            [userId]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const profile = profileRows[0];

        // 2️⃣ Get user skills
        const [skillRows] = await db.promise().query(
            `SELECT s.skill_name 
             FROM user_skills us
             JOIN skills s ON us.skill_id = s.id
             WHERE us.user_id = ?`,
            [userId]
        );

        const userSkills = skillRows.map(s => s.skill_name);

        // 3️⃣ Get all hustles
        const [hustles] = await db.promise().query(
            'SELECT * FROM side_hustles'
        );

        let results = [];

        for (let hustle of hustles) {

            const [hustleSkillRows] = await db.promise().query(
                `SELECT s.skill_name
                 FROM side_hustle_skills shs
                 JOIN skills s ON shs.skill_id = s.id
                 WHERE shs.hustle_id = ?`,
                [hustle.id]
            );

            const hustleSkills = hustleSkillRows.map(s => s.skill_name);

            const scores = calculateFinalScore({
                userSkills,
                hustleSkills,
                userHours: profile.available_hours,
                minTime: hustle.min_time,
                idealTime: hustle.ideal_time,
                userBudget: profile.budget,
                minBudget: hustle.min_budget,
                userRisk: profile.risk_tolerance,
                hustleRisk: hustle.risk_level,
                automation: hustle.automation_level,
                scalability: hustle.scalability_score,
                timeToIncome: hustle.time_to_income
            });

            results.push({
                hustle_id: hustle.id,
                hustle_name: hustle.name,
                ...scores
            });
        }

        // 4️⃣ Sort by score
        results.sort((a, b) => b.finalScore - a.finalScore);
        const topThree = results.slice(0, 3);
        topThree[0].userSkills = userSkills;

        // 5️⃣ Return cached strategy if exists
        if (profile.ai_strategy) {
            const parsedStrategy =
                typeof profile.ai_strategy === "string"
                    ? JSON.parse(profile.ai_strategy)
                    : profile.ai_strategy;

            return res.json({
                success: true,
                message: "Recommendations fetched from cache",
                data: {
                    recommendations: topThree,
                    aiStrategy: parsedStrategy
                }
            });
        }

        // 6️⃣ Try generating AI strategy
        let aiRaw = null;

        try {
            aiRaw = await generateStrategy(profile, topThree[0]);
        } catch (error) {
            console.error("AI generation failed:", error.message);
        }

        // 7️⃣ If quota exceeded or failed, use fallback
        if (!aiRaw || aiRaw === "AI response unavailable.") {

            const fallbackStrategy = {
                why_this_suits_you:
                    "Based on your selected skills, available time, and risk tolerance, this side hustle aligns strongly with your profile. It leverages your strongest competencies while keeping operational complexity manageable.",
                earning_expectation:
                    "Initial earnings may be modest as you build execution momentum, but with consistent effort, income potential can scale significantly within 3–6 months.",
                roadmap_30_days:
                    "Week 1: Understand fundamentals and research niche.\nWeek 2: Build small proof-of-concept projects.\nWeek 3: Define your value proposition and pricing.\nWeek 4: Begin outreach and acquire first paying client.",
                honest_warning:
                    "Success depends on disciplined execution and continuous skill development. Avoid unrealistic income expectations and focus on consistent improvement."
            };

            return res.json({
                success: true,
                message: "AI quota exceeded — fallback strategy used",
                data: {
                    recommendations: topThree,
                    aiStrategy: fallbackStrategy
                }
            });
        }

        // 8️⃣ Clean markdown wrapper if present
        let cleaned = aiRaw.trim();

        if (cleaned.startsWith("```")) {
            cleaned = cleaned
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
        }

        let aiStrategy;

        try {
            aiStrategy = JSON.parse(cleaned);
        } catch (error) {
            console.error("JSON Parse Error:", error.message);
            console.log("RAW AI OUTPUT:", aiRaw);

            return res.status(500).json({
                success: false,
                message: "AI response parsing failed"
            });
        }

        // 9️⃣ Save valid strategy to DB
        await db.promise().query(
            `UPDATE user_profiles
             SET ai_strategy = ?
             WHERE user_id = ?`,
            [JSON.stringify(aiStrategy), userId]
        );

        return res.json({
            success: true,
            message: "Recommendations generated successfully",
            data: {
                recommendations: topThree,
                aiStrategy
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const saveUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            profession,
            monthly_income,
            available_hours,
            budget,
            risk_tolerance,
            skills
        } = req.body;

        // Save profile + invalidate cache
        await db.promise().query(
            `INSERT INTO user_profiles 
            (user_id, profession, monthly_income, available_hours, budget, risk_tolerance, ai_strategy)
            VALUES (?, ?, ?, ?, ?, ?, NULL)
            ON DUPLICATE KEY UPDATE
            profession = VALUES(profession),
            monthly_income = VALUES(monthly_income),
            available_hours = VALUES(available_hours),
            budget = VALUES(budget),
            risk_tolerance = VALUES(risk_tolerance),
            ai_strategy = NULL
            `,
            [
                userId,
                profession,
                monthly_income,
                available_hours,
                budget,
                risk_tolerance
            ]
        );

        await db.promise().query(
            `DELETE FROM user_skills WHERE user_id = ?`,
            [userId]
        );

        for (let skillId of skills) {
            await db.promise().query(
                `INSERT INTO user_skills (user_id, skill_id)
                 VALUES (?, ?)`,
                [userId, skillId]
            );
        }

        res.json({
            success: true,
            message: "Profile and skills saved successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error saving profile"
        });
    }
};

module.exports = {
    getRecommendations,
    saveUserProfile
};