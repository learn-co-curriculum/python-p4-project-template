import React, { useState } from 'react';
import './UserReview.css'; 

const UserReview = ({ userId, travelGuideId }) => {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!rating) {
      newErrors.rating = 'Rating is required';
    } else if (rating < 1 || rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    if (!review) {
      newErrors.review = 'Review is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetch('https://api.example.com/reviews', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, travelGuideId, rating, review }),
      });
      if (response.ok) {
        alert('Review submitted successfully');
        setRating('');
        setReview('');
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-review-form">
      <label htmlFor="rating">Rating:</label>
      <input
        type="number"
        id="rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        min="1"
        max="5"
        required
      />
      {errors.rating && <p className="error">{errors.rating}</p>}
      <label htmlFor="review">Review:</label>
      <textarea
        id="review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
        required
      />
      {errors.review && <p className="error">{errors.review}</p>}
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default UserReview;
