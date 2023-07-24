import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditBranch() {
    const [data, setData] = useState({
        name: '',
        area: '',
        bdesc: '',
        url: '',
      });
    
      const navigate = useNavigate();
      const { id } = useParams();
      const [successMessage, setSuccessMessage] = useState(false);
    
      useEffect(() => {
        axios
          .get('http://localhost:8088/getbranch/' + id)
          .then(res => {
            setData({
              ...data,
              name: res.data.Result[0].name,
              area: res.data.Result[0].area,
              bdesc: res.data.Result[0].bdesc,
              url: res.data.Result[0].url,
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
          .put('http://localhost:8088/updatebranch/' + id, data)
          .then(res => {
            if (res.data.Status === 'Success') {
              setSuccessMessage(true);
              setTimeout(() => {
                navigate('/getbranch');
              }, 1500);
              
            }
          })
          .catch(err => console.log(err));
      };
      
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
    <h2>Update Branch</h2>
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
        <label htmlFor='inputArea' className='form-label'>
          Area
        </label>
        <input
          type='text'
          className='form-control'
          id='inputArea'
          name='area'
          placeholder='Enter Name'
          autoComplete='off'
          onChange={handleChange}
          value={data.area}
          readOnly
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
          name='bdesc'
          placeholder='Enter Description'
          autoComplete='off'
          onChange={handleChange}
          value={data.bdesc}
        />
      </div>
      <div className='col-12'>
        <label htmlFor='inputUrl' className='form-label'>
          Google Map Url
        </label>
        <input
          type='text'
          className='form-control'
          id='inputUrl'
          name='url'
          placeholder='Enter Url'
          autoComplete='off'
          onChange={handleChange}
          value={data.url}
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

export default EditBranch