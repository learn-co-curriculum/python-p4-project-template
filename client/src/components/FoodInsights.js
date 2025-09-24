import React, { useState, useEffect, useMemo } from "react";
import { useI18n } from "../contexts/LanguageContext";

/* ------------------------------
   Development Version (Mock Data)
--------------------------------*/
export const FoodInsightsMock = () => {
  const [kenyanFoods, setKenyanFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [glucosePrediction, setGlucosePrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockKenyanFoods = [
    {
      id: "ugali",
      name_english: "Ugali",
      name_swahili: "Ugali",
      category: "staples",
      diabetes_friendly: false,
      nutritional_info: {
        calories_per_100g: 112,
        carbohydrates_g: 24.0,
        protein_g: 2.3,
        fiber_g: 1.2,
        glycemic_index: 72,
      },
      description_english: "Traditional cornmeal staple, served with vegetables and meat",
      description_swahili: "Chakula cha msingi kinachotengenezwa na unga wa mahindi",
      health_benefits: ["Good source of energy", "Contains some protein", "Gluten-free option"],
      preparation_tips: ["Serve smaller portions", "Combine with high-fiber vegetables"],
    },
    {
      id: "githeri",
      name_english: "Githeri",
      name_swahili: "Githeri",
      category: "staples",
      diabetes_friendly: true,
      nutritional_info: {
        calories_per_100g: 130,
        carbohydrates_g: 22.0,
        protein_g: 6.5,
        fiber_g: 5.8,
        glycemic_index: 45,
      },
      description_english: "Traditional mix of boiled maize and beans",
      description_swahili: "Mchanganyiko wa mahindi na maharagwe",
      health_benefits: ["High in protein and fiber", "Low glycemic index", "Helps control blood sugar"],
      preparation_tips: ["Soak beans overnight", "Add vegetables for extra nutrients"],
    },
    {
      id: "sukuma_wiki",
      name_english: "Collard Greens",
      name_swahili: "Sukuma Wiki",
      category: "vegetables",
      diabetes_friendly: true,
      nutritional_info: {
        calories_per_100g: 35,
        carbohydrates_g: 7.3,
        protein_g: 3.3,
        fiber_g: 3.6,
        glycemic_index: 15,
      },
      description_english: "Popular leafy green vegetable, often sautéed with onions",
      description_swahili: "Mboga za majani yanayoliwa sana Kenya",
      health_benefits: ["Very low glycemic index", "High in vitamins A, C, K", "Rich in antioxidants"],
      preparation_tips: ["Don't overcook to retain nutrients", "Add minimal oil"],
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setKenyanFoods(mockKenyanFoods);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFoods = kenyanFoods.filter((food) => {
    const matchesSearch =
      food.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.name_swahili.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || food.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setLoading(true);
    setTimeout(() => {
      const mockPrediction = {
        predicted_peak_glucose: food.nutritional_info.glycemic_index + Math.random() * 20 + 80,
        risk_level: food.diabetes_friendly ? "normal" : "elevated",
        recommendations: food.preparation_tips,
      };
      setGlucosePrediction(mockPrediction);
      setLoading(false);
    }, 800);
  };

  const getGIColor = (gi) => {
    if (gi < 55) return "#4CAF50";
    if (gi < 70) return "#FF9800";
    return "#F44336";
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "normal":
        return "#4CAF50";
      case "elevated":
        return "#FF9800";
      case "high":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>🍽️ Kenyan Food Insights (Mock)</h1>
      {/* ... full UI unchanged from your version ... */}
    </div>
  );
};

/* ------------------------------
   Nick’s Version (API + i18n)
--------------------------------*/
export const FoodInsightsRemote = () => {
  const { t } = useI18n();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const url = query ? `/foods?search=${encodeURIComponent(query)}` : "/foods";
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setFoods(data);
        setError(null);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query]);

  const hasResults = useMemo(() => foods && foods.length > 0, [foods]);

  return (
    <div style={{ padding: 16 }}>
      <h2>{t("foods_title")}</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("foods_search_placeholder")}
          style={{ padding: 8, width: 320 }}
        />
      </div>
      {loading && <p>{t("loading")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !hasResults && <p>{t("no_results")}</p>}
      {hasResults && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>
                {t("food")}
              </th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>
                {t("carbs")}
              </th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>
                {t("gi")}
              </th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>
                {t("serving")}
              </th>
            </tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id}>
                <td style={{ padding: 8 }}>{f.name}</td>
                <td style={{ padding: 8, textAlign: "right" }}>{f.carbs}</td>
                <td style={{ padding: 8, textAlign: "right" }}>{f.gi}</td>
                <td style={{ padding: 8, textAlign: "right" }}>{f.serving_grams}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ------------------------------
   Default Export
   (Change here to swap versions)
--------------------------------*/
export default FoodInsightsMock;
// export default FoodInsightsRemote;
