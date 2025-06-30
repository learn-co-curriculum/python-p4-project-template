// client/src/components/SignupForm.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Too short").required("Required"),
      })}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const res = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("token", data.token);
            navigate("/");
          } else {
            setErrors({ email: data.error });
          }
        } catch (err) {
          console.error("Network error:", err);
          setErrors({
            email:
              "Server unavailable. Please check if the backend server is running on port 5000.",
          });
        }
        setSubmitting(false);
      }}
    >
      <Form>
        <label>Username</label>
        <Field name="username" />
        <ErrorMessage name="username" component="div" />

        <label>Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" />

        <label>Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" component="div" />

        <button type="submit">Sign Up</button>
      </Form>
    </Formik>
  );
};

export default SignupForm;
