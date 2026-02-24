const db = require('../config/db');
const {
    calculateConsistency,
    calculateMomentum,
    calculateDropoutRisk,
    calculateSuccessLikelihood
} = require('../services/progressEngine');

const logProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { hustle_id, hours_worked, output_count, revenue_generated, energy_level } = req.body;

        await db.promise().query(
            `INSERT INTO hustle_progress 
            (user_id, hustle_id, date, hours_worked, output_count, revenue_generated, energy_level)
            VALUES (?, ?, CURDATE(), ?, ?, ?, ?)`,
            [userId, hustle_id, hours_worked, output_count, revenue_generated, energy_level]
        );

res.json({
    success: true,
    message: "Progress logged successfully 🚀"
});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging progress" });
    }
};

const getProgressAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;

        // Last 7 days
        const [last7] = await db.promise().query(
            `SELECT COUNT(*) as activeDays, 
                    AVG(hours_worked) as avgHours,
                    AVG(energy_level) as avgEnergy
             FROM hustle_progress
             WHERE user_id = ?
             AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
            [userId]
        );

        const activeDays = last7[0].activeDays || 0;
        const avgHours = last7[0].avgHours || 0;
        const avgEnergy = last7[0].avgEnergy || 0;

        const missedDays = 7 - activeDays;

        // Revenue last 14 days
        const [rev] = await db.promise().query(
            `SELECT SUM(revenue_generated) as totalRevenue
             FROM hustle_progress
             WHERE user_id = ?
             AND date >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)`,
            [userId]
        );

        const revenueLast14 = rev[0].totalRevenue || 0;
        const revenueFactor = revenueLast14 > 0 ? 100 : 0;

        const consistency = calculateConsistency(activeDays);
        const momentum = calculateMomentum(avgHours);
const dropoutRisk = calculateDropoutRisk({
    missedDays,
    avgEnergy,
    revenueLast14,
    consistency
});        const successLikelihood = calculateSuccessLikelihood({
            consistency,
            momentum,
            revenueFactor
        });

        res.json({
    success: true,
    message: "Analytics fetched successfully",
    data: {
        consistency,
        momentum,
        dropoutRisk,
        successLikelihood
    }
});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching analytics" });
    }
};

module.exports = {
    logProgress,
    getProgressAnalytics
};