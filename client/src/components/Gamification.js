import React, { useState, useEffect } from "react";
import { useI18n } from "../contexts/LanguageContext";

/* ================================
   Local Gamification (Mocked UI)
   ================================ */
const GamificationLocal = () => {
  const [userProgress, setUserProgress] = useState({
    totalPoints: 0,
    level: 1,
    badgesEarned: [],
    streakDays: 0,
    currentChallenges: [],
    completedChallenges: [],
  });
  const [badges, setBadges] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState("english");

  // --- mock data here ---
  const mockBadges = [
    {
      id: "first_steps",
      name_english: "First Steps",
      name_swahili: "Hatua za Kwanza",
      description_english: "Log your first health reading",
      description_swahili: "Rekodi kipimo chako cha kwanza cha afya",
      icon: "🌱",
      points_value: 50,
      rarity: "common",
      earned: true,
    },
    // ... (rest unchanged)
  ];

  const mockChallenges = [
    {
      id: "daily_reading",
      name_english: "Daily Health Check",
      name_swahili: "Uchunguzi wa Afya wa Kila Siku",
      description_english: "Log at least one health reading today",
      description_swahili: "Rekodi angalau kipimo kimoja cha afya leo",
      target_value: 1,
      current_progress: 0,
      points_reward: 25,
      type: "daily",
      timeLeft: "18h 32m",
      active: true,
    },
    // ... (rest unchanged)
  ];

  const mockLeaderboard = [
    { rank: 1, name: "Amina K.", points: 2450, level: 8, badges: 12 },
    { rank: 2, name: "John M.", points: 2180, level: 7, badges: 10 },
    { rank: 3, name: "Grace W.", points: 1920, level: 6, badges: 9 },
    { rank: 4, name: "You", points: 850, level: 4, badges: 2, isCurrentUser: true },
    { rank: 5, name: "Peter N.", points: 720, level: 3, badges: 5 },
  ];

  useEffect(() => {
    setTimeout(() => {
      setUserProgress({
        totalPoints: 850,
        level: 4,
        badgesEarned: ["first_steps", "week_warrior"],
        streakDays: 12,
        currentChallenges: ["daily_reading", "kenyan_foods_week", "glucose_stability"],
        completedChallenges: ["beginner_challenge"],
      });
      setBadges(mockBadges);
      setChallenges(mockChallenges);
      setLeaderboard(mockLeaderboard);
    }, 500);
  }, []);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common":
        return "#4CAF50";
      case "rare":
        return "#2196F3";
      case "epic":
        return "#9C27B0";
      case "legendary":
        return "#FF9800";
      default:
        return "#757575";
    }
  };

  const getChallengeTypeColor = (type) => {
    switch (type) {
      case "daily":
        return "#4CAF50";
      case "weekly":
        return "#2196F3";
      case "monthly":
        return "#9C27B0";
      default:
        return "#757575";
    }
  };

  const calculateLevelProgress = () => {
    const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];
    const currentLevelThreshold = levelThresholds[userProgress.level - 1] || 0;
    const nextLevelThreshold =
      levelThresholds[userProgress.level] || levelThresholds[levelThresholds.length - 1];

    const progress =
      ((userProgress.totalPoints - currentLevelThreshold) /
        (nextLevelThreshold - currentLevelThreshold)) *
      100;
    return Math.min(100, Math.max(0, progress));
  };

  const getNextLevelPoints = () => {
    const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];
    const nextLevelThreshold =
      levelThresholds[userProgress.level] || levelThresholds[levelThresholds.length - 1];
    return nextLevelThreshold - userProgress.totalPoints;
  };

  const earnedBadges = badges.filter((badge) => badge.earned);
  const availableBadges = badges.filter((badge) => !badge.earned);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* ... original Local Gamification JSX unchanged ... */}
      <h1>🎮 Health Gamification (Local)</h1>
      {/* keep the rest of your JSX for dashboard/badges/challenges/leaderboard */}
    </div>
  );
};

/* ================================
   API-based Gamification
   ================================ */
function GamificationAPI() {
  const { t } = useI18n();
  const [userId, setUserId] = useState("1");
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [delta, setDelta] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/users/${userId}/points`).then((r) => r.json()),
      fetch(`/users/${userId}/badges`).then((r) => r.json()),
    ])
      .then(([p, b]) => {
        setPoints(p.points || 0);
        setBadges(b.badges || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  function addPoints() {
    setLoading(true);
    setError(null);
    fetch(`/users/${userId}/points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    })
      .then((r) => r.json())
      .then(() => load())
      .catch((e) => setError(e.message));
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>{t("gamification_title")} (API)</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label>
          {t("user_id")}
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ marginLeft: 8, padding: 6 }}
          />
        </label>
        <button onClick={load} disabled={loading}>
          {t("refresh")}
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        <p>
          {t("points")}: <strong>{points}</strong>
        </p>
        <p>
          {t("badges")}: {badges.length ? badges.join(", ") : "None"}
        </p>
      </div>
      <div style={{ marginTop: 12 }}>
        <label>
          {t("add_points")}
          <input
            type="number"
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
            style={{ marginLeft: 8, padding: 6 }}
          />
        </label>
        <button onClick={addPoints} disabled={loading} style={{ marginLeft: 8 }}>
          {t("add")}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

/* ================================
   Export whichever you want
   ================================ */
// export default GamificationLocal;
export default GamificationAPI;
