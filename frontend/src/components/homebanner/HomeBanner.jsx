import "./homebanner.css"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function HomeBanner() {
    const [data, setData] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8088/gethomebanner')
        .then(res => {
          if (res.data.Status === "Success") {
            setData(res.data.Result);
          } else {
            alert("Error")
          }
        })
        .catch(err => console.log(err));
    }, [])

    return (
        
        <div className="featured">
        {data.map((item, index) => (
          <div className="featuredItem" key={index}>
            <img src={`http://localhost:8088/images/` + item.image} alt="" className="featuredImg" />
            <div className="featuredTitles">
              <h1>{item.area}</h1>

            </div>
          </div>
        ))}
      </div>
  )
}

export default HomeBanner