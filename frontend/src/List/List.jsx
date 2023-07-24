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
  const [date, setDate] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [searchArea, setSearchArea] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if location.state exists and has the expected properties
    if (location.state && location.state.searchArea || location.state.date) {
      setSearchArea(location.state.searchArea);
      setDate(location.state.date);
    } else {
      setSearchArea('');
      setDate(null);
    }
  }, [location.state]);

  useEffect(() => {
    if (searchArea !== '') {
      if (date) {
        fetchBookings();
      } else {
        setBookings([]);
        setMessage('Please select a date.');
      }
    } else {
      setBookings([]);
      setMessage('Please enter an area.');
    }
  }, [searchArea, date]);


  const fetchBookings = () => {
    const formattedDate = formatDate(date); // Format date as YYYY-MM-DD
    axios
      .get(`http://localhost:8088/getBookings?area=${searchArea}&date=${formattedDate}&status=Available`)
      .then(res => {
        if (res.data.Status === "Success") {
          setBookings(res.data.Result);
          setMessage('');
        } else if (res.data.Status === "NoResults") {
          setBookings([]);
          setMessage('No available bookings found for the selected area and date.');
        } else {
          alert("Error");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Error");
      });
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Area:</label>
              <input placeholder={searchArea} type="text"
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value)} />
            </div>
            <div className="lsItem">
              <label>Booking Date:</label>
              <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                {`${date ? formatDate(date) : 'YYYY-MM-DD'}`}
              </span>
              {openDate && (
                <Calendar
                  onChange={(item) => setDate(item)}
                  date={date}
                  minDate={new Date()}
                />
              )}
            </div>

            
          </div>
          <div className="listResult">
            
            {message !== '' ? (
              <p className="message">{message}</p>
            ) : (
              <BookingList bookings={bookings} />
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default List