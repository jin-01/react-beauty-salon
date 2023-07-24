import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from 'react-bootstrap';

function Admin() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8088/getAdmin')
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
      .delete('http://localhost:8088/delete/' + idToDelete)
      .then(res => {
        if (res.data.Status === "Success") {
          // Remove the page reload
          setData(data.filter(admin => admin.id !== idToDelete));
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err))
      .finally(() => closeConfirmAlert()); // Close the alert regardless of the outcome
  };

  useEffect(() => {
    // When the data changes, update the filteredData with the new data
    setFilteredData(data);
  }, [data]);

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    // Filter the data based on the entered name
    const filteredAdmins = data.filter(admin => admin.email.toLowerCase().includes(value));
    setFilteredData(filteredAdmins);
  };
  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Admin List</h3>

      </div>
      <div className="d-flex justify-content-between ">
      <Link to="/create" className='btn btn-success'>Add Admin</Link>

        <input
          type="text"
          placeholder="Filter by email"
          onChange={handleFilter}
        />
      </div>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((admin, index) => {
              return <tr key={index}>
                <td>{admin.email}</td>
                <td>
                  {/* <Link to={`/editadmin/` + admin.id} className='btn btn-primary btn-sm me-2'>edit</Link> */}
                  <button onClick={() => showDeleteConfirmation(admin.id)} className='btn btn-sm btn-danger'>delete</button>
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
              <p>Are you sure you want to delete this admin?</p>
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

export default Admin