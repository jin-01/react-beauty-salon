import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'


function MUserBooking() {

    const [data, setData] = useState([])
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        fetchUserBookings();
    }, []);

    const fetchUserBookings = () => {
        axios.get(`http://localhost:8088/getuserbooking?username=${searchValue}`)
            .then(res => {
                if (res.data.Status === "Success") {
                    setData(res.data.Result);
                } else {
                    alert("Error");
                }
            })
            .catch(err => console.log(err));
    };

    const handleSearch = () => {
        // Fetch user bookings with the updated search term
        fetchUserBookings();
    };



    useEffect(() => {
        axios.get('http://localhost:8088/getuserbooking')
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
            .delete('http://localhost:8088/deleteuserbooking/' + idToDelete)
            .then(res => {
                if (res.data.Status === "Success") {
                    // Remove the page reload
                    setData(data.filter(booking => booking.id !== idToDelete));
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
                <h3>User Booking List</h3>
            </div>
            <div className="d-flex ">
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{marginRight: 10}}
                />
                <button className='btn btn-success' onClick={handleSearch}>Search</button>
            </div>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Customer Username</th>
                            <th>Branch Name</th>
                            <th>Branch Area</th>
                            <th>Hairstylist</th>
                            <th>Booking Date</th>
                            <th>Booking Time</th>
                            <th>Hair Type</th>
                            <th>Hair Service</th>
                            <th>Price</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((userbooking, index) => {
                            return <tr key={index}>
                                <td>{userbooking.id}</td>
                                <td>{userbooking.username}</td>
                                <td>{userbooking.name}</td>
                                <td>{userbooking.area}</td>
                                <td>{userbooking.hairstylist}</td>
                                <td>{userbooking.date}</td>
                                <td>{userbooking.time}</td>
                                <td>{userbooking.hairtype}</td>
                                <td>{userbooking.hairservice}</td>
                                <td>{userbooking.price}</td>
                                <td>{userbooking.phone}</td>
                                <td>{userbooking.status}</td>
                                <td>
                                    <button onClick={e => showDeleteConfirmation(userbooking.id)} className='btn btn-sm btn-danger'>delete</button>
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
                            <p>Are you sure you want to delete this booking?</p>
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

export default MUserBooking