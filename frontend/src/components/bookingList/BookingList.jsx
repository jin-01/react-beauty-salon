import "./bookinglist.css"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BookingPopup from "../../bookingpopup/BookingPopup";
import { useNavigate } from "react-router-dom";



function BookingList({ bookings}) {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const handleBookNow = (booking) => {
  //   setSelectedBooking(booking);
  // };

  const handleBookNow = (booking) => {
    // If user is logged in, allow them to open the BookingPopup
    if (isLoggedIn) {
      setSelectedBooking(booking);
    } else {
      // If user is not logged in, redirect to login page
      navigate('/login');
    }
  };

  const handleClosePopup = () => {
    setSelectedBooking(null);
  };

  useEffect(() => {
    axios
      .get('http://localhost:8088/')
      .then((res) => {
        if (res.data.valid) {
          setIsLoggedIn(true); // User is logged in
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoggedIn(false); // Error occurred, assume user is not logged in
      });
  }, []);

  return (
    <div>
      {/* Render the booking data */}
      {bookings.map((booking) => (

        <div className="searchItem" key={booking.id}>
          <img src={`http://localhost:8088/images/` + booking.image} alt="" className="siImg" />
          <div className="siDesc">
            <h1 className="siTitle">{booking.name}</h1>
            <span className="siArea">{booking.area}</span>
            <span className="siHairstylist">Our Hairstylist: {booking.hairstylist}</span>
            <span className="siCancelOp">{booking.cancel}</span>
            <span className="siCancelOpSubtitle">
              {booking.canceldesc}
            </span>
            <span className="siCancelOpSubtitle">
              {booking.sdesc}
            </span>
          </div>
          <div className="siDetails">
            <div className="siRating">
              <span>{booking.ratingdesc}</span>
              <button>{booking.rating}</button>
            </div>
            <div className="siDetailTexts">
              <span className="siTime">Time: {booking.time}</span>
              {/* <span className="siBookID">{booking.id}</span> */}
              <button className="siCheckButton" onClick={() => handleBookNow(booking)}>Book Now</button>
            </div>
          </div>
        </div>
      ))}
      {/* Render the pop-up if a booking is selected */}
      {selectedBooking && isLoggedIn && (
        <BookingPopup booking={selectedBooking} onClose={handleClosePopup} />
      )}
    </div>

  )
}

export default BookingList