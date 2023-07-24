import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddBranch() {
  const [data, setData] = useState({
    name: '',
    area: '',
    bdesc: '',
    url: '',
    image: ''
  })
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("area", data.area);
    formdata.append("bdesc", data.bdesc);
    formdata.append("url", data.url);
    formdata.append("image", data.image);
    formdata.append("rating", "");
    formdata.append("ratingdesc", "");
    axios.post('http://localhost:8088/addbranch', formdata)
      .then((response) => {
        if (response.data.Status === 'Success') {
          setSuccessMessage(true);
          setTimeout(() => {
            navigate('/getbranch');
          }, 3000); // Redirect to login page after 3 seconds
        } else if (response.data.Error === 'Name already taken') {
          setErrorMessage("Branch Name already taken! Please choose another");
          setTimeout(() => {
            setErrorMessage('');
          }, 2000);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Add Branch</h2>
      <form class="row g-3 w-50" onSubmit={handleSubmit}>
        <div class="col-12">
          <label for="inputName" class="form-label">Branch Name</label>
          <input type="text" class="form-control" id="inputName" placeholder='Enter Branch Name' autoComplete='off' required
            onChange={e => setData({ ...data, name: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Area</label>
          <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Area' autoComplete='off' required
            onChange={e => setData({ ...data, area: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Branch Description</label>
          <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Branch Description' autoComplete='off' required
            onChange={e => setData({ ...data, bdesc: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Google Map Url</label>
          <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Google Map Url' autoComplete='off' required
            onChange={e => setData({ ...data, url: e.target.value })} />
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

export default AddBranch
