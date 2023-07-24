import React, {useState} from 'react';
import './branch.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';


function Branch({ data }) {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState([]);
  const [noReviewMessage, setNoReviewMessage] = useState('');

  const handleNavigation = (url) => {
    window.open(url, '_blank');
  };

  const handleViewReview = async (branchName, branchArea) => {
    try {
      const response = await axios.get('http://localhost:8088/getreview', {
        params: {
          bname: branchName,
          barea: branchArea,
        },
      });
  
      if (response.data.Status === 'Success') {
        setPopupContent(response.data.Result || []); // Ensure popupContent is an array
        setNoReviewMessage('');
        setShowPopup(true);
      } else if(response.data.Status === 'No review') {
        // In case of 404 Not Found, display "Not rating yet"
        setPopupContent([]);
        setNoReviewMessage('No rating yet for this branch.');
        setShowPopup(true);
      }
    } catch (error) {
      // Handle other errors, if any
      console.log('Error fetching review:', error);
    }
  };


  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupContent([]);
    setNoReviewMessage('');
  };



  return (
    <div>
      {data.map((branch) => (
        <div className="searchItem" key={branch.id}>
          <img
            src={`http://localhost:8088/images/` + branch.image}
            alt=""
            className="siImg"
          />
          <div className="siDesc">
            <h1 className="siTitle">{branch.name}</h1>
            <span className="siArea">{branch.area}</span>
            <span className="sibdesc">{branch.bdesc}</span>
          </div>
          <div className="siDetails">
            <div className="siRating">
              <span>{branch.ratingdesc}</span>
              <button>{branch.rating}</button>
            </div>
            <div className="siDetailTexts">
              <button
                className="siCheckButton btn-danger"
                onClick={() => handleNavigation(branch.url)}
              >
                <FaMapMarkerAlt /> Google Map
              </button>
              <button
            className="siCheckButton"
            onClick={() => handleViewReview(branch.name, branch.area)}
          >
            View Review
          </button>
            </div>
          </div>
        </div>
      ))}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <h3>Review</h3>
            {noReviewMessage ? (
              <p>{noReviewMessage}</p>
            ) : (
              popupContent.map((review, index) => (
                <div key={index}>
                  <p>{review.rdesc}</p>
                  <hr />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Branch;
