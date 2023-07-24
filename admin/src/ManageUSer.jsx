import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ManageUSer() {
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
      fetchUserBookings();
  }, []);

  const fetchUserBookings = () => {
      axios.get(`http://localhost:8088/getuser?username=${searchValue}`)
          .then(res => {
              if (res.data.Status === "Success") {
                  setData(res.data.Result);
              } else {
                  alert("Error");
              }
          })
          .catch(err => console.log(err));
  };

  const handleSearch = () => {
      // Fetch user bookings with the updated search term
      fetchUserBookings();
  };

  useEffect(() => {
    axios.get('http://localhost:8088/getuser')
      .then(res => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        } else {
          alert("Error")
        }
      })
      .catch(err => console.log(err));
  }, [])

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);


  const showDeleteConfirmation = (id) => {
    setIdToDelete(id);
    setShowConfirmAlert(true);
  };


  const closeConfirmAlert = () => {
    setShowConfirmAlert(false);
  };


  const handleDelete = () => {
    axios
      .delete('http://localhost:8088/deleteuser/' + idToDelete)
      .then(res => {
        if (res.data.Status === "Success") {
          // Remove the page reload
          setData(data.filter(user => user.id !== idToDelete));
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err))
      .finally(() => closeConfirmAlert()); // Close the alert regardless of the outcome
  };
  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>User List</h3>
      </div>
      <div className="d-flex ">
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{marginRight: 10}}
                />
                <button className='btn btn-success' onClick={handleSearch}>Search</button>
            </div>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Image</th>
              <th>Phone</th>
              <th>Area</th>
              <th>Birthday</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => {
              return <tr key={index}>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{
                  <img src={`http://localhost:8088/images/` + user.image} alt="" className='employee_image' />
                }</td>
                <td>{user.phone}</td>
                <td>{user.area}</td>
                <td>{user.bdate}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.points}</td>
                <td>
                <Link to={`/edituser/` + user.id} className='btn btn-primary btn-sm me-2'>Edit</Link>
                  <button onClick={e => showDeleteConfirmation(user.id)} className='btn btn-sm btn-danger'>delete</button>
                </td>
              </tr>
            })}
          </tbody>
        </table>
        {/* Confirm Alert */}
        {showConfirmAlert && (
          <div className="confirm-alert-container">
            <Alert variant="danger">
              <Alert.Heading>Confirm Delete</Alert.Heading>
              <p>Are you sure you want to delete this user?</p>
              <hr />
              <div className="d-flex justify-content-end">
                <button onClick={closeConfirmAlert} className="btn btn-secondary me-2">Cancel</button>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUSer