import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const [data, setData] = useState({});
  const [modal, setModal] = useState(false);
  const [promodal, setPromodal] = useState(false);
  const [proupdate, setProupdate] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: ''
  });
  const [addData, setAddData] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: ''
  });
  const [getAddress, setGetAddress] = useState([]);
  const [editData, setEditData] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: ''
  });
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getProfile();
    getAddressFun();
    getImages();
  }, []);

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:6060/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.message);
      // Debugging: Check if data is fetched correctly
      console.log('Profile data:', response.data.message);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updProfile = await axios.put('http://localhost:6060/profileupdate', proupdate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (updProfile.status === 200) {
        alert('Profile updated');
        setPromodal(false);
        getProfile(); // Refresh profile data
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('file', file);
      const response = await axios.post('http://localhost:6060/profileImage', formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        alert('Profile image uploaded');
        getImages();
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const getImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:6060/getallimages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(response.data.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const addresponse = await axios.post('http://localhost:6060/addaddress', addData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (addresponse.status === 200) {
        getAddressFun();
        setModal(false);
        alert('Address added');
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const getAddressFun = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:6060/getaddress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGetAddress(res.data.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const editAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.put(`http://localhost:6060/updateaddress/${editData.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.status === 200) {
        alert('Address updated');
        getAddressFun();
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const addDelete = async (id, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.delete(`http://localhost:6060/deletaddress/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.status === 200) {
        alert('Address deleted');
        getAddressFun();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const fileonChange = (e) => {
    setFile(e.target.files[0]);
  };

  const editProfileData = (profileData) => {
    // Open modal and set form values for editing
    setProupdate({
      firstname: profileData.firstname || '',
      lastname: profileData.lastname || '',
      email: profileData.email || '',
      phonenumber: profileData.phonenumber || ''
    });
    setPromodal(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Profile</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Profile Details</h5>
              <ul className="list-unstyled">
                <li><strong>Firstname:</strong> {data.firstname}</li>
                <li><strong>Lastname:</strong> {data.lastname}</li>
                <li><strong>Email:</strong> {data.email}</li>
                <li><strong>Phone number:</strong> {data.phonenumber}</li>
                <li><button className="btn btn-primary mt-2" onClick={() => editProfileData(data)}>Edit Profile</button></li>
              </ul>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Profile Images</h5>
              <div className="mb-3">
                {images.length > 0 ? (
                  images.map((image) => (
                    <img
                      key={image.id}
                      src={`http://localhost:6060/uploads/profile/${image.profileImage}`}
                      alt="Profile"
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                    />
                  ))
                ) : (
                  <p>No profile images</p>
                )}
              </div>
              {images.length === 0 ? (
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <input type="file" className="form-control" onChange={fileonChange} />
                  </div>
                  <button type="submit" className="btn btn-primary">Upload</button>
                </form>
              ) : (
                <button className="btn btn-secondary">Edit Images</button>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Address</h5>
              <form onSubmit={addAddress}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter address"
                    name="address"
                    value={addData.address}
                    onChange={(e) => setAddData({ ...addData, address: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city"
                    name="city"
                    value={addData.city}
                    onChange={(e) => setAddData({ ...addData, city: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter state"
                    name="state"
                    value={addData.state}
                    onChange={(e) => setAddData({ ...addData, state: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter postal code"
                    name="postal_code"
                    value={addData.postal_code}
                    onChange={(e) => setAddData({ ...addData, postal_code: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add Address</button>
              </form>
              <hr />
              {getAddress.length > 0 ? (
                getAddress.map((address) => (
                  <div key={address.id} className="mb-3">
                    <ul className="list-unstyled">
                      <li><strong>Address:</strong> {address.address}</li>
                      <li><strong>City:</strong> {address.city}</li>
                      <li><strong>State:</strong> {address.state}</li>
                      <li><strong>Postal Code:</strong> {address.postal_code}</li>
                      <li>
                        <button className="btn btn-warning me-2" onClick={() => { setEditData(address); setModal(true); }}>Edit</button>
                        <button className="btn btn-danger" onClick={(e) => addDelete(address.id, e)}>Delete</button>
                      </li>
                    </ul>
                  </div>
                ))
              ) : (
                <p>No addresses found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {promodal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button type="button" className="btn-close" onClick={() => setPromodal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={updateProfile}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="firstname"
                      value={proupdate.firstname}
                      onChange={(e) => setProupdate({ ...proupdate, firstname: e.target.value })}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="lastname"
                      value={proupdate.lastname}
                      onChange={(e) => setProupdate({ ...proupdate, lastname: e.target.value })}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={proupdate.email}
                      onChange={(e) => setProupdate({ ...proupdate, email: e.target.value })}
                      placeholder="Email"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="phonenumber"
                      value={proupdate.phonenumber}
                      onChange={(e) => setProupdate({ ...proupdate, phonenumber: e.target.value })}
                      placeholder="Phone Number"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {modal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Address</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={editAddress}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="Address"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={editData.state}
                      onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="postal_code"
                      value={editData.postal_code}
                      onChange={(e) => setEditData({ ...editData, postal_code: e.target.value })}
                      placeholder="Postal Code"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
