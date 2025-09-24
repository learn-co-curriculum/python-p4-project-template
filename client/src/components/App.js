import React, { useEffect, useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import FoodInsights from "./FoodInsights";
import SmartAlerts from "./SmartAlerts";
import Gamification from "./Gamification";
import Education from "./Education";
import { useI18n } from "../contexts/LanguageContext";

function Nav() {
  const { lang, setLang } = useI18n();
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
      <Link to="/">Home</Link>
      <Link to="/foods">Foods</Link>
      <Link to="/alerts">Alerts</Link>
      <Link to="/gamification">Gamification</Link>
      <Link to="/education">Education</Link>
      <span style={{ marginLeft: "auto" }}>
        <button onClick={() => setLang(lang === "en" ? "sw" : "en")}>
          {lang === "en" ? "🇰🇪 SW" : "🇺🇸 EN"}
        </button>
      </span>
    </nav>
  );
}

function App() {
  return (
    <>
      <Nav />
      <Switch>
        <Route path="/foods">
          <FoodInsights />
        </Route>
        <Route path="/alerts">
          <SmartAlerts />
        </Route>
        <Route path="/gamification">
          <Gamification />
        </Route>
        <Route path="/education">
          <Education />
        </Route>
        <Route path="/">
          <h1>Project Client</h1>
        </Route>
      </Switch>
    </>
  );
}

export default App;
