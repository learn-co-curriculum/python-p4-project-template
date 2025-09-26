import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { LanguageProvider } from "./LanguageContext";
import NavBar from "./NavBar";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Profile from "./profile";
import Readings from "./Readings";
import Medications from "./Medications";
import FoodInsights from "./FoodInsights";
import SmartAlerts from "./Smartalert";
import Gamification from "./Gamification";
import Education from "./education";
import Reminders from "./Reminders";
import DoctorMessages from "./DoctorMessages";
import Home from "./Home";
import OnboardingGuard from "./OnboardingGuard";
import ForgotPassword from "./ForgotPassword";

function PrivateRoute({ children, ...rest }) {
  const { isAuthed } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthed ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <NavBar />
          <div className="container">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <PrivateRoute path="/dashboard">
                <OnboardingGuard requireProfile requireReading requireEducation>
                  <Dashboard />
                </OnboardingGuard>
              </PrivateRoute>
              <PrivateRoute path="/profile">
                <OnboardingGuard>
                  <Profile />
                </OnboardingGuard>
              </PrivateRoute>
              <PrivateRoute path="/readings">
                <OnboardingGuard requireProfile>
                  <Readings />
                </OnboardingGuard>
              </PrivateRoute>
              <PrivateRoute path="/medications">
                <Medications />
              </PrivateRoute>
              <PrivateRoute path="/food-insights">
                <FoodInsights />
              </PrivateRoute>
              <PrivateRoute path="/smart-alerts">
                <SmartAlerts />
              </PrivateRoute>
              <PrivateRoute path="/gamification">
                <Gamification />
              </PrivateRoute>
              <PrivateRoute path="/education">
                <OnboardingGuard requireProfile requireReading>
                  <Education />
                </OnboardingGuard>
              </PrivateRoute>
              <PrivateRoute path="/reminders">
                <Reminders />
              </PrivateRoute>
              <PrivateRoute path="/doctor-messages">
                <DoctorMessages />
              </PrivateRoute>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
