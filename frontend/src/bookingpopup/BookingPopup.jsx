import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import './BookingPopup.css';
import { useNavigate } from "react-router-dom"



function BookingPopup({ booking, onClose }) {
  const [services, setServices] = useState([]);
  const [selectedHairType, setSelectedHairType] = useState('');
  const [selectedHairService, setSelectedHairService] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate()
  const [phone, setPhone] = useState('');

  function formatDate(dateString) {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const adjustedDate = new Date(date.getTime() - offset);
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

 

  useEffect(() => {
    // Fetch services from the database
    axios
      .get('http://localhost:8088/services')
      .then(response => {
        const servicesData = response.data.Result; // Adjust based on the actual response structure
        setServices(servicesData);
        setSelectedHairType(servicesData[0]?.type); // Set the initial selected hair type
        setSelectedHairService(servicesData[0]?.name); // Set the initial selected hair service
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, []);

  useEffect(() => {
    // Find the selected service and update the price
    const selectedService = services.find(
      service => service.type === selectedHairType && service.name === selectedHairService
    );
    if (selectedService) {
      setPrice(selectedService.price);
    }
  }, [selectedHairType, selectedHairService, services]);

  const getUniqueHairTypes = () => {
    // Extract unique hair types from services
    const uniqueHairTypes = [...new Set(services.map(service => service.type))];
    return uniqueHairTypes;
  };

  const getUniqueHairServices = () => {
    // Extract unique hair services based on the selected hair type
    const uniqueHairServices = services
      .filter(service => service.type === selectedHairType)
      .map(service => service.name);
    return uniqueHairServices;
  };

  function generateRandomId() {
    // Generate a random ID using a combination of a prefix and a random number
    const prefix = 'BOOKING';
    const randomNum = Math.floor(Math.random() * 1000000); // Change 1000000 to your desired range
    return `${prefix}-${randomNum}`;
  }
  const [successMessage, setSuccessMessage] = useState(false);

  const handleConfirmBooking = () => {
    // Create the booking object with all the required details
    const randomBookingId = generateRandomId();

    const completedBooking = {
      id: randomBookingId,
      username: '',
      name: booking.name,
      area: booking.area,
      phone: phone,
      hairstylist: booking.hairstylist,
      date: booking.date,
      time: booking.time,
      hairservice: selectedHairService,
      hairtype: selectedHairType,
      price: price,
      status: 'Unpaid',
      slotId: booking.id,
      // id: booking.id // Assuming the booking ID is available
    };
    // Make a GET request to retrieve the session username
    axios
      .get('http://localhost:8088/')
      .then(response => {
        const username = response.data.username;
        completedBooking.username = username;

        // Make a POST request to save the completed booking

        axios
          .post('http://localhost:8088/completedbooking', completedBooking)
          .then(response => {
            if (response.data.Status === 'Success') {
              // Handle the response if needed
              console.log('Booking confirmed:', response.data);
              setSuccessMessage(true);
              setTimeout(() => {
                navigate('/');
              }, 3000);
            }
          })
          .catch(error => {
            console.error('Error confirming booking:', error);
          });
      })
      .catch(error => {
        console.error('Error getting session username:', error);
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Call your confirm booking function here or directly include its code
    handleConfirmBooking();
  };


  return (
    <div className="bookingPopup">
      <button className="backButton" onClick={onClose}>
        <FiArrowLeft />
      </button>
      <h1>{booking.name}</h1>
      <div className="bookingInfo">
        <div>
          <p className="bookingLabel">Area:</p>
          <p className="bookingValue">{booking.area}</p>
        </div>
        <div>
          <p className="bookingLabel">Hairstylist:</p>
          <p className="bookingValue">{booking.hairstylist}</p>
        </div>
        <div>
          <p className="bookingLabel">Time:</p>
          <p className="bookingValue">{booking.time}</p>
        </div>
        <div>
          <p className="bookingLabel">Date:</p>
          <p className="bookingValue">{formatDate(booking.date)}</p>
        </div>
      </div>
      <form onSubmit={handleFormSubmit}>
      <div className="phoneContainer">
        <label htmlFor="phone">Phone Number:</label>
        <input
          type="text"
          id="phone"
          placeholder='Enter Phone Number'
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      <div className="comboContainer">
        <label htmlFor="hairType">Hair Type:</label>
        <select
          id="hairType"
          value={selectedHairType}
          onChange={event => setSelectedHairType(event.target.value)}
        >
          {getUniqueHairTypes().map(hairType => (
            <option key={hairType} value={hairType}>
              {hairType}
            </option>
          ))}
        </select>
      </div>

      <div className="comboContainer">
        <label htmlFor="hairService">Hair Service:</label>
        <select
          id="hairService"
          value={selectedHairService}
          onChange={event => setSelectedHairService(event.target.value)}
        >
          {getUniqueHairServices().map(hairService => (
            <option key={hairService} value={hairService}>
              {hairService}
            </option>
          ))}
        </select>
      </div>
        <div className="priceContainer">
          <p className="priceLabel">Price:</p>
          <p className="priceValue">{price}</p>
        </div>
        <div className="col-12 mb-3">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            Booking successfully! You will be redirected to the home page.
          </div>
        )}
        <button type="submit" className="confirmButton" >
          Confirm Booking
        </button>
      </div>
      </form>
    </div>
  );
}

export default BookingPopup;
