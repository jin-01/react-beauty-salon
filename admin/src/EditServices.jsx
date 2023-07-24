import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditServices() {
    const [data, setData] = useState({
        name: '',
        type: '',
        price: '', 
      });
      const navigate = useNavigate();
      const { id } = useParams();
      const [successMessage, setSuccessMessage] = useState(false);
    
      useEffect(() => {
        axios
          .get('http://localhost:8088/getServices/' + id)
          .then(res => {
            setData({
              ...data,
              name: res.data.Result[0].name,
              type: res.data.Result[0].type,
              price: res.data.Result[0].price,

            });
          })
          .catch(err => console.log(err));
      }, [id]);
    
    
      const handleSubmit = event => {
        event.preventDefault();
    
        axios
          .put('http://localhost:8088/updateservices/' + id, data)
          .then(res => {
            if (res.data.Status === 'Success') {
              setSuccessMessage(true);
              setTimeout(() => {
                navigate('/getservices');
              }, 1500);
              
            }
          })
          .catch(err => console.log(err));
      };

      const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };
    
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
    <h2>Update Services</h2>
    <form className="row g-3 w-50" onSubmit={handleSubmit}>
          <div className="col-12">
              <label htmlFor="inputName" className="form-label">
                  Hair Service
              </label>
              <input
                  type="text"
                  className="form-control"
                  id="inputName"
                  name="name"
                  placeholder="Enter Hair Service"
                  autoComplete="off"
                  value={data.name}
                  onChange={handleChange}
                  readOnly
              />
          </div>
          <div className="col-12">
              <label htmlFor="inputName" className="form-label">
                  Hair Type
              </label>
              <input
                  type="text"
                  className="form-control"
                  id="inputType"
                  name="type"
                  placeholder="Enter Hair Type"
                  autoComplete="off"
                  value={data.type}
                  onChange={handleChange}
                  readOnly
              />
          </div>
          <div className="col-12">
              <label htmlFor="inputPrice" className="form-label">
                  Price
              </label>
              <input
                  type="text"
                  className="form-control"
                  id="inputPrice"
                  name="price"
                  placeholder="Enter Voucher Price"
                  autoComplete="off"
                  value={data.price}
                  onChange={handleChange}
              />
          </div>
          <div className="col-12">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              Update Successfully!
            </div>
          )}
        </div>
      <div className='col-12'>
        <button type='submit' className='btn btn-primary'>
          Update
        </button>
      </div>
    </form>
  </div>
  )
}

export default EditServices