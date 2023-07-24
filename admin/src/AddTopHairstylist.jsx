import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AddTopHairstylist() {
    const [data, setData] = useState({
        name: '',
        bname: '',
        area: '',
        image: ''
      })

    const [hairstylistNames, setHairstylistNames] = useState([]);
    const [selectName, setSelectName] = useState(false);
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append("name", data.name);
        formdata.append("bname", data.bname);
        formdata.append("area", data.area);
        formdata.append("image", data.image);
        axios.post('http://localhost:8088/addtophairstylist', formdata)
          .then(res => {
            setSuccessMessage(true);
            setTimeout(() => {
              navigate('/tophairstylist')
            }, 2000); 
            
          })
          .catch(err => console.log(err));
      }
    

    useEffect(() => {
        // Fetch branch names
        const fetchHAirstylistNames = async () => {
          try {
            const response = await axios.get('http://localhost:8088/hairstylistname');
            setHairstylistNames(response.data);
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchHAirstylistNames();
      }, []);
    
      const handleNameSelect = (selectedName) => {
        if (selectedName === '') {
          setSelectName(false);
          setData({ ...data, name: '', bname: '', area: ''  });
        } else {
          const selectedHairstylist = hairstylistNames.find(
            (hairstylist) => hairstylist.name === selectedName
          );
          setSelectName(true);
          setData({ ...data, name: selectedName, bname: selectedHairstylist.bname, area: selectedHairstylist.area });
        }
      };
    
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Add Top Hairstylist</h2>
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
            {hairstylistNames.map((hairtylist) => (
              <option key={hairtylist.name} value={hairtylist.name}>
                {hairtylist.name}
              </option>
            ))}
          </select>
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Branch Name</label>
          <input type="text" class="form-control" id="inputArea" placeholder='Enter Branch Name' autoComplete='off' value={data.bname}
            onChange={e => setData({ ...data, bname: e.target.value })} />
        </div>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">Area</label>
          <input type="text" class="form-control" id="inputArea" placeholder='Enter Area' autoComplete='off' value={data.area}
            onChange={e => setData({ ...data, area: e.target.value })} />
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
</div>
  )
}

export default AddTopHairstylist