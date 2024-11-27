import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MultiFaceRecognition({ isLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const webcamRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setIsUploading(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureAndPredict = async () => {
    const imageSrc = selectedImage || webcamRef.current.getScreenshot();
    const response = await fetch(imageSrc);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("image", blob, "captured_image.jpg");

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/recognize-multi",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPrediction(response.data);
      setSelectedImage(null);
      setIsUploading(false);
    } catch (error) {
      console.error("Prediction failed:", error);
      setPrediction([{ name: "Error", probability: 0 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Multi-Face Recognition</h2>
      <p>Perform multi-face recognition using your uploaded images or webcam capture.</p>

      {loading ? (
        <p>Loading... prediction is processing.</p>
      ) : (
        <>
          <div className="d-flex justify-content-center mb-3">
            {!isUploading && (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="border p-2 rounded"
                videoConstraints={{
                  width: 320,
                  height: 240,
                  facingMode: "user",
                }}
              />
            )}
          </div>

          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control-file"
            />
          </div>

          <button onClick={captureAndPredict} className="btn btn-success me-2">
            {selectedImage ? "Predict Uploaded Image" : "Capture and Predict"}
          </button>

          {prediction.length > 0 && (
            <div className="mt-3">
              <p>Number of faces detected: {prediction.length}</p>
              {prediction.map((result, index) => (
                <p key={index}>
                  {result.name}: {(result.probability * 100).toFixed(2)}%
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MultiFaceRecognition;
