import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getToken } from "../services/api";

const BookingForm = () => {
  const { stayId } = useParams();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ start_date: "", end_date: "", note: "" }}
      validationSchema={Yup.object({
        start_date: Yup.string().required("Start date is required"),
        end_date: Yup.string().required("End date is required"),
      })}
      onSubmit={async (values, { setSubmitting, setErrors, isSubmitting }) => {
        // Prevent duplicate submissions
        if (isSubmitting) return;
        setSubmitting(true);

        try {
          const res = await fetch("/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ ...values, stay_id: stayId }),
          });

          const data = await res.json();

          if (res.ok) {
            navigate("/bookings");
          } else {
            setErrors({ start_date: data.error || "Booking failed" });
          }
        } catch (err) {
          console.error("Network error:", err);
          setErrors({
            start_date:
              "Server unavailable. Please check if the backend server is running on port 5000.",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form>
        <label>Start Date</label>
        <Field name="start_date" type="date" />
        <ErrorMessage name="start_date" component="div" />

        <label>End Date</label>
        <Field name="end_date" type="date" />
        <ErrorMessage name="end_date" component="div" />

        <label>Note (optional)</label>
        <Field name="note" as="textarea" />

        <button type="submit">Book Stay</button>
      </Form>
    </Formik>
  );
};

export default BookingForm;
