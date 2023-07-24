import "./homefunction.css";
import React from 'react';
import { Link } from 'react-router-dom';

function HomeFunction() {
    return (
        <div className="hList">
            <div className="hListItem" >
                <Link to="/hairservice" className="hListLink">
                    <img src="../Images/hair service.jpg" alt="" className="pListImg" />
                    <button className="hListButton">Our Service</button>
                </Link>
            </div>
            <div className="hListItem">
                <Link to="/branchlist" className="hListLink">
                    <img src="../Images/Salon.jpg" alt="" className="pListImg" />
                    <button className="hListButton">Our Branch</button>
                </Link>
            </div>
            <div className="hListItem">
                <Link to="/hairstylistlist" className="hListLink">
                    <img src="../Images/hairstylist.jpg" alt="" className="pListImg" />
                    <button className="hListButton">Our Hairstylist</button>
                </Link>
            </div>
        </div>
    );
}

export default HomeFunction;
