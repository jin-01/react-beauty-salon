import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MTopBranch() {
    const [data, setData] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8088/gettopbranch')
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
                <h3>Top Branch List</h3>
            </div>
            <Link to="/addtopbranch" className='btn btn-success'>Add Top Branch</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Area</th>
                            <th>Rating</th>
                            <th>Rating desc</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((homethree, index) => {
                            return <tr key={index}>
                                <td>{homethree.name}</td>
                                <td>{homethree.area}</td>
                                <td>{homethree.rating}</td>
                                <td>{homethree.ratingdesc}</td>
                                <td>{
                                    <img src={`http://localhost:8088/images/` + homethree.image} alt="" className='employee_image' />
                                }</td>
                                <td>
                                    <Link to={`/editadmin/` + homethree.id} className='btn btn-primary btn-sm me-2'>edit</Link>
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

export default MTopBranch