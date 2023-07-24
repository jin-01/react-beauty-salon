import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateImage() {
  const [data, setData] = useState({
    image: '', // Added image state
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [successMessage, setSuccessMessage] = useState(false);
  const [imageError, setImageError] = useState(false); // New state to handle image loading error

  useEffect(() => {
    axios
      .get('http://localhost:8088/getpayment/' + id)
      .then(res => {
        setData({
          ...data,
          image: 'http://localhost:8088/images/' + res.data.Result[0].image,
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleImageChange = event => {
    setData({ ...data, image: event.target.files[0] });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', data.image); // Append the image to the form data

    axios
      .put('http://localhost:8088/updatepayment/' + id, formData)
      .then(res => {
        if (res.data.Status === 'Success') {
          setSuccessMessage(true);
          setTimeout(() => {
            navigate('/payment');
          }, 1500);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Update Employee</h2>
      <form className='row g-3 w-50' onSubmit={handleSubmit}>
        <div className='col-12'>
          <label htmlFor='inputImage' className='form-label'>
            Image
          </label>
          {!imageError && data.image ? (
            <img
              src={data.image}
              alt='Current Image'
              style={{ marginBottom: '10px', maxWidth: '100%', height: 'auto' }}
              onError={handleImageError}
            />
          ) : (
            <p>No image found</p>
          )}
          <input
            type='file'
            className='form-control'
            id='inputImage'
            accept='image/*'
            onChange={handleImageChange}
            required
          />
        </div>
        <div className='col-12'>
          {successMessage && (
            <div className='alert alert-success' role='alert'>
              Update Successfully!
            </div>
          )}
        </div>
        <div className='col-12'>
          <button className='btn btn-danger' onClick={() => navigate('/payment')}>
            Back
          </button>
          <button type='submit' className='btn btn-primary' style={{ marginLeft: '10px' }}>
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateImage;
