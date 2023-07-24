import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


function EditVoucher() {
    const [data, setData] = useState({
        vpoint: '',
        name: '',
        vdesc: '',
        price: '', 
      });
      const navigate = useNavigate();
      const { id } = useParams();
      const [successMessage, setSuccessMessage] = useState(false);
    
      useEffect(() => {
        axios
          .get('http://localhost:8088/getvoucher/' + id)
          .then(res => {
            setData({
              ...data,
              vpoint: res.data.Result[0].vpoint,
              name: res.data.Result[0].name,
              vdesc: res.data.Result[0].vdesc,
              price: res.data.Result[0].price,

            });
          })
          .catch(err => console.log(err));
      }, [id]);
    
    
      const handleSubmit = event => {
        event.preventDefault();
    
        axios
          .put('http://localhost:8088/editvoucher/' + id, data)
          .then(res => {
            if (res.data.Status === 'Success') {
              setSuccessMessage(true);
              setTimeout(() => {
                navigate('/voucher');
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
          <h2>Update Voucher</h2>
          <form className="row g-3 w-50" onSubmit={handleSubmit}>
          <div className="col-12">
                    <label htmlFor="inputType" className="form-label">
                        Voucher Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputType"
                        name="name"
                        placeholder="Enter Voucher Name"
                        autoComplete="off"
                        value={data.name}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputName" className="form-label">
                        Voucher Point
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="inputName"
                        name="vpoint"
                        placeholder="Enter Voucher Point"
                        autoComplete="off"
                        value={data.vpoint}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputPrice" className="form-label">
                        Voucher Description
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputPrice"
                        name="vdesc"
                        placeholder="Enter Voucher Description"
                        autoComplete="off"
                        value={data.vdesc}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="inputPrice" className="form-label">
                        Price
                    </label>
                    <input
                        type="number"
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

export default EditVoucher