import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrowdCounting = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [personCount, setPersonCount] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setPersonCount(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/crowd-count", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.image_with_boxes && response.data.person_count !== undefined) {
        setResult(response.data.image_with_boxes);
        setPersonCount(response.data.person_count);
      } else {
        alert("Unexpected response format from the server.");
      }
    } catch (error) {
      console.error("Error during the request:", error);
      alert("Failed to process the image. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Crowd Counting</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="imageUpload">Upload an Image:</label>
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Count Persons</button>
      </form>

      {preview && (
        <div>
          <h3>Uploaded Image Preview:</h3>
          <img src={preview} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}

      {result && (
        <div>
          <h3>Result:</h3>
          <p>Persons Detected: {personCount}</p>
          <img
            src={`data:image/jpeg;base64,${result}`}
            alt="Result"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default CrowdCounting;
