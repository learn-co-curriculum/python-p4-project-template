import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext.jsx";

const SignupForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext);

  // Check if we came from the auth prompt
  const showBackButton =
    location.state?.from === "auth-prompt" ||
    !document.referrer.includes("/signup");

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-container">
          {showBackButton && (
            <button
              onClick={() => navigate("/")}
              className="back-button"
              type="button"
            >
              ← Back to Welcome
            </button>
          )}
          <h2 className="form-title">Join StayBuddy</h2>
          <Formik
            initialValues={{ username: "", email: "", password: "", phone: "" }}
            validationSchema={Yup.object({
              username: Yup.string()
                .min(3, "Username must be at least 3 characters")
                .matches(
                  /^[a-zA-Z0-9_]+$/,
                  "Username can only contain letters, numbers, and underscores",
                )
                .required("Username is required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .matches(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  "Password must contain at least one lowercase letter, one uppercase letter, and one number",
                )
                .required("Password is required"),
              phone: Yup.string()
                .matches(
                  /^(\+254|0)[7][0-9]{8}$/,
                  "Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)",
                )
                .required("Phone number is required"),
            })}
            onSubmit={async (
              values,
              { setSubmitting, setErrors, isSubmitting },
            ) => {
              // Prevent duplicate submissions
              if (isSubmitting) return;
              setSubmitting(true);

              try {
                // Clear any previous errors
                setErrors({});

                const response = await fetch("http://127.0.0.1:5000/auth/signup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                  setErrors({ email: data.error || "Signup failed" });
                  return;
                }

                localStorage.setItem("token", data.token);
                if (login) login(data.user);
                navigate("/");
              } catch (err) {
                console.error("Network error:", err);
                setErrors({
                  email:
                    "Network error. Please check your connection and try again.",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <Field
                    name="username"
                    type="text"
                    className="form-input"
                    placeholder="Choose a username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Create a password"
                  />
                  <small className="form-help">
                    Must contain uppercase, lowercase, and number
                  </small>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone Number
                  </label>
                  <Field
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+254712345678 or 0712345678"
                  />
                  <small className="form-help">
                    Kenyan phone number for account verification
                  </small>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary form-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="form-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
