import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


function EditBookingSlot() {
    const [data, setData] = useState({
        date: '',
        time: '',
        sdesc: '',
        cancel: '',
        status: '',
      });
    
      const navigate = useNavigate();
      const { id } = useParams();
      const [successMessage, setSuccessMessage] = useState(false);
    
      useEffect(() => {
        axios
          .get('http://localhost:8088/getbookingslot/' + id)
          .then(res => {
            setData({
              ...data,
              name: res.data.Result[0].name,
              date: res.data.Result[0].date,
              time: res.data.Result[0].time,
              sdesc: res.data.Result[0].sdesc,
              cancel: res.data.Result[0].cancel,
              status: res.data.Result[0].status,
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
          .put('http://localhost:8088/updatebookingslot/' + id, data)
          .then(res => {
            if (res.data.Status === 'Success') {
              setSuccessMessage(true);
              setTimeout(() => {
                navigate('/bookingslot');
              }, 1500);
              
            }
          })
          .catch(err => console.log(err));
      };
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
    <h2>Update Booking Slot</h2>
    <form className='row g-3 w-50' onSubmit={handleSubmit}>
    <div className='col-12'>
        <label htmlFor='inputDate' className='form-label'>
          Branch Name
        </label>
        <input
          type='text'
          className='form-control'
          id='inputDate'
          autoComplete='off'
          value={data.name}
          readOnly
        />
      </div>
      <div className='col-12'>
        <label htmlFor='inputDate' className='form-label'>
          Booking Date
        </label>
        <input
          type='date'
          className='form-control'
          id='inputDate'
          name='date'
          autoComplete='off'
          onChange={handleChange}
          value={data.date}
        />
      </div>
      <div className='col-12'>
        <label htmlFor='inputTime' className='form-label'>
          Booking Time
        </label>
        <input
          type='time'
          className='form-control'
          id='inputTime'
          name='time'
          autoComplete='off'
          onChange={handleChange}
          value={data.time}
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
          name='sdesc'
          placeholder='Enter Description'
          autoComplete='off'
          onChange={handleChange}
          value={data.sdesc}
        />
      </div>
      <div className='col-12'>
        <label htmlFor='inputCdesc' className='form-label'>
          Cancel Description
        </label>
        <input
          type='text'
          className='form-control'
          id='inputCdesc'
          name='cancel'
          placeholder='Enter Description'
          autoComplete='off'
          onChange={handleChange}
          value={data.cancel}
        />
      </div>
      <div className="col-12">
          <label htmlFor="inputStatus" className="form-label">
            Booking Slot Status
          </label>
          <select
            className="form-select"
            id="inputStatus"
            name="status"
            value={data.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
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

export default EditBookingSlot