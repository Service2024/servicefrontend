import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch profile data
    const fetchProfile = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem('token');

        // Check if token is present
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:9090/service/auth/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Extract the profile data from the `message` key
        setProfile(response.data.message);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return (
    <div>
      <h1>Profile Details</h1>
      <p><strong>First Name:</strong> {profile.firstname}</p>
      <p><strong>Last Name:</strong> {profile.lastname}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone Number:</strong> {profile.phonenumber}</p>
      {/* Add other profile details here */}
    </div>
  );
}

export default Profile;
