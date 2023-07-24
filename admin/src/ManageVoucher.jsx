import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function ManageVoucher() {

    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8088/getvoucher')
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
          .delete('http://localhost:8088/deletevoucher/' + idToDelete)
          .then(res => {
            if (res.data.Status === "Success") {
              // Remove the page reload
              setData(data.filter(voucher => voucher.id !== idToDelete));
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
    
        const filteredVoucher = data.filter(voucher => voucher.name.toLowerCase().includes(value));
        setFilteredData(filteredVoucher);
      };

  return (
    <div className='px-5 py-3'>
    <div className='d-flex justify-content-center mt-2'>
      <h3>Voucher List</h3>
    </div>
    <div className="d-flex justify-content-between ">
    <Link to="/addvoucher" className='btn btn-success'>Add Voucher</Link>
        <input
          type="text"
          placeholder="Filter by Voucher Name"
          onChange={handleFilter}
        />
      </div>
    <div className='mt-3'>
      <table className='table'>
        <thead>
          <tr>
            <th>Voucher Name</th>
            <th>Voucher point</th>
            <th>Voucher desc</th>
            <th>Voucher price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((voucher, index) => {
            return <tr key={index}>
              <td>{voucher.name}</td>
              <td>{voucher.vpoint}</td>
              <td>{voucher.vdesc}</td>
              <td>{voucher.price}</td>
              <td>
                <Link to={`/editvoucher/` + voucher.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                <button onClick={e => showDeleteConfirmation(voucher.id)} className='btn btn-sm btn-danger'>delete</button>
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
              <p>Are you sure you want to delete this voucher?</p>
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

export default ManageVoucher