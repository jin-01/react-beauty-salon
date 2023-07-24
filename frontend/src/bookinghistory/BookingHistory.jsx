import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import Navbar from '../components/navbar/Navbar';
// import Header from '../components/header/Header';
import './bookinghistory.css'
import { useNavigate } from 'react-router-dom';

function BookingHistory() {
    const [data, setData] = useState([]);
    const navigate = useNavigate()




    useEffect(() => {
        axios
            .get('http://localhost:8088/getbookinghistory')
            .then((res) => {
                if (res.data.Status === 'Success') {
                    setData(res.data.Result);
                } else {
                    alert('Error');
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleRateClick = (booking) => {
        // Navigate to the rating page/component
        navigate("/addreview", { state: { booking } })
    };
    return (
        <div>
            {/* <Navbar />
            <Header type="list" /> */}
            <div className="container my-5">
                <h1 className="text-center mb-4">My Booking History</h1>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {data.length > 0 ? (
                        data.map((booking) => (
                            <div className="col" key={booking.id}>
                                <div className="card h-100 shadow booking-card">
                                {booking.image ? (
                                        <img
                                            src={`http://localhost:8088/images/` + booking.image}
                                            alt="Booking Image"
                                            className="card-img-top"
                                        />
                                    ) : (
                                        <div className="card-img-top placeholder-box d-flex align-items-center justify-content-center">
                                            Waiting for admin to update the image
                                        </div>
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{booking.name}</h5>
                                        <p className="card-text">{booking.area}</p>
                                        <p className="card-text mb-1">{booking.date}</p>
                                        <p className="card-text">{booking.time}</p>
                                        <p className="card-text">{booking.hairservice}</p>
                                        <p className="card-text">{booking.hairtype}</p>
                                        <p className="card-text">{booking.price}</p>
                                        <div className="d-grid gap-2">
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleRateClick(booking)}
                                                disabled={booking.reviewSubmitted} // Disable the button if it's already reviewed
                                                >
                                                  {booking.reviewSubmitted ? "Reviewed" : "Rate"} {/* Change the button label accordingly */}
                                                </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No Payment found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingHistory