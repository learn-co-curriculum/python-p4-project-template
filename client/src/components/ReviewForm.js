// ReviewForm.js
import React, { useState } from 'react';
import api from '../services/api';

const ReviewForm = ({ guideId }) => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/guides/${guideId}/reviews`, { rating, comment });
      // Optionally: Refresh guide details after submitting review
      // Or navigate to a different page
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
