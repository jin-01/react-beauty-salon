import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditHairstylist() {
  const [data, setData] = useState({
    name: '',
    email: '',
    hdesc: '',
    age: '',
    phone: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8088/gethairstylist/' + id)
      .then(res => {
        setData({
          ...data,
          name: res.data.Result[0].name,
          email: res.data.Result[0].email,
          hdesc: res.data.Result[0].hdesc,
          age: res.data.Result[0].age,
          gender: res.data.Result[0].gender,
          phone: res.data.Result[0].phone,
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = event => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    axios
      .put('http://localhost:8088/updatehairstylist/' + id, data)
      .then(res => {
        if (res.data.Status === 'Success') {
          setSuccessMessage(true);
          setTimeout(() => {
            navigate('/hairstylist');
          }, 1500);

        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Update Hairstylist</h2>
      <form className='row g-3 w-50' onSubmit={handleSubmit}>
        <div className='col-12'>
          <label htmlFor='inputName' className='form-label'>
            Name
          </label>
          <input
            type='text'
            className='form-control'
            id='inputName'
            name='name'
            placeholder='Enter Name'
            autoComplete='off'
            onChange={handleChange}
            value={data.name}
            readOnly
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputEmail4' className='form-label'>
            Email
          </label>
          <input
            type='email'
            className='form-control'
            id='inputEmail4'
            name='email'
            placeholder='Enter Email'
            autoComplete='off'
            onChange={handleChange}
            value={data.email}
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputDesc' className='form-label'>
            Description
          </label>
          <input
            type='text'
            className='form-control'
            id='inputDesc'
            name='hdesc'
            placeholder='Enter Description'
            autoComplete='off'
            onChange={handleChange}
            value={data.hdesc}
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputAge' className='form-label'>
            Age
          </label>
          <input
            type='number'
            className='form-control'
            id='inputAge'
            name='age'
            placeholder='Enter Age'
            autoComplete='off'
            onChange={handleChange}
            value={data.age}
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputGender" className="form-label">
            Gender
          </label>
          <select
            className="form-select"
            id="inputGender"
            name='gender'
            value={data.gender}
            required
            onChange={handleChange}
          >
            <option value="" disabled selected>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className='col-12'>
          <label htmlFor='inputPhone' className='form-label'>
            Phone
          </label>
          <input
            type='text'
            className='form-control'
            id='inputPhone'
            name='phone'
            placeholder='Enter Phone'
            autoComplete='off'
            onChange={handleChange}
            value={data.phone}
          />
        </div>
        <div className="col-12">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              Update Successfully!
            </div>
          )}
        </div>
        <div className='col-12'>
          <button type='submit' className='btn btn-primary'>
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditHairstylist;
