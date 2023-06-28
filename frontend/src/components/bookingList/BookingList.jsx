import "./bookinglist.css"
import React, { useEffect, useState } from 'react'
import axios from 'axios'


function BookingList() {

  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8088/getBooking')
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
    <div>
      {/* Render the booking data */}
      {data.map(booking => (

        <div className="searchItem" key={booking.id}>
          <img src={`http://localhost:8088/images/` + booking.image} alt="" className="siImg" />
          <div className="siDesc">
            <h1 className="siTitle">{booking.name}</h1>
            <span className="siDistance">{booking.area}</span>
            <span className="siTaxiOp">{booking.time}</span>
            <span className="siSubtitle">
              {booking.shopdesc}
            </span>
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
              <span className="siPrice">{booking.price}</span>
              <span className="siTaxOp">{booking.tax}</span>
              <button className="siCheckButton">See availability</button>
            </div>
          </div>
        </div>
      ))}
    </div>

  )
}

export default BookingList