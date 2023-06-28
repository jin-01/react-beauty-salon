import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Hairstylist() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8088/getHairstylist')
            .then(res => {
                if (res.data.Status === "Success") {
                    setData(res.data.Result);
                } else {
                    alert("Error")
                }
            })
            .catch(err => console.log(err));
    }, [])

    const handleDelete = (id) => {
        axios.delete('http://localhost:8088/deleteHairstylist/' + id)
            .then(res => {
                if (res.data.Status === "Success") {
                    window.location.reload(true);

                } else {
                    alert("Error")
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='px-5 py-3'>
            <div className='d-flex justify-content-center mt-2'>
                <h3>Hairstylist List</h3>
            </div>
            <Link to="/createHairstylist" className='btn btn-success'>Add Hairstylist</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Phone</th>
                            <th>Salary</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((hairstylist, index) => {
                            return <tr key={index}>
                                <td>{hairstylist.name}</td>
                                <td>{
                                    <img src={`http://localhost:8088/images/` + hairstylist.image} alt="" className='employee_image' />
                                }</td>
                                <td>{hairstylist.email}</td>
                                <td>{hairstylist.age}</td>
                                <td>{hairstylist.phone}</td>
                                <td>{hairstylist.salary}</td>
                                <td>
                                    <Link to={`/editHairstylist/` + hairstylist.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                                    <button onClick={e => handleDelete(hairstylist.id)} className='btn btn-sm btn-danger'>delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Hairstylist