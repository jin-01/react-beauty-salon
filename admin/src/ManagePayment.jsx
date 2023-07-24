import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ManagePayment() {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = () => {
    axios
      .get(`http://localhost:8088/getpayment?username=${searchValue}`)
      .then(res => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        } else {
          alert('Error');
        }
      })
      .catch(err => console.log(err));
  };

  const handleSearch = () => {
    fetchUserBookings();
  };

  useEffect(() => {
    axios
      .get('http://localhost:8088/getpayment')
      .then(res => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        } else {
          alert('Error');
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleImageError = index => {
    const newData = [...data];
    newData[index].imageError = true;
    setData(newData);
  };

  const showDeleteConfirmation = id => {
    setIdToDelete(id);
    setShowConfirmAlert(true);
  };

  const closeConfirmAlert = () => {
    setShowConfirmAlert(false);
  };

  const handleDelete = () => {
    axios
      .delete('http://localhost:8088/deletepayment/' + idToDelete)
      .then(res => {
        if (res.data.Status === 'Success') {
          setData(data.filter(payment => payment.id !== idToDelete));
        } else {
          alert('Error');
        }
      })
      .catch(err => console.log(err))
      .finally(() => closeConfirmAlert());
  };

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Admin List</h3>
      </div>
      <div className='d-flex'>
        <input
          type='text'
          placeholder='Enter Username'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button className='btn btn-success' onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Booking ID</th>
              <th>Branch Name</th>
              <th>Branch Area</th>
              <th>Hairstylist</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Hair Service</th>
              <th>Price</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((payment, index) => (
              <tr key={index}>
                <td>{payment.username}</td>
                <td>{payment.bid}</td>
                <td>{payment.name}</td>
                <td>{payment.area}</td>
                <td>{payment.hairstylist}</td>
                <td>{payment.date}</td>
                <td>{payment.time}</td>
                <td>{payment.hairservice}</td>
                <td>{payment.price}</td>
                <td>
                {payment.image ? (
                  <img
                    src={`http://localhost:8088/images/` + payment.image}
                    alt=""
                    className='employee_image'
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <p>No image found</p>
                )}
              </td>
                <td>
                  <Link to={`/updatepayment/` + payment.id} className='btn btn-primary btn-sm me-2'>
                    Update Image
                  </Link>
                  <button onClick={() => showDeleteConfirmation(payment.id)} className='btn btn-sm btn-danger'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showConfirmAlert && (
          <div className='confirm-alert-container'>
            <Alert variant='danger'>
              <Alert.Heading>Confirm Delete</Alert.Heading>
              <p>Are you sure you want to delete this payment?</p>
              <hr />
              <div className='d-flex justify-content-end'>
                <button onClick={closeConfirmAlert} className='btn btn-secondary me-2'>
                  Cancel
                </button>
                <button onClick={handleDelete} className='btn btn-danger'>
                  Delete
                </button>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePayment;
