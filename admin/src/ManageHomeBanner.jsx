import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ManageHomeBanner() {
    const [data, setData] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8088/gethomebanner')
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
        .delete('http://localhost:8088/deletehomebanner/' + idToDelete)
        .then(res => {
          if (res.data.Status === "Success") {
            // Remove the page reload
            setData(data.filter(homebanner => homebanner.id !== idToDelete));
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
          <h3>Home Page Banner List</h3>
        </div>
        <Link to="/addhomebanner" className='btn btn-success'>Add Home Banner Image</Link>
        <div className='mt-3'>
          <table className='table'>
            <thead>
              <tr>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((homebanner, index) => {
                return <tr key={index}>
                  <td>{
                    <img src={`http://localhost:8088/images/` + homebanner.image} alt="" className='employee_image' />
                  }</td>
                  <td>
                    <button onClick={e => showDeleteConfirmation(homebanner.id)} className='btn btn-sm btn-danger'>delete</button>
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
                <p>Are you sure you want to delete this image?</p>
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

export default ManageHomeBanner