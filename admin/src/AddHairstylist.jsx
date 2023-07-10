import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddHairstylist() {

        
    const [data, setData] = useState({
		name: '',
		email: '',
        area: '',
        age: '',
        phone: '',
		salary: '',
		image: ''
	})
	const navigate = useNavigate()

	const handleSubmit = (event) => {
		event.preventDefault();
		const formdata = new FormData();
		formdata.append("name", data.name);
        formdata.append("email", data.email);
        formdata.append("area", data.area);
		formdata.append("age", data.age);
		formdata.append("phone", data.phone);
		formdata.append("salary", data.salary);
		formdata.append("image", data.image);
		axios.post('http://localhost:8088/createHairstylist', formdata)
		.then(res => {
			navigate('/hairstylist')
		})
		.catch(err => console.log(err));
	}

  return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Add Hairstylist</h2>
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
                    <label for="inputEmail4" class="form-label">Area</label>
                    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Area' autoComplete='off'
                        onChange={e => setData({ ...data, area: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputAge" class="form-label">Age</label>
                    <input type="number" class="form-control" id="inputAge" placeholder='Enter Age'
                        onChange={e => setData({ ...data, age: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Phone' autoComplete='off'
                        onChange={e => setData({ ...data, phone: e.target.value })} />
                </div>
                <div class="col-12">
                    <label for="inputEmail4" class="form-label">Salary</label>
                    <input type="decimal" class="form-control" id="inputEmail4" placeholder='Enter Salary' autoComplete='off'
                        onChange={e => setData({ ...data, salary: e.target.value })} />
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

export default AddHairstylist