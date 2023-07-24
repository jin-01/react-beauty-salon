import React, { useState } from 'react';
import Map from './Map';


function ShopMap() {
    const [showMap, setShowMap] = useState(false);
    const shopAddress = {
      lat: 37.7749,
      lng: -122.4194,
    };
  
    const handleClick = () => {
      setShowMap(true);
    };
  
    const handleNavigation = () => {
      const url = `https://www.google.com/maps/place/Hair+Atelier+Danau+Desa+-+Aveda+Salon/@3.099364,101.6865251,17z/data=!3m1!4b1!4m6!3m5!1s0x31cc4a1650b164ef:0xa1b48647d4b50b21!8m2!3d3.099364!4d101.6865251!16s%2Fg%2F11bbrkgbpk?hl=en-MY&entry=ttu`;
      window.open(url, '_blank');
    };
  
    return (
      <div>
        <button onClick={handleClick}>Show Map</button>
        {showMap && (
          <>
            <Map shopAddress={shopAddress} />
            <button onClick={handleNavigation}>Navigate to Shop</button>
          </>
        )}
      </div>
    );
 
}

export default ShopMap