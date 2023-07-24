import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Header from '../components/header/Header';
import './mybooking.css';
import BookingHistory from '../bookinghistory/BookingHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faList } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

function MyBooking() {
  const [data, setData] = useState([]);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  
  useEffect(() => {
    axios
      .get('http://localhost:8088/')
      .then((res) => {
        if (res.data.valid ) {
          navigate('/mybooking')
        } else {
          navigate('/login')
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8088/getcompletedbooking')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        } else {
          alert('Error');
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const toggleBookingHistory = () => {
    setShowBookingHistory(!showBookingHistory);
  };



  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (confirmed) {
      axios
        .delete(`http://localhost:8088/cancelbooking/${id}`)
        .then((res) => {
          if (res.data.Status === 'Success') {
            setData(data.filter((booking) => booking.id !== id));
          } else {
            alert('Error');
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="text-center mt-3">
        <button
          className={`btn btn-primary btn-sm ${showBookingHistory ? 'active' : ''
            }`}
          onClick={toggleBookingHistory}
        >
          {showBookingHistory ? (
            <>
              <FontAwesomeIcon icon={faList} /> Go Back My Booking
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faHistory} /> Go Booking History
            </>
          )}
        </button>
      </div>
      {showBookingHistory ? (
        <div className="booking-history">
          {/* Add your booking history page content here */}
          <BookingHistory />
        </div>
      ) : (
        <div className="container my-5">
          <h1 className="text-center mb-4">My Booking List</h1>
          <div className="my-booking-page">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {data.length > 0 ? (
                data.map((booking) => (
                  <div className="col" key={booking.id}>
                    <div className="card h-100 shadow booking-card">
                      <div className="card-body">
                        <h5 className="card-title">{booking.name}</h5>
                        <p className="card-text">{booking.area}</p>
                        <p className="card-text mb-1">Booking ID: {booking.id}</p>
                        <p className="card-text mb-1">{booking.date}</p>
                        <p className="card-text">{booking.time}</p>
                        <p className="card-text">{booking.hairservice}</p>
                        <p className="card-text">{booking.hairtype}</p>
                        <p className="card-text">{booking.price}</p>
                        <div className="d-grid gap-2">
                        <button onClick={() => handleDelete(booking.id)
                        } className='btn btn-sm btn-danger'>Cancel Booking</button>
                          <Link to={`/payment/` + booking.id} className="btn btn-primary">Make Payment</Link>

                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No bookings found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooking;
