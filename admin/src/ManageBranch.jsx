import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

function ManageBranch() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8088/getBranch')
      .then(res => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err));
  }, []);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

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
      .delete('http://localhost:8088/deletebranch/' + idToDelete)
      .then(res => {
        if (res.data.Status === "Success") {
          // Remove the page reload
          setData(data.filter(branch => branch.id !== idToDelete));
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

    const filteredBranch = data.filter(branch => branch.name.toLowerCase().includes(value));
    setFilteredData(filteredBranch);
  };

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Branch List</h3>
      </div>
      <div className="d-flex justify-content-between ">
        <Link to="/addbranch" className='btn btn-success'>Add Branch</Link>
        <input
          type="text"
          placeholder="Filter by  Branch name"
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
              <th>Branch Description</th>
              <th>Rating</th>
              <th>Rating Desc</th>
              <th>Google Map Url</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((branch, index) => {
              return (
                <tr key={index}>
                  <td>{branch.name}</td>
                  <td>
                    <img src={`http://localhost:8088/images/` + branch.image} alt="" className='employee_image' />
                  </td>
                  <td>{branch.area}</td>
                  <td title={branch.bdesc}>
                    {truncateText(branch.bdesc, 40)} {/* Adjust the maxLength as needed */}
                  </td>
                  <td>{branch.rating}</td>
                  <td>{branch.ratingdesc}</td>
                  <td title={branch.url}>
                    {truncateText(branch.url, 30)} {/* Adjust the maxLength as needed */}
                  </td>
                  <td>
                    <Link to={`/editbranch/` + branch.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                    <button onClick={e => showDeleteConfirmation(branch.id)} className='btn btn-sm btn-danger'>delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Confirm Alert */}
        {showConfirmAlert && (
          <div className="confirm-alert-container">
            <Alert variant="danger">
              <Alert.Heading>Confirm Delete</Alert.Heading>
              <p>Are you sure you want to delete this branch?</p>
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
  );
}

export default ManageBranch;
