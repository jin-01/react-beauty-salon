import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditUser() {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8088/getuser/' + id)
      .then(res => {
        setData({
          ...data,
          username: res.data.Result[0].username,
          password: res.data.Result[0].password,
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
      .put('http://localhost:8088/updateuser/' + id, data)
      .then(res => {
        if (res.data.Status === 'Success') {
          setSuccessMessage(true);
          setTimeout(() => {
            navigate('/user');
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
            Username
          </label>
          <input
            type='text'
            className='form-control'
            id='inputName'
            placeholder='Enter Username'
            autoComplete='off'
            value={data.username}
          />
        </div>
        <div className='col-12'>
          <label htmlFor='inputPassword' className='form-label'>
            Password
          </label>
          <input
            type='Password'
            className='form-control'
            id='inputPAssword'
            name='password'
            placeholder='Enter Password'
            autoComplete='off'
            onChange={handleChange}
            value={data.password}
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
  )
}

export default EditUser