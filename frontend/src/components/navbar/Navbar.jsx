import "./navbar.css"
import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

function Navbar() {
    const [name, setName] = useState('')
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:8088/')
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username);

                }
                // else {
                //     navigate('/login')
                // }

            })
            .catch(err => console.log(err))
    }, [])

    const handleLogout = () => {
        axios.get('http://localhost:8088/logout')
            .then(res => {
                // sessionStorage.clear();
                window.location.href = '/';
            }).catch(err => console.log(err));
    }

    return (
        <div className="navbar">
            <div className="navContainer">
                <span className="logo">Salon GO</span>
                <div className="navItems">
                    {name ? (
                        <>
                            <Link to="/" className="navButton">{name}</Link>
                            <button className="navButton" onClick={handleLogout}>Sign Out</button>
                        </>
                    ) : (
                        <Link to="/login" className="navButton">Login</Link>
                    )}
                </div>
            </div>

        </div>

    )
}

export default Navbar