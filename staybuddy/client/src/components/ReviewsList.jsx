import { useState, useEffect, useCallback } from "react";

const ReviewsList = ({ stayId, onReviewAdded }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/reviews/stay/${stayId}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data);
      } else {
        throw new Error("Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Unable to load reviews");
    } finally {
      setLoading(false);
    }
  }, [stayId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (onReviewAdded) {
      fetchReviews(); // Refresh reviews when a new one is added
    }
  }, [onReviewAdded, fetchReviews]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? "filled" : "empty"}`}
      >
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="reviews-section">
        <h3>Reviews</h3>
        <div className="text-center">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-section">
        <h3>Reviews</h3>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchReviews} className="btn btn-secondary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Reviews ({reviews.length})</h3>
        {reviews.length > 0 && (
          <div className="average-rating">
            <div className="stars">
              {renderStars(
                Math.round(
                  reviews.reduce((acc, r) => acc + r.rating, 0) /
                    reviews.length,
                ),
              )}
            </div>
            <span className="rating-text">
              {(
                reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
              ).toFixed(1)}{" "}
              out of 5
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <div className="no-reviews-icon">📝</div>
          <h4>No reviews yet</h4>
          <p>Be the first to share your experience with this stay!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-name">
                    {review.author?.username || "Anonymous"}
                  </div>
                  <div className="review-date">
                    {formatDate(review.created_at)}
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="review-content">
                <p>{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
