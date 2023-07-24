import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AddTopBranch() {
    const [data, setData] = useState({
        name: '',
        area: '',
        image: '',
        rating: '',
        ratingdesc: ''
      })

    const [branchNames, setBranchNames] = useState([]);
    const [selectName, setSelectName] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("area", data.area);
        formdata.append("image", data.image);
        formdata.append("rating", data.rating);
        formdata.append("ratingdesc", data.ratingdesc);
        axios.post('http://localhost:8088/addtopbranch', formdata)
          .then(res => {
            navigate('/topbranch')
          })
          .catch(err => console.log(err));
      }
    

    useEffect(() => {
        // Fetch branch names
        const fetchBranchNames = async () => {
          try {
            const response = await axios.get('http://localhost:8088/branchesname');
            setBranchNames(response.data);
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchBranchNames();
      }, []);
    
      const handleNameSelect = (selectedName) => {
        if (selectedName === '') {
          setSelectName(false);
          setData({ ...data, name: '', area: '', rating: '', ratingdesc: ''  });
        } else {
          const selectedBranch = branchNames.find(
            (branch) => branch.name === selectedName
          );
          setSelectName(true);
          setData({ ...data, name: selectedName, area: selectedBranch.area, rating: selectedBranch.rating, ratingdesc: selectedBranch.ratingdesc });
        }
      };
    
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Add Booking</h2>
      <form class="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <select
            className="form-select"
            id="inputName"
            value={data.name}
            onChange={(e) => handleNameSelect(e.target.value)}
          >
            <option value="" disabled={!selectName}>
              Select a name
            </option>
            {branchNames.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Area</label>
          <input type="text" class="form-control" id="inputArea" placeholder='Enter Area' autoComplete='off' value={data.area}
            onChange={e => setData({ ...data, area: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Rating</label>
          <input type="text" class="form-control" id="inputArea" placeholder='Enter Rating' autoComplete='off' value={data.rating}
            onChange={e => setData({ ...data, rating: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Rating Desc</label>
          <input type="text" class="form-control" id="inputArea" placeholder='Enter Rating desc' autoComplete='off' value={data.ratingdesc}
            onChange={e => setData({ ...data, ratingdesc: e.target.value })} />
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

export default AddTopBranch