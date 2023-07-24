import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Register() {
    const [data, setData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        image: '',
        phone: '',
        area: '',
        bdate: '',
        age: '',
        gender: '',
    })
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        setRegistrationSuccess('');
        setUsernameError('');

        const formdata = new FormData();


        formdata.append("username", data.username);
        formdata.append("name", data.name);
        formdata.append("email", data.email);
        formdata.append("password", data.password);
        formdata.append("image", data.image);
        formdata.append("phone", data.phone);
        formdata.append("area", data.area);
        formdata.append("bdate", data.bdate);
        formdata.append("age", data.age);
        formdata.append("gender", data.gender);
        axios.post('http://localhost:8088/register', formdata)
            .then((response) => {
                if (response.data.Status === 'Success') {
                    setRegistrationSuccess(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000); // Redirect to login page after 3 seconds
                } else if (response.data.Error === 'Username already taken') {
                    setUsernameError("Username already taken! Please choose another");
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 2000);
                }
            })
            .catch((err) => console.log(err));
    };


    const handleBackClick = () => {
        navigate('/'); // Assuming you have a route for the registration page with the path '/register'
    };
    return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Member Registration</h2>
            <form class="row g-3 w-50" onSubmit={handleSubmit}>
                <div class="col-12">
                    <label for="inputUsername" class="form-label">Username</label>
                    <input type="text" class="form-control" id="inputUsername" placeholder='Enter Username' autoComplete='off' required
                        onChange={e => setData({ ...data, username: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="inputName" placeholder='Enter Name' autoComplete='off' required
                        onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Email</label>
                    <input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off' required
                        onChange={e => setData({ ...data, email: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputPassword4" class="form-label">Password</label>
                    <input type="password" class="form-control" id="inputPassword4" placeholder='Enter Password' required
                        onChange={e => setData({ ...data, password: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputPhone" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="inputPhone" placeholder='Enter Phone' autoComplete='off' required
                        onChange={e => setData({ ...data, phone: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputArea" class="form-label">Area</label>
                    <input type="text" class="form-control" id="inputArea" placeholder='Enter Area' autoComplete='off' required
                        onChange={e => setData({ ...data, area: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputBdate" class="form-label">Date of Birthday</label>
                    <input type="date" class="form-control" id="inputBdate" autoComplete='off' required
                        onChange={e => setData({ ...data, bdate: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputAge" class="form-label">Age</label>
                    <input type="number" class="form-control" id="inputAge" autoComplete='off' required
                        onChange={e => setData({ ...data, age: e.target.value })} />
                </div>
                <div className="col-12">
                    <label htmlFor="inputGender" className="form-label">
                        Gender
                    </label>
                    <select
                        className="form-select"
                        id="inputGender"
                        required
                        onChange={e => setData({ ...data, gender: e.target.value })}
                    >
                        <option value="" disabled selected>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label" for="inputGroupFile01">Select Image</label>
                    <input type="file" class="form-control" id="inputGroupFile01" required
                        onChange={e => setData({ ...data, image: e.target.files[0] })} />
                </div>

                <div className="col-12 mb-3">
                    {registrationSuccess && (
                        <div className="alert alert-success" role="alert">
                            Register successfully! You will be redirected to the login page.
                        </div>
                    )}
                    {usernameError && (
                        <div className="alert alert-danger" role="alert">
                            {usernameError}
                        </div>
                    )}
                    <div className="col-12">
                        <div className="d-flex" style={{ marginBottom: '50px' }}>
                            <button className="btn btn-danger " style={{ marginRight: '10px' }} onClick={handleBackClick}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-primary">Create</button>

                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register