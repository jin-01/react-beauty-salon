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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8088/addservices', data);
      console.log(response.data); // Optional: log the server response
      navigate('/getservices');
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
      <h2>Add Admin</h2>
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
          <input
            type="text"
            className="form-control"
            id="inputType"
            name="type"
            placeholder="Enter Type"
            autoComplete="off"
            value={data.type}
            onChange={handleChange}
          />
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
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddService;
