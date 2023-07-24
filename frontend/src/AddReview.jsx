import React, { useState } from 'react';
import axios from 'axios';
import './addreview.css'
import 'animate.css/animate.min.css';
import { useLocation, useNavigate } from 'react-router-dom';

function AddReview( ) {
    const location = useLocation();
    const booking = location.state.booking;
const navigate = useNavigate()

    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');

    const handleRatingChange = (e) => {
        setRating(parseInt(e.target.value));
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const reviewData = {
            username: booking.username,
            bname: booking.name,
            barea: booking.area,
            rating: rating,
            rdesc: description,
            pid: booking.id
        };

        axios
            .post('http://localhost:8088/addreview', reviewData) // Adjust the endpoint URL based on your server's API
            .then((res) => {
                // Handle the response after saving the review data
                if (res.data.Status === 'Success') {
                    // Data saved successfully, perform any necessary actions (e.g., redirecting)
                    alert('Review saved successfully');
                    navigate('/')
              
                   
                    // Redirect the user to the booking history page or perform any other desired action
                } else {
                    // Handle the error scenario
                    alert('Error saving review');
                }
            })
            .catch((err) => {
                // Handle any error that occurred during the HTTP request
                console.log(err);
                alert('Error saving review');
            });
    };

    return (
        <div className="container">
            <div className="review-section animate__animated animate__fadeIn"> {/* Add animation class */}
                <h1 className="animate__animated animate__bounceIn">Add Review</h1> {/* Add animation class */}
                <div className="review-box animate__animated animate__fadeInUp"> {/* Add animation class */}
                    <h2>{booking.name}</h2>
                    <h3>{booking.area}</h3>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="form-group">
                            <label htmlFor="rating">Rating (1-10):</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                className="form-control"
                                id="rating"
                                value={rating}
                                onChange={handleRatingChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                value={description}
                                onChange={handleDescriptionChange}
                                style={{ marginBottom: '10px' }} // Add margin bottom to create space
                            />
                        </div>

                        <div className="d-flex justify-content-center"> 
                            <button type="submit" className="btn btn-primary">Submit Rating</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddReview