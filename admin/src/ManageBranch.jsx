import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function ManageBranch() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8088/getBranch')
          .then(res => {
            if (res.data.Status === "Success") {
              setData(res.data.Result);
            } else {
              alert("Error")
            }
          })
          .catch(err => console.log(err));
      }, [])
  
  
  return (
    <div className='px-5 py-3'>
    <div className='d-flex justify-content-center mt-2'>
      <h3>Admin List</h3>
    </div>
    <Link to="/addbranch" className='btn btn-success'>Add Branch</Link>
    <div className='mt-3'>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Area</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((branch, index) => {
            return <tr key={index}>
              <td>{branch.name}</td>
              <td>{
                <img src={`http://localhost:8088/images/` + branch.image} alt="" className='employee_image' />
              }</td>
              <td>{branch.area}</td>
              <td>
                <Link to={`/editadmin/` + branch.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                <button onClick={e => handleDelete(branch.id)} className='btn btn-sm btn-danger'>delete</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default ManageBranch