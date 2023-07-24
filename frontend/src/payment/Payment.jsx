import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Header from '../components/header/Header';
import StripeCheckout from 'react-stripe-checkout';



function Payment() {
    const [data, setData] = useState([]);
    const [additionalCharge, setAdditionalCharge] = useState(0);
    const [voucher, setVoucher] = useState('');
    const [vouchers, setVouchers] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate()
    const [successMessage, setSuccessMessaage] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:8088/getcompletedbooking/${id}`)
            .then((res) => {
                if (res.data.status === 'Success') {
                    setData(res.data.result);
                } else {
                    alert('Error');
                }
            })
            .catch((err) => console.log(err));
    }, [id]);

    useEffect(() => {
        axios
            .get('http://localhost:8088/getvouchers') // Replace with your voucher API endpoint
            .then((res) => {
                if (res.data.status === 'Success') {
                    setVouchers(res.data.vouchers);
                } else {
                    alert('Error');
                }
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        // Calculate total price when data, additionalCharge, or voucher changes
        const calculateTotalPrice = () => {
            let total = data.reduce((acc, booking) => acc + booking.price, 0);
            total += additionalCharge;

            if (voucher) {
                const selectedVoucher = vouchers.find((v) => v.name === voucher);
                if (selectedVoucher) {
                    total -= selectedVoucher.price;
                }
            }

            setTotalPrice(total);
        };

        calculateTotalPrice();
    }, [data, additionalCharge, voucher, vouchers]);

    const handleAdditionalChargeChange = (event) => {
        setAdditionalCharge(Number(event.target.value));
    };

    const handleVoucherChange = (event) => {
        setVoucher(event.target.value);
    };


    const handlePaymentSubmit = async (token) => {




        const paymentData = {
            username: '', // Set the username to the appropriate value
            id: id,
            bid: data[0].id,
            name: data[0].name,
            area: data[0].area,
            hairstylist: data[0].hairstylist,
            date: data[0].date,
            time: data[0].time,
            hairservice: data[0].hairservice,
            price: totalPrice,
            token: token.id, // Pass the token received from Stripe to your server for processing the payment
        };

        // Send a POST request to update the voucher status
        if (voucher) {
            const selectedVoucher = vouchers.find((v) => v.name === voucher);
            if (selectedVoucher) {
                const updateData = {
                    voucherId: selectedVoucher.id,
                };

                axios
                    .post('http://localhost:8088/updatevoucherstatus', updateData)
                    .then((updateRes) => {
                        if (updateRes.data.status === 'Success') {
                            // Send a POST request to insert the payment data
                            axios
                                .post('http://localhost:8088/insertpayment', paymentData)

                                .then((insertRes) => {
                                    if (insertRes.data.Status === 'Success') {
                                        setSuccessMessage(true);
                                        setTimeout(() => {
                                            navigate('/');
                                        }, 2000); 
                                    }
                                    console.log('Payment submitted');
                                })
                                .catch((insertErr) => {
                                    console.log(insertErr);
                                    // Handle error
                                });
                        }
                    })
                    .catch((updateErr) => {
                        console.log(updateErr);
                        // Handle error
                    });
            }
        } else {
            // Send a POST request to insert the payment data without updating the voucher status
            axios
                .post('http://localhost:8088/insertpayment', paymentData)
                .then((insertRes) => {
                    if (insertRes.data.Status === 'Success') {
                        setSuccessMessaage(true);
                        setTimeout(() => {
                            navigate('/');
                        }, 2000); 
                    }
                    console.log('Payment submitted');
                })
                .catch((insertErr) => {
                    console.log(insertErr);
                    // Handle error
                });
        }
    }


    const onToken = (token) => {
        // Call handlePaymentSubmit with the token received from Stripe
        handlePaymentSubmit(token);
    };

    const handleCancelPayment = () => {
        navigate('/mybooking'); // Assuming you have a route for the registration page with the path '/register'
    };
    // const stripeCheckoutButton = (

    //   );


    return (
        <div>
            <Navbar />
            <Header type="list" />
            <div className="container my-5">
                <h1 className="text-center mb-4">Payment</h1>
                <div className="my-booking-page">
                    {data.length > 0 ? (
                        <div className="row justify-content-center">
                            {data.map((payment) => (
                                <div className="col-lg-4 col-md-6 col-sm-12" key={payment.id}>
                                    <div className="card h-100 shadow-lg booking-card">
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <h5 className="card-title">{payment.id}</h5>
                                                <h5 className="card-title">{payment.name}</h5>
                                                <p className="card-text">Area: {payment.area}</p>
                                                <p className="card-text mb-1">Hairstylist: {payment.hairstylist}</p>
                                                <p className="card-text mb-1">Date: {payment.date}</p>
                                                <p className="card-text">Time: {payment.time}</p>
                                                <p className="card-text">Hair Service: {payment.hairservice}</p>
                                                <p className="card-text">Price: {payment.price}</p>
                                            </div>
                                            <hr />
                                            <div>
                                                <form onSubmit={handlePaymentSubmit}>
                                                    <div className="mb-3">
                                                        <label htmlFor="additionalCharge" className="form-label">
                                                            Additional Charge
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="1"
                                                            className="form-control"
                                                            id="additionalCharge"
                                                            value={additionalCharge}
                                                            onChange={handleAdditionalChargeChange}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="voucher" className="form-label">
                                                            Voucher
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            id="voucher"
                                                            value={voucher}
                                                            onChange={handleVoucherChange}
                                                        >
                                                            <option value="">Select voucher</option>
                                                            {vouchers.map((v) => (
                                                                <option key={v.id} value={v.name}>
                                                                    {v.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="totalPrice" className="form-label">
                                                            Total Price
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="totalPrice"
                                                            value={totalPrice}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <StripeCheckout
                                                        token={onToken}
                                                        stripeKey='pk_test_51NXK3oIR2MPDrlD4fuQEEMUEO8ymMgYwVQxdabDvgsgYIxNfezrMevJyuXVf3TBEpyvwVF9SCX6a9ZC24NEQ4vCi00w0XalcFM'
                                                        name="Payment"
                                                        amount={totalPrice * 100} // Stripe requires the amount in cents
                                                        description="Hair Salon Booking"
                                                        currency="MYR"
                                                        allowRememberMe={false}
                                                        zipCode={true}
                                                        email="" // Set the customer's email here if available
                                                        billingAddress={false}
                                                        shippingAddress={false}
                                                        panelLabel="Make Payment"
                                                        locale="auto"
                                                        opened={() => {
                                                            console.log('Payment window opened');
                                                        }}
                                                        closed={() => {
                                                            console.log('Payment window closed');
                                                        }}
                                                    >

                                                        <div className="col-12 mb-3">
                                                            {successMessage && (
                                                                <div className="alert alert-success" role="alert">
                                                                    Payment successfully! You will be redirected to the home page.
                                                                </div>
                                                            )}
                                                            <div className="d-grid gap-2">
                                                                <button type="button" className="btn btn-primary">
                                                                    Make Payment
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </StripeCheckout>

                                                </form>
                                                <button className="btn btn-danger w-100 mt-2" onClick={handleCancelPayment}>
                                                    Cancel Payment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    ) : (
                        <p className="text-center">No Payment found.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Payment;
