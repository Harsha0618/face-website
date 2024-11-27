import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import DisplayImages from "./DisplayImages";
import MultiFaceRecognition from "./MultiFaceRecognition.jsx";
import CrowdCounting from "./CrowdCounting.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{ backgroundColor: "#007bff" }}
      >
        <div className="container">
          <a className="navbar-brand text-white" href="/">
            Face Recognition KMIT
          </a>
          <div className="navbar-nav ml-auto">
            {isLoggedIn ? (
              <>
                <Link className="nav-link text-white" to="/home">
                  Dashboard
                </Link>
                <Link className="nav-link text-white" to="/multi-face">
                  MultiFaceRecognition
                </Link>
                <Link className="nav-link text-white" to="/crowd-count">
                  Crowd Counting
                </Link>
                <Link
                  className="nav-link text-white"
                  to="/"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link className="nav-link text-white" to="/login">
                  Login
                </Link>
                <Link className="nav-link text-white" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/display-images" element={<DisplayImages />} />
          <Route
            path="/multi-face"
            element={<MultiFaceRecognition isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/crowd-count"
            element={<CrowdCounting isLoggedIn={isLoggedIn} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
