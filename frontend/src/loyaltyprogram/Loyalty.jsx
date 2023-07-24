import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Header from '../components/header/Header';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './loyalty.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Loyalty() {
  const [data, setData] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [error, setError] = useState('');


  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  
  useEffect(() => {
    axios
      .get('http://localhost:8088/')
      .then((res) => {
        if (res.data.valid ) {
          navigate('/loyalty')
        } else {
          navigate('/login')
        }
      })
      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get('http://localhost:8088/getvoucher')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        } else {
          setError('Error retrieving vouchers');
        }
      })
      .catch((err) => {
        setError('Error retrieving vouchers');
        console.log(err);
      });

    axios
      .get('http://localhost:8088/gettotalpoints')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setTotalPoints(res.data.Result.total_points);
        } else {
          setError('Error retrieving total points');
        }
      })
      .catch((err) => {
        setError('Error retrieving total points');
        console.log(err);
      });
  };

  const redeemVoucher = (voucher) => {
    if (totalPoints >= voucher.vpoint) {
      axios
        .post('http://localhost:8088/redeemvoucher', { vpoint: voucher.vpoint })
        .then((res) => {
          if (res.data.Status === 'Success') {
            const newPoints = res.data.Result.points;
            setTotalPoints(newPoints);
            fetchData(); // Update voucher data after successful redemption
            const redeemedVoucherData = {
                username: '', // Assuming the username is stored in the session
                name: voucher.name,
                vdesc: voucher.vdesc,
                price: voucher.price
              };
    
              axios
                .post('http://localhost:8088/addredeemedvoucher', redeemedVoucherData)
                .then((res) => {
                  if (res.data.Status === 'Success') {
                    console.log('Voucher redeemed successfully');
                  } else {
                    setError(res.data.Error);
                  }
                })
                .catch((err) => {
                  setError('Error redeeming voucher');
                  console.log(err);
                });
            } else {
              setError(res.data.Error);
            }
          })
          .catch((err) => {
            setError('Error redeeming voucher');
            console.log(err);
          });
      } else {
        setError('Insufficient points');
      }
    };
  
  

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="loyalty-page">
        <div className="container my-5">
          <h1 className="text-center mb-4">Loyalty Program</h1>
          <div className="loyalty-points">
            <h4 className="text-center mt-5">Total Points: {totalPoints}</h4>
          </div>
          <div className="loyalty-container row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <TransitionGroup component={null}>
              {data.map((voucher, index) => (
                <CSSTransition key={index} classNames="card-animation" timeout={300}>
                  <div className="col" key={voucher.id}>
                    <div className="card h-100 shadow booking-card">
                      <div className="card-body">
                        <h5 className="card-title">{voucher.name}</h5>
                        <p className="card-text">{voucher.vdesc}</p>
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-danger"
                            disabled={totalPoints < voucher.vpoint}
                            onClick={() => redeemVoucher(voucher)}
                          >
                            Redeem Voucher
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
          {error && <p className="text-center text-danger mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Loyalty;
