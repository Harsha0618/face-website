import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap styles

const Login = ({ setIsLoggedIn }) => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");  // Message to show error or success

  // Function to capture image and verify it
  const captureAndVerify = async () => {
    const imageSrc = webcamRef.current.getScreenshot();  // Capture image from webcam

    if (!imageSrc) {
      setMessage("Failed to capture image. Please try again.");
      return;
    }

    const responseData = imageSrc.split(",")[1]; // Extract base64 data from image
    const blob = await fetch(`data:image/jpeg;base64,${responseData}`).then(
      (res) => res.blob()  // Convert to Blob for file upload
    );

    const formData = new FormData();
    formData.append("image", blob, "captured_image.jpg"); // Append blob to FormData

    try {
      const response = await axios.post(
        "http://localhost:5000/recognize",  // POST request to backend for face recognition
        formData
      );
      const result = response.data;

      // Check if face is recognized
      if (result.length && result[0].name !== "Unknown") {
        setIsLoggedIn(true);  // Set login state to true

        // Store the recognized username (optional)
        const username = result[0].name;

        // Redirect to home page with username in state
        navigate("/home", { state: { username } });
      } else {
        setMessage("Face not recognized. Please try again.");  // Display error if face not recognized
      }
    } catch (error) {
      console.error("Verification failed:", error);
      if (error.response) {
        // Server responded with a status other than 200
        setMessage("Server error: " + error.response.data.error);
      } else {
        setMessage("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div
      className="text-center"
      style={{
        maxWidth: "400px",
        margin: "auto",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 className="my-4">Login with Face Recognition</h2>
      <div style={{ width: "80%", margin: "0 auto" }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          className="mb-3"
        />
      </div>
      <button onClick={captureAndVerify} className="btn btn-primary">
        Capture and Verify
      </button>
      <p className="mt-2 text-danger">{message}</p>
    </div>
  );
};

export default Login;
