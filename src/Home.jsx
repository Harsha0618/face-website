import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Home({ setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;  // Get username from location state
  const [userDetails, setUserDetails] = useState(null);
  const [storedImage, setStoredImage] = useState(null);
  const [userList, setUserList] = useState([]);
  const [userCount, setUserCount] = useState(0);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!username) {
      navigate("/login");  // Redirect to login page if no username is found
    }
  }, [username, navigate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch user details from the server using the username
        const response = await axios.get(`http://localhost:5000/users/${username}/images`);
        setStoredImage(response.data.stored_image);
      } catch (error) {
        console.error("Failed to fetch stored image:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_users");
        setUserList(response.data.users);
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUserDetails();
    fetchUsers();
  }, [username]);

  const handleLogout = () => {
    setIsLoggedIn(false);  // Update the login state to false
    navigate("/login");  // Redirect to the login page
  };

  return (
    <div className="d-flex">
      <div className="text-center flex-grow-1">
        <h2>Welcome, {username}</h2>
        <p>Details of the logged-in person:</p>

        <div className="border rounded p-3 ms-3" style={{ width: "250px" }}>
          {storedImage ? (
            <div className="d-flex justify-content-center p-3" style={{ width: "190px" }}>
              <img
                src={`data:image/jpeg;base64,${storedImage}`}
                alt="Stored User"
                className="img-fluid shadow rounded"
                style={{
                  width: "126px",
                  height: "155px",
                }}
              />
            </div>
          ) : (
            <p>No image found for this user.</p>
          )}

          <h4>User Details</h4>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Number of Registered Users:</strong> {userCount}</p>
        </div>

        <div>
          <ul className="nav">
            <li className="nav-item">
              <button onClick={() => navigate("/recognize-multi")} className="btn btn-primary">
                Go to Multi-Face Recognition
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => navigate("/register")} className="btn btn-success">
                Register New User
              </button>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-danger">
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border rounded p-3 ms-3" style={{ width: "250px" }}>
        <h4>Registered Users</h4>
        <ul className="list-group">
          {userList.map((user, index) => (
            <li key={index} className="list-group-item">
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
