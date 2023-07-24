import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddVoucher() {
    const [data, setData] = useState({
        vpoint: '',
        name: '',
        vdesc: '',
        price: '',
    })
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8088/addvoucher', data);
            if (response.data.Status === 'Success') {
                console.log(response.data);
                setSuccessMessage(true);
                setTimeout(() => {
                    navigate('/voucher');
                }, 2000);
            } else if (response.data.Error === 'Name already taken') {
                setErrorMessage("Name already taken! Please choose another");
                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="d-flex flex-column align-items-center pt-4">
            <h2>Add Voucher</h2>
            <form className="row g-3 w-50" onSubmit={handleSubmit}>
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
                        onChange={handleChange}
                    />
                </div>
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
                        onChange={handleChange}
                    />
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
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddVoucher