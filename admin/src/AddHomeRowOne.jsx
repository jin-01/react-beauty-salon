import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddHomeRowOne() {

    const [data, setData] = useState({
		area: '',
		image: ''
	})
	const navigate = useNavigate()

	const handleSubmit = (event) => {
		event.preventDefault();
		const formdata = new FormData();
		formdata.append("area", data.area);
		formdata.append("image", data.image);
		axios.post('http://localhost:8088/addhomeone', formdata)
		.then(res => {
			navigate('/homeone')
		})
		.catch(err => console.log(err));
	}

    return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Add Home Row One</h2>
            <form class="row g-3 w-50" onSubmit={handleSubmit}>
                <div class="col-12">
                    <label for="inputName" class="form-label">Area</label>
                    <input type="text" class="form-control" id="inputName" placeholder='Enter Area' autoComplete='off'
                        onChange={e => setData({ ...data, area: e.target.value })} />
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

export default AddHomeRowOne