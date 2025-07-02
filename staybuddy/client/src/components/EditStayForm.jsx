import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhotoUpload from "./PhotoUpload";

const EditStayForm = () => {
  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Phone number format validation
  const phoneRegex = /^(\+254|0)[7][0-9]{8}$/; // Kenyan phone number format

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title cannot exceed 100 characters")
      .required("Title is required"),
    description: Yup.string()
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description cannot exceed 500 characters")
      .required("Description is required"),
    location: Yup.string()
      .min(3, "Location must be at least 3 characters")
      .max(100, "Location cannot exceed 100 characters")
      .required("Location is required"),
    price: Yup.number()
      .min(500, "Price must be at least KSH 500")
      .max(1000000, "Price cannot exceed KSH 1,000,000")
      .required("Price is required"),
    contact_phone: Yup.string()
      .matches(
        phoneRegex,
        "Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)",
      )
      .required("Contact phone is required"),
  });

  const fetchStay = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/stays/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const stayData = await response.json();

      if (response.ok) {
        setStay(stayData);

        // Convert photos to the format expected by PhotoUpload
        if (stayData.photos) {
          setPhotos(
            stayData.photos.map((photo, index) => ({
              id: `edit-photo-${Date.now()}-${index}-${Math.random()}`,
              url: photo.url,
              type: photo.type || "url",
              name: photo.name || `Photo ${index + 1}`,
            })),
          );
        }
      } else if (response.status === 404) {
        alert("Stay not found");
        navigate("/");
      } else {
        throw new Error("Failed to fetch stay");
      }
    } catch (error) {
      console.error("Error fetching stay:", error);
      alert("Failed to load stay details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchStay();
  }, [fetchStay]);

  const handleSubmit = async (
    values,
    { setErrors, setSubmitting: formikSetSubmitting, isSubmitting },
  ) => {
    if (isSubmitting || submitting) return;
    setSubmitting(true);
    formikSetSubmitting(true);

    try {
      const updateData = {
        title: values.title.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        price: parseFloat(values.price),
        contact_phone: values.contact_phone.trim(),
        photos: photos.map((photo) => ({
          url: photo.url,
          type: photo.type,
          name: photo.name,
        })),
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`/stays/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const errorData = await response.json();

      if (response.ok) {
        alert("Stay updated successfully!");
        navigate(`/stays/${id}`);
      } else {
        if (response.status === 403) {
          alert("You are not authorized to edit this stay");
          navigate("/");
        } else {
          setErrors({ title: errorData.error || "Failed to update stay" });
        }
      }
    } catch (error) {
      console.error("Error updating stay:", error);
      setErrors({ title: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
      formikSetSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this stay? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/stays/${id}`, {
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
        alert("Stay deleted successfully!");
        navigate("/");
      } else if (response.status === 403) {
        alert("You are not authorized to delete this stay");
      } else {
        alert(data?.error || "Failed to delete stay");
      }
    } catch (error) {
      console.error("Error deleting stay:", error);
      alert("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="text-center">
            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⏳</div>
            <p>Loading stay details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stay) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="text-center">
            <h1>Stay Not Found</h1>
            <p>The stay you're trying to edit doesn't exist.</p>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Back to Stays
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="form-container">
          <h2 className="form-title">Edit Your Stay</h2>
          <p className="form-subtitle">Update your stay information</p>

          <Formik
            initialValues={{
              title: stay.title || "",
              description: stay.description || "",
              location: stay.location || "",
              price: stay.price || "",
              contact_phone: stay.contact_phone || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">
                    Property Title *
                  </label>
                  <Field
                    id="title"
                    name="title"
                    className="form-input"
                    placeholder="e.g., Cozy Mountain Cabin with Hot Tub"
                    maxLength={100}
                  />
                  <small className="form-help">
                    Make it catchy and descriptive ({values.title?.length || 0}
                    /100)
                  </small>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description *
                  </label>
                  <Field
                    id="description"
                    name="description"
                    as="textarea"
                    className="form-textarea"
                    placeholder="Describe your space, amenities, nearby attractions..."
                    rows={4}
                    maxLength={500}
                  />
                  <small className="form-help">
                    Help guests understand what makes your place special (
                    {values.description?.length || 0}/500)
                  </small>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="location">
                    Location *
                  </label>
                  <Field
                    id="location"
                    name="location"
                    className="form-input"
                    placeholder="e.g., Diani Beach, Mombasa"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="price">
                    Price per Night (KSH) *
                  </label>
                  <Field
                    id="price"
                    name="price"
                    type="number"
                    className="form-input"
                    placeholder="e.g., 12000"
                    step="50"
                    min="500"
                  />
                  <small className="form-help">
                    Set a competitive price in Kenyan Shillings
                  </small>
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact_phone">
                    Contact Phone *
                  </label>
                  <Field
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    className="form-input"
                    placeholder="e.g., +254712345678 or 0712345678"
                  />
                  <small className="form-help">
                    Kenyan phone number for guest inquiries
                  </small>
                  <ErrorMessage
                    name="contact_phone"
                    component="div"
                    className="error"
                  />
                </div>

                <PhotoUpload
                  photos={photos}
                  onPhotosChange={setPhotos}
                  maxPhotos={10}
                />

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate(`/stays/${id}`)}
                    className="btn btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger"
                    disabled={submitting}
                  >
                    Delete Stay
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Updating..." : "Update Stay"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditStayForm;
