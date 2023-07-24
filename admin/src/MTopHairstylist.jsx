import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function MTopHairstylist() {
    const [data, setData] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8088/gettophairstylist')
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
        .delete('http://localhost:8088/deletetophairstylist/' + idToDelete)
        .then(res => {
          if (res.data.Status === "Success") {
            // Remove the page reload
            setData(data.filter(tophairstylist => tophairstylist.id !== idToDelete));
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
                <h3>Top Hairstylist</h3>
            </div>
            <Link to="/addtophairstylist" className='btn btn-success'>Add Top Hairstylist</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Branch Name</th>
                            <th>Area</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((tophairstylist, index) => {
                            return <tr key={index}>
                                <td>{tophairstylist.name}</td>
                                <td>{tophairstylist.bname}</td>
                                <td>{tophairstylist.area}</td>
                                <td>{
                                    <img src={`http://localhost:8088/images/` + tophairstylist.image} alt="" className='employee_image' />
                                }</td>
                                <td>
                                    <button onClick={e => showDeleteConfirmation(tophairstylist.id)} className='btn btn-sm btn-danger'>delete</button>
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
              <p>Are you sure you want to delete this hairstylist?</p>
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

export default MTopHairstylist