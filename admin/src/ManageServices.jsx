import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function ManageServices() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8088/getservices')
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
      .delete('http://localhost:8088/deleteservices/' + idToDelete)
      .then(res => {
        if (res.data.Status === "Success") {
          // Remove the page reload
          setData(data.filter(services => services.id !== idToDelete));
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

    const filteredServices = data.filter(services => services.name.toLowerCase().includes(value));
    setFilteredData(filteredServices);
  };

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Hair Services List</h3>
      </div>
      <div className="d-flex justify-content-between ">
        <Link to="/addservices" className='btn btn-success'>Add Services</Link>
        <input
          type="text"
          placeholder="Filter by Hair Service"
          onChange={handleFilter}
        />
      </div>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Hair Service</th>
              <th>Hair Type</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((service, index) => {
              return <tr key={index}>
                <td>{service.name}</td>
                <td>{service.type}</td>
                <td>{service.price}</td>
                <td>
                  <Link to={`/editservices/` + service.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                  <button onClick={e => showDeleteConfirmation(service.id)} className='btn btn-sm btn-danger'>delete</button>
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
              <p>Are you sure you want to delete this hair service?</p>
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

export default ManageServices