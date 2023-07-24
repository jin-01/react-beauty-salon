import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AddHairstylist() {


    const [data, setData] = useState({
        name: '',
        email: '',
        bname: '',
        area: '',
        hdesc: '',
        age: '',
        gender: '',
        phone: '',
        image: ''
    })
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("email", data.email);
        formdata.append("bname", data.bname);
        formdata.append("area", data.area);
        formdata.append("hdesc", data.hdesc);
        formdata.append("age", data.age);
        formdata.append("gender", data.gender);
        formdata.append("phone", data.phone);
        formdata.append("image", data.image);
        axios.post('http://localhost:8088/createHairstylist', formdata)
            .then((response) => {
                if (response.data.Status === 'Success') {
                    setSuccessMessage(true);
                    setTimeout(() => {
                        navigate('/hairstylist');
                    }, 3000); // Redirect to login page after 3 seconds
                } else if (response.data.Error === 'Name already taken') {
                    setErrorMessage("Name already taken! Please choose another");
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 2000);
                }
            })
            .catch((err) => console.log(err));
    };

    const [branches, setBranches] = useState([]);

    useEffect(() => {
        // Fetch branches from the branch database
        axios.get('http://localhost:8088/branches')
            .then(res => {
                setBranches(res.data);
            })
            .catch(err => console.log(err));
    }, []); // Empty dependency array to fetch branches only once

    const handleBranchChange = e => {
        const selectedBranch = branches.find(branch => branch.name === e.target.value);
        setData({ ...data, bname: e.target.value, area: selectedBranch.area });
    };

    return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Add Hairstylist</h2>
            <form class="row g-3 w-50" onSubmit={handleSubmit}>
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
                <div className="col-12">
                    <label htmlFor="inputBranch" className="form-label">Branch Name</label>
                    <select
                        id="inputBranch"
                        className="form-control"
                        onChange={handleBranchChange}
                        value={data.bname}
                        required
                    >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                            <option key={branch.name} value={branch.name}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Area</label>
                    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Area' autoComplete='off' readOnly required
                        onChange={e => setData({ ...data, area: e.target.value })} value={data.area} />
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Description</label>
                    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Description' autoComplete='off' required
                        onChange={e => setData({ ...data, hdesc: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputAge" class="form-label">Age</label>
                    <input type="number" class="form-control" id="inputAge" placeholder='Enter Age' required
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
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Phone' autoComplete='off' required
                        onChange={e => setData({ ...data, phone: e.target.value })} />
                </div>
                <div class="col-12">
                    <label class="form-label" for="inputGroupFile01">Select Image</label>
                    <input type="file" class="form-control" id="inputGroupFile01" required
                        onChange={e => setData({ ...data, image: e.target.files[0] })} />
                </div>
                <div className="col-12">
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            Add Successfully!
                        </div>
                    )}
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    )
}

export default AddHairstylist