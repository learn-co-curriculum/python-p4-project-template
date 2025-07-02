import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFavorites(data);
      } else {
        throw new Error("Failed to fetch favorites");
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Unable to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://192.168.0.25:5001/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // For DELETE requests, we may not always have a response body
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        // No response body or invalid JSON, that's ok for DELETE
      }

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      } else {
        alert(data?.error || "Failed to remove favorite");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Network error. Please try again.");
    }
  };

  const updateNotes = async (favoriteId, notes) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/favorites/${favoriteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });

      const updatedFavorite = await response.json();

      if (response.ok) {
        setFavorites(
          favorites.map((fav) =>
            fav.id === favoriteId
              ? { ...fav, notes: updatedFavorite.notes }
              : fav,
          ),
        );
        setEditingNotes(null);
      } else {
        alert("Failed to update notes");
      }
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Network error. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <h2 className="page-title">My Favorites</h2>
          <div className="text-center">
            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>❤️</div>
            <p>Loading your favorite stays...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <h2 className="page-title">My Favorites</h2>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchFavorites} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <h2 className="page-title">My Favorites ({favorites.length})</h2>

        {favorites.length === 0 ? (
          <div className="text-center">
            <div style={{ fontSize: "4rem", marginBottom: "24px" }}>❤️</div>
            <h3>No favorites yet</h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "32px",
              }}
            >
              Start exploring amazing places and add them to your favorites!
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Stays
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="favorite-stay-info">
                  <Link
                    to={`/stays/${favorite.stay?.id}`}
                    className="favorite-stay-link"
                  >
                    <h3 className="favorite-stay-title">
                      {favorite.stay?.title}
                    </h3>
                    <div className="favorite-stay-location">
                      📍 {favorite.stay?.location}
                    </div>
                    <div className="favorite-stay-price">
                      KSH {favorite.stay?.price}/night
                    </div>
                  </Link>
                </div>

                <div className="favorite-meta">
                  <div className="favorite-date">
                    Added on {formatDate(favorite.date_added)}
                  </div>

                  <div className="favorite-notes-section">
                    {editingNotes === favorite.id ? (
                      <Formik
                        initialValues={{ notes: favorite.notes || "" }}
                        validationSchema={Yup.object({
                          notes: Yup.string().max(
                            200,
                            "Notes cannot exceed 200 characters",
                          ),
                        })}
                        onSubmit={async (
                          values,
                          { setSubmitting, isSubmitting },
                        ) => {
                          if (isSubmitting) return;
                          setSubmitting(true);
                          try {
                            await updateNotes(favorite.id, values.notes);
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        {({ values }) => (
                          <Form className="notes-form">
                            <Field
                              name="notes"
                              as="textarea"
                              placeholder="Add personal notes about this stay..."
                              className="notes-input"
                              rows={3}
                            />
                            <div className="char-count">
                              {values.notes?.length || 0}/200 characters
                            </div>
                            <ErrorMessage
                              name="notes"
                              component="div"
                              className="error"
                            />
                            <div className="notes-actions">
                              <button
                                type="submit"
                                className="btn btn-small btn-primary"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingNotes(null)}
                                className="btn btn-small btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <div>
                        <div className="favorite-notes">
                          <strong>Notes:</strong>
                          <p>{favorite.notes || "No notes added yet"}</p>
                        </div>
                        <button
                          onClick={() => setEditingNotes(favorite.id)}
                          className="btn btn-small btn-secondary"
                        >
                          {favorite.notes ? "Edit Notes" : "Add Notes"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="favorite-actions">
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="btn btn-small btn-danger"
                    title="Remove from favorites"
                  >
                    Remove ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
