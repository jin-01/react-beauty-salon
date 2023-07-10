import React, { useState } from 'react'
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/navbar/Navbar'
import Header from './components/header/Header'
import { motion } from 'framer-motion'; // Import the animation library


function Login() {

    const [values, setValues] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const [error, setError] = useState('')
    

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8088/login', values)
        .then((res) => {
            if (res.data.Status === 'Success') {
         
                navigate('/');

            } else {
              setError(res.data.Error);
            }
          })
          .catch((err) => console.log(err));
      };

    return (
        <div>
        <Navbar />
        <Header type="list" />
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className="d-flex flex-column align-items-center justify-content-center ">
          <motion.div
            initial={{ opacity: 0, y: -50 }} // Initial animation state
            animate={{ opacity: 1, y: 0 }} // Animation to apply
            transition={{ duration: 0.5 }} // Transition duration
            className="p-3 rounded w-25 border loginForm"
          >
            <div className="text-danger">{error && error}</div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username">
                  <strong>Username</strong>
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  onChange={(e) =>
                    setValues({ ...values, username: e.target.value })
                  }
                  className="form-control rounded-0"
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  onChange={(e) =>
                    setValues({ ...values, password: e.target.value })
                  }
                  className="form-control rounded-0"
                />
              </div>
              <button type="submit" className="btn btn-success w-100 rounded-0">
                Log in
              </button>
              <p>You agree to our terms and policies</p>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

export default Login
