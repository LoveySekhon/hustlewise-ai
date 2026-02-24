// services/progressEngine.js

const calculateConsistency = (activeDays) => {
    return Math.min(100, (activeDays / 7) * 100);
};

const calculateMomentum = (avgHours) => {
    return Math.min(100, avgHours * 10);
};

const calculateDropoutRisk = ({ missedDays, avgEnergy, revenueLast14, consistency }) => {
    let risk = 0;

    // 1️⃣ Inconsistency penalty (5% per missed day)
    risk += missedDays * 5;

    // 2️⃣ Low energy penalty
    if (avgEnergy < 5) {
        risk += (5 - avgEnergy) * 5;
    }

    // 3️⃣ No revenue penalty
    if (revenueLast14 === 0) {
        risk += 15;
    }

    // 4️⃣ Stagnation penalty (high effort but no revenue)
    if (consistency > 60 && revenueLast14 === 0) {
        risk += 10;
    }

    return Math.min(100, Number(risk.toFixed(2)));
};

const calculateSuccessLikelihood = ({ consistency, momentum, revenueFactor }) => {
    return Number((
    (0.4 * consistency) +
    (0.3 * momentum) +
    (0.3 * revenueFactor)
).toFixed(2));
};

module.exports = {
    calculateConsistency,
    calculateMomentum,
    calculateDropoutRisk,
    calculateSuccessLikelihood
};