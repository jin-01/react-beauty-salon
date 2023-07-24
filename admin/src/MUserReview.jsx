import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'

function MUserReview() {
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
      fetchUserBookings();
  }, []);

  const fetchUserBookings = () => {
      axios.get(`http://localhost:8088/getuserreview?username=${searchValue}`)
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
    axios.get('http://localhost:8088/getuserreview')
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
      .delete('http://localhost:8088/deleteuserreview/' + idToDelete)
      .then(res => {
        if (res.data.Status === "Success") {
          // Remove the page reload
          setData(data.filter(review => review.id !== idToDelete));
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
        <h3>User Review List</h3>
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
              <th>Branch Name</th>
              <th>Branch Area</th>
              <th>Rating </th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((review, index) => {
              return <tr key={index}>
                <td>{review.username}</td>
                <td>{review.name}</td>
                <td>{review.barea}</td>
                <td>{review.rating}</td>
                <td>{review.rdesc}</td>
                <td>
                  <button onClick={e => showDeleteConfirmation(review.id)} className='btn btn-sm btn-danger'>delete</button>
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
              <p>Are you sure you want to delete this review?</p>
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

export default MUserReview