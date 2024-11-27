import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [username, setUsername] = useState("");
  const [capturedImages, setCapturedImages] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");  // Message to show success or error

  // Capture 7 images from webcam
  const captureImages = async () => {
    setIsCapturing(true);
    let images = [];
    for (let i = 0; i < 7; i++) {
      const imageSrc = webcamRef.current.getScreenshot();
      images.push(imageSrc);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 0.5 seconds between captures
    }
    setCapturedImages(images);
    setIsCapturing(false);
  };

  // Send captured images and username to the backend
  const sendImagesToBackend = async () => {
    if (!username || capturedImages.length === 0) {
      setStatusMessage("Please enter a username and capture images.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);

    // Convert images to FormData and append
    capturedImages.forEach((image, index) => {
      const byteString = atob(image.split(",")[1]);
      const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new Blob([ab], { type: mimeString });
      formData.append(`image${index}`, file, `captured_image_${index}.jpg`);
    });

    try {
      // Send data to backend (replace URL with your actual backend URL)
      await axios.post("http://localhost:5000/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatusMessage("User registered successfully!");  // Show success message
      setIsLoggedIn(true);  // Set logged-in state to true
      navigate("/home"); // Redirect to home after successful registration
    } catch (error) {
      console.error("Failed to register images:", error);
      setStatusMessage("Error registering images. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-80">
      <div className="border rounded p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Register User</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mb-3"
        />
        <div className="d-flex justify-content-center mb-3">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="border p-2 rounded"
            width={300} // Set the width of the webcam
            height={240} // Set the height of the webcam
          />
        </div>
        <button
          onClick={captureImages}
          className="btn btn-primary me-2"
          disabled={isCapturing}
        >
          {isCapturing ? "Capturing Images..." : "Capture 7 Images"}
        </button>
        <button
          onClick={sendImagesToBackend}
          className="btn btn-success"
          disabled={isCapturing || capturedImages.length === 0}
        >
          Register User
        </button>
        {isCapturing && (
          <div className="mt-3">Capturing images, please wait...</div>
        )}
        {statusMessage && <p className="mt-3 text-center text-danger">{statusMessage}</p>}
      </div>
    </div>
  );
};

export default Register;
