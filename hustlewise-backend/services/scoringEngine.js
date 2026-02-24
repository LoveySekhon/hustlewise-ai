// services/scoringEngine.js

const calculateSkillScore = (userSkills, hustleSkills) => {
    if (!hustleSkills.length) return 0;

    const matches = hustleSkills.filter(skill =>
        userSkills.includes(skill)
    );

    return (matches.length / hustleSkills.length) * 100;
};

const calculateTimeScore = (userHours, minTime, idealTime) => {
    if (userHours >= idealTime) return 100;

    if (userHours >= minTime) {
        const range = idealTime - minTime;
        const progress = userHours - minTime;
        return 70 + (progress / range) * 30;
    }

    return 30; // heavy penalty
};

const calculateBudgetScore = (userBudget, minBudget) => {
    if (userBudget >= minBudget) return 100;

    const ratio = userBudget / minBudget;

    if (ratio >= 0.75) return 80;
    if (ratio >= 0.5) return 60;
    if (ratio >= 0.25) return 40;

    return 20;
};

const calculateRiskScore = (userRisk, hustleRisk) => {
    const diff = Math.abs(userRisk - hustleRisk);
    return Math.max(0, 100 - diff * 10);
};

const calculateGrowthScore = (automation, scalability, timeToIncome) => {
    // Normalize time to income (lower is better)
    const timeScore = Math.max(0, 100 - (timeToIncome * 10));

    const automationScore = automation * 10;
    const scalabilityScore = scalability * 10;

    return (automationScore + scalabilityScore + timeScore) / 3;
};

const calculateFinalScore = ({
    userSkills,
    hustleSkills,
    userHours,
    minTime,
    idealTime,
    userBudget,
    minBudget,
    userRisk,
    hustleRisk,
    automation,
    scalability,
    timeToIncome
}) => {

    const skillScore = calculateSkillScore(userSkills, hustleSkills);
    const timeScore = calculateTimeScore(userHours, minTime, idealTime);
    const budgetScore = calculateBudgetScore(userBudget, minBudget);
    const riskScore = calculateRiskScore(userRisk, hustleRisk);
    const growthScore = calculateGrowthScore(automation, scalability, timeToIncome);

    const finalScore =
        (0.30 * skillScore) +
        (0.20 * timeScore) +
        (0.15 * budgetScore) +
        (0.15 * riskScore) +
        (0.20 * growthScore);

    return {
        skillScore,
        timeScore,
        budgetScore,
        riskScore,
        growthScore,
        finalScore: Number(finalScore.toFixed(2))
    };
};

module.exports = {
    calculateFinalScore
};