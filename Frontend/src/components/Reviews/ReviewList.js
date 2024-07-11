// components/Reviews.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    album_id: "",
    member_id: "",
    rating: "",
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const response = await axios.get("/reviews");
    setReviews(response.data);
  };

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/reviews", newReview);
    fetchReviews();
  };

  return (
    <div>
      <h1>Reviews</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="album_id"
          placeholder="Album ID"
          onChange={handleChange}
        />
        <input
          type="text"
          name="member_id"
          placeholder="Member ID"
          onChange={handleChange}
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          onChange={handleChange}
        />
        <textarea
          name="comment"
          placeholder="Comment"
          onChange={handleChange}
        ></textarea>
        <button type="submit">Add Review</button>
      </form>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            Album {review.album_id} by Member {review.member_id}:{" "}
            {review.comment} (Rating: {review.rating})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reviews;
