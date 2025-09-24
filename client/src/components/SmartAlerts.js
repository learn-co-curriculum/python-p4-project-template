import React, { useState, useEffect, useMemo } from "react";
import { useI18n } from "../contexts/LanguageContext";

/* ================================
   Local Smart Alerts (Mock System)
   ================================ */
const SmartAlertsLocal = () => {
  const [alerts, setAlerts] = useState([]);
  const [preferences, setPreferences] = useState({
    glucoseAlerts: true,
    mealReminders: true,
    exercisePrompts: true,
    culturalTips: true,
    medicationReminders: true,
  });
  const [userProfile, setUserProfile] = useState({
    targetGlucoseRange: [80, 140],
    preferredLanguage: "english",
    diabetesType: "type2",
    activityLevel: "moderate",
  });

  // --- mock alerts (unchanged from your branch) ---
  const mockAlerts = [
    {
      id: 1,
      type: "glucose_warning",
      priority: "high",
      title_english: "High Glucose Alert",
      title_swahili: "Onyo la Sukari ya Juu",
      message_english:
        "Your glucose level is predicted to be high after this meal. Consider reducing ugali portion.",
      message_swahili:
        "Kiwango cha sukari yako kinatarajiwa kuwa juu baada ya chakula hiki. Fikiria kupunguza sehemu ya ugali.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actionable: true,
      actions: [
        { text: "Take a 10-minute walk", text_swahili: "Tembea kwa dakika 10" },
        { text: "Drink water", text_swahili: "Nywa maji" },
      ],
      icon: "⚠️",
      read: false,
    },
    // … rest of your mock alerts
  ];

  useEffect(() => {
    setTimeout(() => {
      setAlerts(mockAlerts);
    }, 500);

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newAlert = generateRandomAlert();
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomAlert = () => ({
    id: Date.now(),
    type: "hydration_reminder",
    title_english: "Hydration Reminder",
    title_swahili: "Ukumbusho wa Maji",
    message_english: "Remember to drink water! Proper hydration helps with glucose control.",
    message_swahili: "Kumbuka kunywa maji! Maji ya kutosha yanasaidia kudhibiti sukari.",
    timestamp: new Date(),
    actionable: true,
    actions: [
      { text: "Done", text_swahili: "Imekwisha" },
      { text: "Remind later", text_swahili: "Nikumbushe baadaye" },
    ],
    read: false,
    icon: "💧",
    priority: "low",
  });

  const markAsRead = (id) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));

  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const formatTimestamp = (ts) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(m / 60);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const unreadCount = alerts.filter((a) => !a.read).length;
  const highPriorityCount = alerts.filter((a) => a.priority === "high" && !a.read).length;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>🔔 Smart Health Alerts (Local)</h1>
      <p>{unreadCount} unread, {highPriorityCount} urgent</p>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            border: `2px solid ${alert.read ? "#ddd" : "#2196F3"}`,
            marginBottom: 12,
            padding: 12,
            borderRadius: 8,
            opacity: alert.read ? 0.6 : 1,
          }}
        >
          <strong>{userProfile.preferredLanguage === "swahili" ? alert.title_swahili : alert.title_english}</strong>
          <p>{userProfile.preferredLanguage === "swahili" ? alert.message_swahili : alert.message_english}</p>
          <small>{formatTimestamp(alert.timestamp)}</small>
          {!alert.read && <button onClick={() => markAsRead(alert.id)}>Mark as read</button>}
          <button onClick={() => dismissAlert(alert.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};

/* ================================
   API Smart Alerts (Prediction Form)
   ================================ */
function SmartAlertsAPI() {
  const { t } = useI18n();
  const [recent, setRecent] = useState("120, 135, 142");
  const [carbs, setCarbs] = useState("45");
  const [gi, setGi] = useState("55");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const parsedRecent = useMemo(
    () =>
      recent
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number),
    [recent]
  );

  function predict() {
    setLoading(true);
    setError(null);
    setResult(null);
    fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recent_readings: parsedRecent,
        carbs: Number(carbs),
        gi: Number(gi),
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setResult(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  function riskColor(risk) {
    if (risk === "low") return "#1e88e5";
    if (risk === "target") return "#2e7d32";
    if (risk === "elevated") return "#f9a825";
    if (risk === "high") return "#c62828";
    return "#555";
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>{t("alerts_title")} (API)</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, maxWidth: 720 }}>
        <label>
          {t("recent_readings")}
          <input value={recent} onChange={(e) => setRecent(e.target.value)} />
        </label>
        <label>
          {t("food_carbs")}
          <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        </label>
        <label>
          {t("food_gi")}
          <input type="number" value={gi} onChange={(e) => setGi(e.target.value)} />
        </label>
      </div>
      <button onClick={predict} disabled={loading}>
        {loading ? t("predicting") : t("predict")}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <p>
            {t("predicted_glucose")}: <strong>{result.predicted_glucose} mg/dL</strong>
          </p>
          <p>
            {t("risk")}: <span style={{ color: riskColor(result.risk) }}>{result.risk}</span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ================================
   Export whichever you want
   ================================ */
// export default SmartAlertsLocal;
export default SmartAlertsAPI;
