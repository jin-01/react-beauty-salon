import "./bookinglist.css"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BookingPopup from "../../bookingpopup/BookingPopup";



function BookingList({ bookings}) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleBookNow = (booking) => {
    setSelectedBooking(booking);
  };
  const handleClosePopup = () => {
    setSelectedBooking(null);
  };

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
            {/* <span className="siSubtitle">
              {booking.shopdesc}
            </span> */}
            {/* <span className="siFeatures">
              Entire studio 1 bathroom
            </span> */}
            <span className="siCancelOp">{booking.cancel}</span>
            <span className="siCancelOpSubtitle">
              {booking.canceldesc}
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
      {selectedBooking && (
        <BookingPopup booking={selectedBooking} onClose={handleClosePopup} />
      )}
    </div>

  )
}

export default BookingList