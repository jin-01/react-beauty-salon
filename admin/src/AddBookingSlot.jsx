import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


function AddBookingSlot() {
  const [data, setData] = useState({
    name: '',
    area: '',
    hairstylist: '',
    date: '',
    time: '',
    sdesc: '',
    cancel: '',
    ratingdesc: '',
    rating: '',
    image: ''
  })
  const navigate = useNavigate()
  const [hairstylistNames, setHairstylistNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [selectName, setSelectName] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("area", data.area);
    formdata.append("hairstylist", data.hairstylist);
    formdata.append("date", data.date);
    formdata.append("time", data.time);
    formdata.append("sdesc", data.sdesc);
    formdata.append("cancel", data.cancel);
    formdata.append("ratingdesc", data.ratingdesc);
    formdata.append("rating", data.rating);
    formdata.append("image", data.image);
    axios.post('http://localhost:8088/addbooking', formdata)
      .then(res => {
        setSuccessMessage(true);
        setTimeout(() => {
          navigate('/bookingslot')
        }, 2000); 
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

  useEffect(() => {
    
    // Fetch hairstylist names based on the input area
    const fetchHairstylistNames = async (area, bname) => {
      try {
        if (area && bname) {
          const response = await axios.get(`http://localhost:8088/hairstylists?area=${area}&bname=${bname}`);
          setHairstylistNames(response.data);
        } else {
          setHairstylistNames([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchHairstylistNames(data.area, data.name);
  }, [data.area, data.name]);


  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Add Booking</h2>
      <form class="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputName" className="form-label">
           Branch Name
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
          <input type="text" class="form-control" id="inputArea" placeholder='Enter Area' autoComplete='off' value={data.area} readOnly
            onChange={e => setData({ ...data, area: e.target.value })} />
        </div>
        <div className="col-12">
          <label htmlFor="hairstylistSelect" className="form-label">Hairstylist</label>
          <select
            id="hairstylistSelect"
            className="form-select"
            value={data.hairstylist}
            onChange={e => setData({ ...data, hairstylist: e.target.value })}
          >
            <option value="">Select a hairstylist</option>
            {hairstylistNames.map(hairstylistName => (
              <option key={hairstylistName} value={hairstylistName}>
                {hairstylistName}
              </option>
            ))}
          </select>
        </div>
        <div class="col-12">
          <label for="inputPassword4" class="form-label">Date</label>
          <input type="date" class="form-control" id="inputTime"
            onChange={e => setData({ ...data, date: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputPassword4" class="form-label">Time</label>
          <input type="time" class="form-control" id="inputTime"
            onChange={e => setData({ ...data, time: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputPassword4" class="form-label">Booking Description</label>
          <input type="text" class="form-control" id="inputTime" placeholder='Enter Description'
            onChange={e => setData({ ...data, sdesc: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputPassword4" class="form-label">Cancel Description</label>
          <input type="text" class="form-control" id="inputTime" placeholder='Enter Cancel Option'
            onChange={e => setData({ ...data, cancel: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputPassword4" class="form-label">Rating Description</label>
          <input type="text" class="form-control" id="inputTime" placeholder='Enter Rating Description' value={data.ratingdesc} readOnly
            onChange={e => setData({ ...data, ratingdesc: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputPassword4" class="form-label">Rating</label>
          <input type="text" class="form-control" id="inputTime" placeholder='Enter Rating' value={data.rating} readOnly
            onChange={e => setData({ ...data, rating: e.target.value })} />
        </div>
        <div class="col-12">
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
      <br/>
    </div>
  )
}

export default AddBookingSlot