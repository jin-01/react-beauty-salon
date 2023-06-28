import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddAdmin() {
    
    const [data, setData] = useState({
		name: '',
		email: '',
		password: '',
		image: ''
	})
	const navigate = useNavigate()

	const handleSubmit = (event) => {
		event.preventDefault();
		const formdata = new FormData();
		formdata.append("name", data.name);
		formdata.append("email", data.email);
		formdata.append("password", data.password);
		formdata.append("image", data.image);
		axios.post('http://localhost:8088/create', formdata)
		.then(res => {
			navigate('/admin')
		})
		.catch(err => console.log(err));
	}
    return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Add Admin</h2>
            <form class="row g-3 w-50" onSubmit={handleSubmit}>
                <div class="col-12">
                    <label for="inputName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="inputName" placeholder='Enter Name' autoComplete='off'
                        onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Email</label>
                    <input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
                        onChange={e => setData({ ...data, email: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputPassword4" class="form-label">Password</label>
                    <input type="password" class="form-control" id="inputPassword4" placeholder='Enter Password'
                        onChange={e => setData({ ...data, password: e.target.value })} />
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label" for="inputGroupFile01">Select Image</label>
                    <input type="file" class="form-control" id="inputGroupFile01"
                        onChange={e => setData({ ...data, image: e.target.files[0] })} />
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
    )
}

export default AddAdmin