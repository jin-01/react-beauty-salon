import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import './BookingPopup.css';
import { useNavigate} from "react-router-dom"

function BookingPopup({ booking, onClose }) {
  const [services, setServices] = useState([]);
  const [selectedHairType, setSelectedHairType] = useState('');
  const [selectedHairService, setSelectedHairService] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate()

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

  const handleConfirmBooking = () => {
    // Create the booking object with all the required details
    const completedBooking = {
      username: '',
      name: booking.name,
      area: booking.area,
      hairstylist: booking.hairstylist,
      time: booking.time,
      hairservice: selectedHairService,
      hairtype: selectedHairType,
      price: price,
      id: booking.id // Assuming the booking ID is available
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
            // Handle the response if needed
            console.log('Booking confirmed:', response.data);
            navigate('/'); // Navigate to the home page or desired page
          })
          .catch(error => {
            console.error('Error confirming booking:', error);
          });
      })
      .catch(error => {
        console.error('Error getting session username:', error);
      });
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

      <button className="confirmButton" onClick={handleConfirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
}

export default BookingPopup;
