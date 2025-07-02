import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext.jsx";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

const StayDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [stay, setStay] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [reviewsKey, setReviewsKey] = useState(0);

  useEffect(() => {
    const fetchStay = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/stays/${id}`);
        const data = await response.json();
        if (response.ok) {
          setStay(data);
        } else {
          setError("Stay not found");
        }
      } catch (err) {
        setError("Failed to load stay details");
        console.error("Error fetching stay:", err);
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`/favorites/check/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            setIsFavorited(data.is_favorited);
            setFavoriteId(data.favorite_id);
          }
        } catch (err) {
          console.error("Error checking favorite status:", err);
        }
      }
    };

    fetchStay();
    checkFavoriteStatus();
  }, [id, user]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container text-center">
          <div style={{ fontSize: "2rem", marginBottom: "16px" }}>🏠</div>
          <p>Loading stay details...</p>
        </div>
      </div>
    );
  }

  if (error || !stay) {
    return (
      <div className="main-content">
        <div className="container text-center">
          <h1>Stay Not Found</h1>
          <p>{error || "The stay you're looking for doesn't exist."}</p>
          <Link to="/" className="btn btn-primary">
            Back to Stays
          </Link>
        </div>
      </div>
    );
  }

  const hasPhotos = stay.photos && stay.photos.length > 0;
  const isOwner = user && stay && user.id === stay.user_id;

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/favorites/${favoriteId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        // For DELETE requests, we may not always have a response body
        let data = null;
        try {
          data = await response.json();
        } catch (e) {
          // No response body or invalid JSON, that's ok for DELETE
        }

        if (response.ok) {
          setIsFavorited(false);
          setFavoriteId(null);
        }
      } else {
        // Add to favorites
        const response = await fetch("/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stay_id: parseInt(id),
            notes: `Added on ${new Date().toLocaleDateString()}`,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsFavorited(true);
          setFavoriteId(data.id);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorites. Please try again.");
    }
  };

  const handleReviewSubmitted = () => {
    setReviewsKey((prev) => prev + 1); // Force refresh of reviews
  };

  return (
    <div className="main-content">
      <div className="container">
        {/* Header */}
        <div className="stay-header">
          <h1 className="stay-title">{stay.title}</h1>
          <div className="stay-location">📍 {stay.location}</div>
        </div>

        {/* Photo Gallery */}
        {hasPhotos && (
          <div className="photo-gallery">
            <div className="main-photo">
              <img
                src={stay.photos[selectedPhotoIndex].url}
                alt={stay.photos[selectedPhotoIndex].name || stay.title}
                onError={(e) => {
                  e.target.src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="%23f0f0f0"/><text x="400" y="200" text-anchor="middle" fill="%23999">Image not available</text></svg>';
                }}
              />
              {stay.photos.length > 1 && (
                <>
                  <button
                    className="photo-nav photo-nav-prev"
                    onClick={() =>
                      setSelectedPhotoIndex((prev) =>
                        prev === 0 ? stay.photos.length - 1 : prev - 1,
                      )
                    }
                  >
                    ◀
                  </button>
                  <button
                    className="photo-nav photo-nav-next"
                    onClick={() =>
                      setSelectedPhotoIndex((prev) =>
                        prev === stay.photos.length - 1 ? 0 : prev + 1,
                      )
                    }
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {stay.photos.length > 1 && (
              <div className="photo-thumbnails">
                {stay.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={photo.name || `Photo ${index + 1}`}
                    className={`thumbnail ${index === selectedPhotoIndex ? "active" : ""}`}
                    onClick={() => setSelectedPhotoIndex(index)}
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="75"><rect width="100" height="75" fill="%23f0f0f0"/><text x="50" y="40" text-anchor="middle" fill="%23999" font-size="10">No image</text></svg>';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stay Details */}
        <div className="stay-details">
          <div className="stay-info">
            <div className="stay-price-section">
              <span className="stay-price-large">KSH {stay.price}</span>
              <span className="stay-price-unit"> per night</span>
            </div>

            {stay.description && (
              <div className="stay-description-section">
                <h3>About this place</h3>
                <p className="stay-description">{stay.description}</p>
              </div>
            )}

            <div className="stay-actions">
              {!isOwner && (
                <Link
                  to={`/book/${stay.id}`}
                  className="btn btn-primary btn-large"
                >
                  Book This Stay
                </Link>
              )}

              {isOwner && (
                <Link
                  to={`/stays/${stay.id}/edit`}
                  className="btn btn-primary btn-large"
                >
                  Edit Your Stay
                </Link>
              )}

              {user && !isOwner && (
                <button
                  onClick={toggleFavorite}
                  className={`btn btn-secondary ${isFavorited ? "favorited" : ""}`}
                >
                  {isFavorited ? "❤️ Favorited" : "🤍 Add to Favorites"}
                </button>
              )}

              <Link to="/" className="btn btn-secondary">
                Back to Stays
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-container">
          <ReviewsList key={reviewsKey} stayId={id} />

          {user && !isOwner && (
            <div className="review-form-section">
              <ReviewForm
                stayId={parseInt(id)}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StayDetails;
