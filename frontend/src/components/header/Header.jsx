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
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'
// import { useHistory } from 'react-router-dom';


function Header({ type, handleSearch }) {

    const [openDate, setOpenDate] = useState(false)
    const [destination, setDestination] = useState("")
    const [date, setDate] = useState(null);



    const navigate = useNavigate()

    const handleSearchClick = ()=>{
        navigate("/hotels", {state:{destination,date}})

    }
    




    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
                <div className="headerList">
                    <div className="headerListItem active">
                        <FontAwesomeIcon icon={faBed} />
                        <span>Stays</span>
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
                        <button className="headerBtn">Sign in / Register</button>
                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                                <input type="text" placeholder="where are you going?" className="headerSearchInput"
                                    onChange={(e) => setDestination(e.target.value)} />
                            </div>
                            <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                            <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                                {`${date && date.toLocaleDateString('en-US')}`}
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