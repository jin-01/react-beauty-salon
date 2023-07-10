import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function ManageBooking() {
  return (
    <div className='px-5 py-3'>
    <div className='d-flex justify-content-center mt-2'>
      <h3>Admin List</h3>
    </div>
    <Link to="/addbooking" className='btn btn-success'>Add Booking</Link>
    <div className='mt-3'>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Area</th>
            <th>Hairstylist</th>
            <th>Time</th>
            <th>Shop Description</th>
            <th>Cancel Option</th>
            <th>Cancel Description</th>
            <th>Rating Description</th>
            <th>Rating</th>
            <th>Price</th>
            <th>Tax</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* {data.map((admin, index) => {
            return <tr key={index}>
              <td>{admin.name}</td>
              <td>{
                <img src={`http://localhost:8088/images/` + admin.image} alt="" className='employee_image' />
              }</td>
              <td>{admin.email}</td>
              <td>
                <Link to={`/editadmin/` + admin.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                <button onClick={e => handleDelete(admin.id)} className='btn btn-sm btn-danger'>delete</button>
              </td>
            </tr>
          })} */}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default ManageBooking