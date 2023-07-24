import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditAdmin() {
  const [data, setData] = useState({
    name: '',
    email: '',
    image: '', // Added image state
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get('http://localhost:8088/getadmins/' + id)
      .then(res => {
        setData({
          ...data,
          name: res.data.Result[0].name,
          email: res.data.Result[0].email,
          image: 'http://localhost:8088/images/' + res.data.Result[0].image,
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleImageChange = event => {
    setData({ ...data, image: event.target.files[0] });
  };


  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('image', data.image); // Append the image to the form data

    axios
      .put('http://localhost:8088/updateadmin/' + id, formData)
      .then(res => {
        if (res.data.Status === 'Success') {
          navigate('/admin');
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Update Employee</h2>
      <form className='row g-3 w-50' onSubmit={handleSubmit}>
        <div className='col-12'>
          <label htmlFor='inputName' className='form-label'>
            Name
          </label>
          <input
            type='text'
            className='form-control'
            id='inputName'
            placeholder='Enter Name'
            autoComplete='off'
            onChange={e => setData({ ...data, name: e.target.value })}
            value={data.name}
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
            placeholder='Enter Email'
            autoComplete='off'
            onChange={e => setData({ ...data, email: e.target.value })}
            value={data.email}
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputImage' className='form-label'>
            Image
          </label>
          {data.image && (
            <img
              src={data.image}
              alt='Current Image'
              style={{ marginBottom: '10px', maxWidth: '100%', height: 'auto' }}
            />
          )}
          <input
            type='file'
            className='form-control'
            id='inputImage'
            accept='image/*'
            onChange={handleImageChange}

          />
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

export default EditAdmin;
