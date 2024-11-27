import React, { useState } from "react";
import axios from "axios";

const DisplayImages = () => {
  const [username, setUsername] = useState(""); // State for the input username
  const [storedImage, setStoredImage] = useState(null); // To hold the user's stored image
  const [error, setError] = useState(null); // To hold error messages
  const [recognitionResults, setRecognitionResults] = useState(null); // To hold recognition results

  // Fetch stored image from backend
  const fetchStoredImage = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear any previous errors
    setStoredImage(null); // Clear previous stored image

    try {
      const response = await axios.get(
        `http://localhost:5000/users/${username}/images`
      );
      const { stored_image } = response.data; // Get the stored image from the response
      setStoredImage(stored_image); // Set the stored image
    } catch (error) {
      console.error("Failed to fetch stored image:", error);
      setError("Failed to fetch stored image. Please try again later.");
    }
  };

  // Handle face recognition
  const recognizeFace = async (e) => {
    e.preventDefault();
    const file = document.getElementById("imageUpload").files[0];
    if (!file) {
      setError("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRecognitionResults(response.data); // Store recognition results
    } catch (error) {
      setError("Recognition failed. Please try again.");
      console.error("Recognition error:", error);
    }
  };

  return (
    <div className="text-center">
      <h2>Display User's Stored Image</h2>
      <form onSubmit={fetchStoredImage}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <button type="submit">Fetch Image</button>
      </form>
      {error && <p className="text-danger">{error}</p>}
      {storedImage ? (
        <div>
          <img
            src={`data:image/jpeg;base64,${storedImage}`}
            alt="Stored User"
            style={{ width: "100px", height: "100px", margin: "5px" }}
          />
        </div>
      ) : (
        <p>No image found for this user.</p>
      )}

      <h2>Face Recognition</h2>
      <form onSubmit={recognizeFace}>
        <input type="file" id="imageUpload" />
        <button type="submit">Recognize Face</button>
      </form>
      {recognitionResults && (
        <div>
          <h3>Recognition Results:</h3>
          {recognitionResults.map((result, index) => (
            <p key={index}>
              {result.name}: {result.probability}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayImages;
