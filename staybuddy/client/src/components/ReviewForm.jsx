import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ReviewForm = ({ stayId, onReviewSubmitted, existingReview }) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    rating: Yup.number()
      .min(1, "Rating must be at least 1 star")
      .max(5, "Rating cannot exceed 5 stars")
      .required("Rating is required"),
    comment: Yup.string()
      .min(10, "Comment must be at least 10 characters")
      .max(500, "Comment cannot exceed 500 characters")
      .matches(
        /^[a-zA-Z0-9\s.,!?'-]+$/,
        "Comment contains invalid characters. Only letters, numbers, and basic punctuation allowed.",
      )
      .required("Comment is required"),
  });

  const handleSubmit = async (
    values,
    { setErrors, resetForm, setSubmitting, isSubmitting },
  ) => {
    if (isSubmitting || loading) return;
    setLoading(true);
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stay_id: stayId,
          rating: parseInt(values.rating),
          comment: values.comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        resetForm();
        if (onReviewSubmitted) {
          onReviewSubmitted(data);
        }
      } else {
        setErrors({ comment: data.error || "Failed to submit review" });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({ comment: "Network error. Please try again." });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">
        {existingReview ? "Update Your Review" : "Write a Review"}
      </h3>

      <Formik
        initialValues={{
          rating: existingReview?.rating || "",
          comment: existingReview?.comment || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="review-form">
            {/* Star Rating */}
            <div className="form-group">
              <label className="form-label">Rating *</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${values.rating >= star ? "active" : ""}`}
                    onClick={() => setFieldValue("rating", star)}
                  >
                    ⭐
                  </button>
                ))}
                <span className="rating-text">
                  {values.rating ? `${values.rating}/5 stars` : "Click to rate"}
                </span>
              </div>
              <ErrorMessage name="rating" component="div" className="error" />
            </div>

            {/* Comment */}
            <div className="form-group">
              <label className="form-label" htmlFor="comment">
                Your Review *
              </label>
              <Field
                as="textarea"
                id="comment"
                name="comment"
                className="form-textarea"
                placeholder="Share your experience with this stay..."
                rows={4}
                maxLength={500}
              />
              <div className="char-count">
                {values.comment?.length || 0}/500 characters
              </div>
              <ErrorMessage name="comment" component="div" className="error" />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !values.rating || !values.comment}
              >
                {loading
                  ? "Submitting..."
                  : existingReview
                    ? "Update Review"
                    : "Submit Review"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReviewForm;
