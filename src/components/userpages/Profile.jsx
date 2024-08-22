import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Profile() {
  const [data, setData] = useState({})
  const [modal, setmodal] = useState(false)
  const modalBox = () => {
    setmodal(!modal)
  }
  const [promodal, serPromodal] = useState(false)

  const profileModal = () => {
    serPromodal(!promodal)
  }

  const getProfile = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:6060/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setData(response.data.message)
  }

  const [proupdate, setProupdate] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: ''
  })

  const editprofileHandleChange = (e) => {
    const { name, value } = e.target;
    setProupdate({ ...proupdate, [name]: value })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const updProfile = await axios.put('http://localhost:6060/profileupdate', proupdate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (updProfile.status == 200) {
      alert('update')
      serPromodal(false)
    }
  }

  const editProfileData = (profileData) => {
    setProupdate({
      id: profileData.id,
      firstname: profileData.firstname,
      lastname: profileData.lastname,
      email: profileData.email,
      phonenumber: profileData.phonenumber
    });
    serPromodal(true)
  }

  const [addData, setaddData] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setaddData((prevData) => ({ ...prevData, [name]: value }))
  }

  const addAddress = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const addresponse = await axios.post('http://localhost:6060/addaddress', addData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (addresponse.status == 200) {
      getAdressFun()
      setmodal(false)
      console.log("Sss", addData)
      alert('success')
    } else {
      alert('remove')
    }
  }

  const [getAddress, getAllAddress] = useState([])

  const getAdressFun = async () => {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:6060/getaddress', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    getAllAddress(res.data.data)
  }

  const [editData, setEditData] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: ''
  })

  const editOnchange = (e) => {
    const { name, value } = e.target;
    setEditData((editprevData) => ({ ...editprevData, [name]: value }))
  }

  const editAddress = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const resp = await axios.put(`http://localhost:6060/updateaddress/${editData.id}`, editData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (resp.status === 200) {
      alert("success");
      getAdressFun()
    }
  }

  const editFunData = (address) => {
    setEditData({
      id: address.id,
      address: address.address,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code
    });
    setmodal(true);
  }

  const addDelete = async (id, e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const resp = await axios.delete(`http://localhost:6060/deletaddress/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (resp.status === 200) {
      alert("success");
      getAdressFun()
    }
  }

  const [file, setFile] = useState(null)

  const fileonChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleProfileSubmit = async (e) => {
    try {
      e.preventDefault()
      const token = localStorage.getItem('token')
      const formdata = new FormData()
      formdata.append('file', file);

      const response = await axios.post('http://localhost:6060/profileImage', formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status === 200) {
        alert('success')
        getImages()
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  }

  const [images, setimage] = useState([])
  const getImages = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:6060/getallimages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setimage(response.data.data)
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  }
  useEffect(() => {
    getProfile(),
      getAdressFun(),
      getImages()
  }, [])
  return (
    <>
      <div className="mainProfile">
        <div className="profileDetails">
          <h1>Profile</h1>
          <div className="details">
            <ul>
              <li>Firstname:<span>{data.firstname}</span></li>
              <li>Lastname:<span>{data.lastname}</span></li>
              <li>Email:<span>{data.email}</span></li>
              <li>Phone number:<span>{data.phonenumber}</span></li>
              <li><button onClick={() => editProfileData(data)}>Edit</button></li>
            </ul>
          </div>
          profile Images:
          <div>
            {images.length > 0 ? (
              images.map((image) => (
                <img
                  key={image.id}
                  src={`http://localhost:6060/uploads/profile/${image.profileImage}`}
                  alt="Profile"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                />
              ))
            ) : (
              <p>No profileData</p>
            )}
          </div>
          {images.length===0?(
          <div>
            <form onSubmit={handleProfileSubmit}>
              <input type="file" onChange={fileonChange} />
              <button>Upload</button>
            </form>
          </div>
          ):(
            <button>Edit</button>
          )}
          {promodal && (
            <div>
              <form onSubmit={updateProfile}>
                <input type="text" name='firstname' value={proupdate.firstname} onChange={editprofileHandleChange} /><br />
                <input type="text" name='lastname' value={proupdate.lastname} onChange={editprofileHandleChange} /><br />
                <input type="text" name='email' value={proupdate.email} onChange={editprofileHandleChange} /><br />
                <input type="text" name='phonenumber' value={proupdate.phonenumber} onChange={editprofileHandleChange} /><br />
                <button>Submit</button>
              </form>
            </div>
          )}
          <form onSubmit={addAddress}>
            <input type="text" placeholder='enter address' name='address' value={addData.address} onChange={handleChange} />
            <input type="text" placeholder='enter city' name='city' value={addData.city} onChange={handleChange} />
            <input type="text" placeholder='enter state' name='state' value={addData.state} onChange={handleChange} />
            <input type="number" placeholder='enter postalcode' name='postal_code' value={addData.postal_code} onChange={handleChange} />
            <button >Submit</button>
          </form>
        </div>

        <h1>Address</h1>
        <div>
          {getAddress.map((address) => (
            <ul key={address.id}>
              <li>Address:<span>{address.address}</span></li>
              <li>City:<span>{address.city}</span></li>
              <li>State:<span>{address.state}</span></li>
              <li>Postal code:<span>{address.postal_code}</span></li><br />
              <button onClick={() => editFunData(address)}>Edit</button>
              <button onClick={(e) => addDelete(address.id, e)}>Delete</button>
            </ul>
          ))}
        </div>
      </div>
      {modal && (
        <div>
          <form onSubmit={editAddress}>
            <input type="text" name='address' value={editData.address} onChange={editOnchange} />
            <input type="text" name='city' value={editData.city} onChange={editOnchange} />
            <input type="text" name='state' value={editData.state} onChange={editOnchange} />
            <input type="text" name='postal_code' value={editData.postal_code} onChange={editOnchange} />
            <button>Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Profile;
