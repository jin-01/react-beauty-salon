import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Header from '../components/header/Header';
import './profile.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    area: '',
    bdate: '',
    age: '',
    gender: '',
    image: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  
  useEffect(() => {
    axios
      .get('http://localhost:8088/')
      .then((res) => {
        if (res.data.valid ) {
          navigate('/profile')
        } else {
          navigate('/login')
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8088/getprofile')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData({
            name: res.data.Result[0].name,
            email: res.data.Result[0].email,
            password: res.data.Result[0].password,
            phone: res.data.Result[0].phone,
            image: res.data.Result[0].image,
            bdate: res.data.Result[0].bdate,
            area: res.data.Result[0].area,
            age: res.data.Result[0].age,
            gender: res.data.Result[0].gender,
          });
        } else {
          alert('Error');
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpdate = () => {
    axios
      .put('http://localhost:8088/editprofile', {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        area: data.area,
        bdate: data.bdate,
        age: data.age,
        gender: data.gender,

      })
      .then((res) => {
        if (res.data.Status === 'Success') {
          setIsEditing(false);

        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleImageChange = (event) => {
  //   const imageFile = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setData((prevData) => ({ ...prevData, image: reader.result }));
  //   };
  //   if (imageFile) {
  //     reader.readAsDataURL(imageFile);
  //   }
  // };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="profile-container">
        {isEditing ? (
          <div className="profile-card">
            <div className="profile-details-edit">
              <img src={`http://localhost:8088/images/` + data.image} alt="" className="profile-img" />
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                type="text"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
              <input
                type="date"
                name="bdate"
                value={data.bdate}
                onChange={handleChange}
              />
              <input
                type="text"
                name="area"
                value={data.area}
                onChange={handleChange}
                placeholder="Area"
              />
              <input
                type="number"
                name="age"
                value={data.age}
                onChange={handleChange}
                placeholder="Age"
              />
              <select
                className="form-select"
                id="inputGender"
                name="gender"
                value={data.gender}
                onChange={handleChange}
              >
                <option value="" disabled selected>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <p className='passwordlabel'>Password</p>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <div className="btn-group">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save
                </button>
                <button className=" btncancel btn-danger" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-card">
            <div className="profile-details">
              {data.image && ( // Display the profile image if 'data.image' is not empty
                <img src={`http://localhost:8088/images/` + data.image} alt="" className="profile-img" />
              )}
              <h5 className="profile-name">Name: {data.name}</h5>
              <p className="profile-email">Email: {data.email}</p>
              <p className="profile-phone">Phone: {data.phone}</p>
              <p className="profile-phone">Date of birthday: {data.bdate}</p>
              <p className="profile-email">Area: {data.area}</p>
              <p className="profile-phone">Age: {data.age}</p>
              <p className="profile-phone">Gender: {data.gender}</p>
            </div>
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
