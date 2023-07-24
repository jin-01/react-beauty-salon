import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddService() {
  const [data, setData] = useState({
    name: '',
    type: '',
    price: ''
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8088/addservices', data);
      if (response.data.Status === 'Success') {
        console.log(response.data);
        setSuccessMessage(true);
        setTimeout(() => {
          navigate('/getservices');
        }, 2000);
      } else if (response.data.Error === 'The combination of Hair Service and Hair Type already exists') {
        setErrorMessage("Hair Service and Hair Type already taken! Please choose another");
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
          <label htmlFor="inputName" className="form-label">
            Hair Service
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            name="name"
            placeholder="Enter Name"
            autoComplete="off"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputType" className="form-label">
            Hair Type
          </label>
          <select
            className="form-select"
            id="inputType"
            name="type"
            value={data.type}
            onChange={handleChange}
          >
            <option value="" >Select Hair Type</option>
            <option value="Long">Long</option>
            <option value="Medium">Medium</option>
            <option value="Short">Short</option>
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="inputPrice" className="form-label">
            Price
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPrice"
            name="price"
            placeholder="Enter Price"
            autoComplete="off"
            value={data.price}
            onChange={handleChange}
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
  );
}

export default AddService;
