import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Too short").required("Required"),
      })}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const res = await fetch("http://localhost:5000/auth/login", {
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
        <label>Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" />

        <label>Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" component="div" />

        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
