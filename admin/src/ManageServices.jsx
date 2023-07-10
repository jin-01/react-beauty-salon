import axios from 'axios'
import React, { useEffect, useState } from 'react'
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
  
  return (
    <div className='px-5 py-3'>
    <div className='d-flex justify-content-center mt-2'>
      <h3>Hair Services List</h3>
    </div>
    <Link to="/addservices" className='btn btn-success'>Add Services</Link>
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
          {data.map((service, index) => {
            return <tr key={index}>
              <td>{service.name}</td>
              <td>{service.type}</td>
              <td>{service.price}</td>
              <td>
                {/* <Link to={`/editadmin/` + service.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                <button onClick={e => handleDelete(service.id)} className='btn btn-sm btn-danger'>delete</button> */}
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default ManageServices