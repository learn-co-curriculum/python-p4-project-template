import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUpload from "./PhotoUpload";

function NewStayForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newStay = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        price: parseFloat(price),
        photos: photos.map((photo) => ({
          url: photo.url,
          type: photo.type,
          name: photo.name,
        })),
      };

      const response = await fetch("/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStay),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        alert("Stay created successfully!");
        navigate("/");
      } else {
        alert(data.error || "Failed to create stay");
      }
    } catch (error) {
      console.error("Error creating stay:", error);
      if (error.message.includes("Failed to fetch")) {
        alert(
          "Connection error. Please check if the backend server is running and try again.",
        );
      } else if (
        error.name === "PayloadTooLargeError" ||
        error.message.includes("too large")
      ) {
        alert(
          "The photos you selected are too large. Please try with smaller images or fewer photos.",
        );
      } else {
        alert("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-container">
          <h2 className="form-title">Host Your Space</h2>
          <p className="form-subtitle">
            Share your place with travelers around the world
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Property Title *
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="e.g., Cozy Mountain Cabin with Hot Tub"
                required
                maxLength={100}
              />
              <small className="form-help">
                Make it catchy and descriptive ({title.length}/100)
              </small>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                placeholder="Describe your space, amenities, nearby attractions..."
                rows={4}
                maxLength={500}
              />
              <small className="form-help">
                Help guests understand what makes your place special (
                {description.length}/500)
              </small>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Location *
              </label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-input"
                placeholder="e.g., Aspen, Colorado"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">
                Price per Night (KSH) *
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-input"
                placeholder="e.g., 12000"
                step="50"
                min="500"
                required
              />
              <small className="form-help">
                Set a competitive price in Kenyan Shillings for your area
              </small>
            </div>

            <PhotoUpload
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={10}
            />

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  loading || !title.trim() || !location.trim() || !price
                }
              >
                {loading ? "Creating..." : "Create Stay"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewStayForm;
