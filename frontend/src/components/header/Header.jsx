import React, { useState, useEffect } from 'react';
import "./header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { faPlane } from "@fortawesome/free-solid-svg-icons"
import { faCar } from "@fortawesome/free-solid-svg-icons"
import { faTaxi } from "@fortawesome/free-solid-svg-icons"
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios'
// import { useHistory } from 'react-router-dom';


function Header({ type, handleSearch }) {

    const [openDate, setOpenDate] = useState(false)
    const [destination, setDestination] = useState("")
    const [date, setDate] = useState(null);



    const navigate = useNavigate()

    const handleSearchClick = () => {
        navigate("/bookingslot", { state: { destination, date } })

    }


    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }


    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
                <div className="headerList">
                    <div className="headerListItem">
                        
                        <Link to="/hairstylistlist" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faBed} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Our Hairstylist</span> </Link>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faPlane} />
                        <span>Flights</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faCar} />
                        <span>Car rental</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Attractions</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faTaxi} />
                        <span>Airport Taxis</span>
                    </div>
                </div>
                {type !== "list" &&
                    <>
                        <h1 className="headerTitle">A lifetime of discounts? It's Genius.</h1>
                        <p className="headerDesc">Get rewarded for your travels - unlock instant savings of 10%
                            or more with a free IBooking</p>
                        {/* <Link to="/role" className="headerBtn">Sign in / Register</Link> */}
                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                                <input type="text" placeholder="where are you going?" className="headerSearchInput"
                                    onChange={(e) => setDestination(e.target.value)} />
                            </div>
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                                <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                                {`${date ? formatDate(date) : 'YYYY-MM-DD'}`}
                                </span>
                                {openDate && (<Calendar
                                    onChange={item => setDate(item)}
                                    date={date} minDate={new Date()} className='date'
                                />
                                )}
                            </div>
                            <div className="headerSearchItem">
                                <button className="headerBtn" onClick={handleSearchClick}>Search</button>
                            </div>
                        </div></>}
            </div>
        </div>

    )
}

export default Header