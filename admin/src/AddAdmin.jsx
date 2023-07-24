import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddAdmin() {
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8088/create', data);
      if (response.data.Status === 'Success') {
        console.log(response.data);
        setSuccessMessage(true);
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else if (response.data.Error === 'Email already taken') {
        setErrorMessage("Email already taken! Please choose another");
        setTimeout(() => {
          setErrorMessage(''); 
        }, 2000);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Services</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputEmail" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            name="email"
            placeholder="Enter email"
            autoComplete="off"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            name="password"
            placeholder="Enter Password"
            autoComplete="off"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              Add Successfully!
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddAdmin