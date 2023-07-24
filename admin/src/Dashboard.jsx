import React, { useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
    const navigate = useNavigate()
	axios.defaults.withCredentials = true;
	useEffect(()=>{
		axios.get('http://localhost:8088/dashboard')
		.then(res => {
			if(res.data.Status === "Success") {
				if(res.data.role === "admin") {
					navigate('/');
				} else {
					const id = res.data.id;
					// navigate('/employeedetail/'+id)
				}
			} else {
				navigate('/adminlogin')
			}
		})
	}, [])

    const handleLogout = () => {
		axios.get('http://localhost:8088/logout')
		.then(res => {
			navigate('/adminlogin')
		}).catch(err => console.log(err));
	}

  return (
    <div className="container-fluid">
    <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 fw-bolder d-none d-sm-inline">Admin Dashboard</span>
                </a>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li>
                        <Link to="/" data-bs-toggle="collapse" className="nav-link text-white px-0 align-middle">
                            <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span> </Link>
                    </li>
                    <li>
                        <Link to="/admin" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Admin</span> </Link>
                    </li>
                    <li>
                        <Link to="/hairstylist" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Hairstylist</span> </Link>
                    </li>
                    <li>
                        <Link to="/getbranch" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Branch</span> </Link>
                    </li>
                    <li>
                        <Link to="/bookingslot" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Booking Slot</span> </Link>
                    </li>
                    <li>
                        <Link to="/getservices" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Services</span> </Link>
                    </li>
                    <li>
                        <Link to="/user" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage User</span> </Link>
                    </li>
                    <li>
                        <Link to="/userbooking" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage User Booking</span> </Link>
                    </li>
                    <li>
                        <Link to="/payment" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage User Payment</span> </Link>
                    </li>
                    <li>
                        <Link to="/userreview" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage User Review</span> </Link>
                    </li>
                    <li>
                        <Link to="/uservoucher" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage User Voucher</span> </Link>
                    </li>
                    <li>
                        <Link to="/voucher" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Voucher</span> </Link>
                    </li>
                    <li>
                        <Link to="/slideshow" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage SlideShow</span> </Link>
                    </li>
                    <li>
                        <Link to="/homebanner" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Home Banner</span> </Link>
                    </li>
                    <li>
                        <Link to="/tophairstylist" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Top Hairstylist</span> </Link>
                    </li>
                    
                    <li>
                        <a to="profile" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Profile</span></a>
                    </li>
                    <li onClick={handleLogout}>
                        <a href="#" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Logout</span></a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col p-0 m-0">
            <div className='p-2 d-flex justify-content-center shadow'>
                <h4>Admin Management System</h4>
            </div>
            <Outlet/>
        </div>
    </div>
</div>
  )
}

export default Dashboard