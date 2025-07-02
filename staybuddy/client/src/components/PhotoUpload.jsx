import { useState, useRef } from "react";

const PhotoUpload = ({ photos, onPhotosChange, maxPhotos = 10 }) => {
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Image compression function
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files) => {
    const newPhotos = [...photos];

    for (const file of Array.from(files)) {
      if (newPhotos.length >= maxPhotos) break;

      if (file.type.startsWith("http://127.0.0.1:5000/image/")) {
        try {
          // Compress image before upload
          const compressedFile = await compressImage(file);

          const reader = new FileReader();
          reader.onload = (e) => {
            const newPhoto = {
              id: `file-${Date.now()}-${Math.random()}-${file.name}`,
              url: e.target.result,
              type: "file",
              name: file.name,
              size: compressedFile.size,
              originalSize: file.size,
            };

            const updatedPhotos = [...newPhotos, newPhoto];
            onPhotosChange(updatedPhotos.slice(0, maxPhotos));
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error("Error compressing image:", error);
          // Fallback to original file if compression fails
          const reader = new FileReader();
          reader.onload = (e) => {
            const newPhoto = {
              id: `file-fallback-${Date.now()}-${Math.random()}-${file.name}`,
              url: e.target.result,
              type: "file",
              name: file.name,
              size: file.size,
            };

            const updatedPhotos = [...newPhotos, newPhoto];
            onPhotosChange(updatedPhotos.slice(0, maxPhotos));
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim() || photos.length >= maxPhotos) return;

    const newPhoto = {
      id: `url-${Date.now()}-${Math.random()}-${urlInput.slice(-10)}`,
      url: urlInput.trim(),
      type: "url",
      name: "Image from URL",
    };

    onPhotosChange([...photos, newPhoto]);
    setUrlInput("");
  };

  const handleUrlKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlAdd();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removePhoto = (photoId) => {
    onPhotosChange(photos.filter((photo) => photo.id !== photoId));
  };

  const movePhoto = (fromIndex, toIndex) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="photo-upload-container">
      <h3 className="photo-upload-title">
        Add Photos ({photos.length}/{maxPhotos})
      </h3>

      {/* URL Input */}
      <div className="url-input-form">
        <div className="form-group">
          <label className="form-label">Add image from URL:</label>
          <div className="url-input-wrapper">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={handleUrlKeyPress}
              placeholder="https://example.com/image.jpg"
              className="form-input url-input"
              disabled={photos.length >= maxPhotos}
            />
            <button
              type="button"
              onClick={handleUrlAdd}
              className="btn btn-secondary"
              disabled={!urlInput.trim() || photos.length >= maxPhotos}
            >
              Add URL
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Drop Zone */}
      <div
        className={`drop-zone ${dragOver ? "drag-over" : ""} ${photos.length >= maxPhotos ? "disabled" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() =>
          photos.length < maxPhotos && fileInputRef.current?.click()
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="file-input-hidden"
          disabled={photos.length >= maxPhotos}
        />

        <div className="drop-zone-content">
          <div className="upload-icon">📸</div>
          <p className="drop-zone-text">
            {photos.length >= maxPhotos
              ? `Maximum ${maxPhotos} photos reached`
              : "Drop images here or click to browse"}
          </p>
          <p className="drop-zone-subtext">
            {photos.length < maxPhotos && "Supports JPG, PNG, GIF files"}
          </p>
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <div key={photo.id} className="photo-item">
              <div className="photo-wrapper">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="photo-preview"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect width="200" height="150" fill="%23f0f0f0"/><text x="100" y="75" text-anchor="middle" fill="%23999">Image not found</text></svg>';
                  }}
                />
                <div className="photo-overlay">
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="photo-remove-btn"
                    title="Remove photo"
                  >
                    ✕
                  </button>
                  <div className="photo-controls">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => movePhoto(index, index - 1)}
                        className="photo-move-btn"
                        title="Move left"
                      >
                        ◀
                      </button>
                    )}
                    {index < photos.length - 1 && (
                      <button
                        type="button"
                        onClick={() => movePhoto(index, index + 1)}
                        className="photo-move-btn"
                        title="Move right"
                      >
                        ▶
                      </button>
                    )}
                  </div>
                </div>
                <div className="photo-info">
                  <span className="photo-type-badge">
                    {photo.type === "url" ? "URL" : "FILE"}
                  </span>
                  {index === 0 && (
                    <span className="primary-badge">PRIMARY</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <p className="no-photos-text">
          No photos added yet. Add some photos to make your stay more
          attractive!
        </p>
      )}
    </div>
  );
};

export default PhotoUpload;
