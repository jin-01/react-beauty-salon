import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from 'react-bootstrap';

function ManageBookingSlot() {
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8088/getbooking')
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
  const [filteredData, setFilteredData] = useState([]);


  const showDeleteConfirmation = (id) => {
    setIdToDelete(id);
    setShowConfirmAlert(true);
  };


  const closeConfirmAlert = () => {
    setShowConfirmAlert(false);
  };


  const handleDelete = () => {
    axios
      .delete('http://localhost:8088/deletebookingslot/' + idToDelete)
      .then(res => {
        if (res.data.Status === "Success") {
          // Remove the page reload
          setData(data.filter(bookingslot => bookingslot.id !== idToDelete));
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err))
      .finally(() => closeConfirmAlert()); // Close the alert regardless of the outcome
  };


  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();

    const filteredSlot = data.filter(slot => slot.area.toLowerCase().includes(value));
    setFilteredData(filteredSlot);
  };
  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Booking List</h3>
      </div>
      <div className="d-flex justify-content-between ">
        <Link to="/addbookingslot" className='btn btn-success'>Add Booking</Link>
        <input
          type="text"
          placeholder="Filter by Area"
          onChange={handleFilter}
        />
      </div>

      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Area</th>
              <th>Hairstylist</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Booking Description</th>
              <th>Cancel Description</th>
              <th>Rating Description</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((booking, index) => {
              return <tr key={index}>
                <td>{booking.name}</td>
                <td>{
                  <img src={`http://localhost:8088/images/` + booking.image} alt="" className='employee_image' />
                }</td>
                <td>{booking.area}</td>
                <td>{booking.hairstylist}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.sdesc}</td>
                <td>{booking.cancel}</td>
                <td>{booking.ratingdesc}</td>
                <td>{booking.rating}</td>
                <td>{booking.status}</td>
                <td>
                  <Link to={`/editbookingslot/` + booking.id} className='btn btn-primary btn-sm me-2'>Edit</Link>
                  <button onClick={e => showDeleteConfirmation(booking.id)} className='btn btn-sm btn-danger'>delete</button>
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
              <p>Are you sure you want to delete this booking slot?</p>
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

export default ManageBookingSlot