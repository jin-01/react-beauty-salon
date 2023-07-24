import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddSlideShow() {

    const [data, setData] = useState({
		image: ''
	})
	const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		const formdata = new FormData();
		formdata.append("image", data.image);
		axios.post('http://localhost:8088/addslideshow', formdata)
		.then(res => {
            setSuccessMessage(true);
            setTimeout(() => {
                navigate('/slideshow')
            }, 2000); 
			
		})
		.catch(err => console.log(err));
	}

    return (
        <div className='d-flex flex-column align-items-center pt-4'>
            <h2>Add SlideShow</h2>
            <form class="row g-3 w-50" onSubmit={handleSubmit}>
                <div class="col-12 mb-3">
                    <label class="form-label" for="inputGroupFile01">Select Image</label>
                    <input type="file" class="form-control" id="inputGroupFile01"
                        onChange={e => setData({ ...data, image: e.target.files[0] })} />
                </div>
                <div className="col-12">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              Add Successfully!
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

export default AddSlideShow