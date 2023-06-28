import React, { useState, useEffect } from 'react';
import "./list.css"
import Navbar from '../components/navbar/Navbar'
import Header from '../components/header/Header'
import { Navigate, useLocation } from "react-router-dom"
import { Calendar } from 'react-date-range';
import BookingList from '../components/bookingList/BookingList';
import axios from 'axios';


function List() {

  const location = useLocation();
  // const { destination, date, options } = location.state;

  // const [searchDestination, setSearchDestination] = useState(destination);



  const [date, setDate] = useState(location.state.date)
  const [openDate, setOpenDate] = useState(false)
  const [destination, setDestination] = useState(location.state.destination)

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (destination) {
      axios
        .get('http://localhost:8080/bookings', {
          params: {
            destination: destination,
          },
        })
        .then((res) => {
          setBookings(res.data.Result);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [destination]);
  







  return (
    <div>
      <Navbar />
      <Header type="list"  handleSearch={setDestination}/>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={destination} type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                {`${date && date.toLocaleDateString('en-US')}`}
              </span>
              {openDate && (<Calendar
                onChange={(item) => setDate(item)}
                date={date} minDate={new Date()}
              />
              )}
            </div>

            {/* <button onClick={handleSearch}>Search</button> */}
          </div>
          <div className="listResult">
            {/* <BookingList/> */}
            <BookingList bookings={bookings} />

          </div>
        </div>
      </div>
    </div>
  )
}

export default List