import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hairservice.css'; // Create a CSS file for custom styling
import Header from '../components/header/Header';
import Navbar from '../components/navbar/Navbar';


function HairService() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8088/getServices')
      .then(res => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Navbar/>
      <Header type="list" />
    <div className="hair-service-container">
      <div className="hair-service-header text-center">
        <h2>Salon GO Hair Services</h2>
      </div>
      <div className="hair-service-table-container">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Hair Service</th>
              <th>Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((serviceData, index) => (
              <tr key={index}>
                <td>{serviceData.name}</td>
                <td>{serviceData.type}</td>
                <td>RM {serviceData.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default HairService;
