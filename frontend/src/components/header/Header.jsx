import React, { useState, useEffect } from 'react';
import "./header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays, faHome, faPerson, faShop, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
// import { useHistory } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';


function Header({ type, handleSearch }) {

    const [openDate, setOpenDate] = useState(false)
    const [destination, setDestination] = useState("")
    const [date, setDate] = useState(null);
    const [areaList, setAreaList] = useState([]);
    const [searchArea, setSearchArea] = useState("");



    const navigate = useNavigate()

    const handleSearchClick = () => {
        navigate("/bookingslot", { state: { searchArea, date } })

    }

    useEffect(() => {
        axios
            .get('http://localhost:8088/getbranchareas')
            .then((res) => {
                if (res.data.Status === "Success") {
                    setAreaList(res.data.Result);
                } else {
                    alert("Error");
                }
            })
            .catch((err) => console.log(err));
    }, []);


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
                        <Link to="/" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faHome} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Home</span> </Link>
                    </div>
                    <div className="headerListItem">
                        <Link to="/hairstylistlist" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faPerson} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Our Hairstylist</span> </Link>
                    </div>
                    <div className="headerListItem">
                        <Link to="/branchlist" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faShop} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Our Branches</span> </Link>
                    </div>
                    <div className="headerListItem">
                        <Link to="/hairservice" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faShop} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Hair Services</span> </Link>
                    </div>
                    <div className="headerListItem">
                        <Link to="/mybooking" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faShop} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">My Booking</span> </Link>
                    </div>
                    <div className="headerListItem">
                        <Link to="/profile" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faShop} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">My Profile</span> </Link>
                    </div>
                    <div className="headerListItem">
                        <Link to="/loyalty" className="nav-link px-0 align-middle text-white"> <FontAwesomeIcon icon={faShop} />
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">My Loyalty</span> </Link>
                    </div>
                </div>
                {type !== "list" &&
                    <>


                        <h1 className="headerTitle">Your New Beauty Salon Experience Starts Here</h1>
                        <p className="headerDesc">Experience the epitome of elegance and rejuvenation with our exquisite range of salon services</p>
                        {/* <Link to="#about-us" className="headerBtn btn btn-primary btn-lg">About Us</Link> */}
                        {/* Use ScrollLink instead of regular Link */}
                        <ScrollLink
                            to="about-us" // The same name as the target element's "name" attribute
                            smooth={true} // Add smooth scrolling
                            offset={-70} // Adjust the offset if needed (to handle any fixed header, etc.)
                            duration={500} // Duration of the scroll animation
                            className="headerBtn btn btn-primary btn-lg"
                        >
                            About Us
                        </ScrollLink>
                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faLocationDot} className="headerIcon" />
                                <select
                                    value={searchArea}
                                    onChange={(e) => setSearchArea(e.target.value)}
                                >
                                    <option value="">Select an area</option>
                                    {areaList.map((area) => (
                                        <option value={area} key={area}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
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
                                <button className="headerBtn2 btn btn-primary " onClick={handleSearchClick}>Search</button>
                            </div>
                        </div></>}
            </div>
        </div>

    )
}

export default Header