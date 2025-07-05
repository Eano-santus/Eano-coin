// trustLevel.js

// 💠 Get Trust Status Based on Score
export function getTrustStatus(score) {
  if (score >= 500) {
    return "Trusted Miner";
  } else if (score >= 200) {
    return "Reliable Miner";
  } else if (score >= 80) {
    return "New Miner";
  } else {
    return "Needs Trust";
  }
}

// 🎖️ Get Upgrade Level Based on Score
export function getUpgradeLevel(score) {
  if (score >= 10000 && score <= 20000) {
    return "Leader";
  } else if (score >= 5000) {
    return "Master";
  } else if (score >= 1000) {
    return "Professional";
  } else if (score >= 500) {
    return "Elite";
  } else if (score >= 50) {
    return "Amateur";
  } else {
    return "Unranked";
  }
}

// 🏅 Optional: Combine both for UI display
export function getMinerStatus(score) {
  const trust = getTrustStatus(score);
  const level = getUpgradeLevel(score);
  return {
    trust,
    level
  };
}
