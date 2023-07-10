import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HomeRowOne() {

    const [data, setData] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8088/getHomeone')
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
    <Link to="/addhomeone" className='btn btn-success'>Add Home Row 1</Link>
    <div className='mt-3'>
      <table className='table'>
        <thead>
          <tr>
            <th>Area</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((homeone, index) => {
            return <tr key={index}>
              <td>{homeone.area}</td>
              <td>{
                <img src={`http://localhost:8088/images/` + homeone.image} alt="" className='employee_image' />
              }</td>
              <td>
                <Link to={`/editadmin/` + homeone.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                {/* <button onClick={e => handleDelete(homeone.id)} className='btn btn-sm btn-danger'>delete</button> */}
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default HomeRowOne