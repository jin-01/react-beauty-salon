import "./topbranch.css"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"


function TopBranch() {
    const [data, setData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8088/gettopbranch')
            .then(res => {
                if (res.data.Status === "Success") {
                    setData(res.data.Result);
                } else {
                    alert("Error")
                }
            })
            .catch(err => console.log(err));
    }, [])

    const handleImageClick = (area) => {
        navigate("/bookingslot", { state: { searchArea: area, date: new Date() } })
      };
    return (
        <div className="fp">
            {data.map((item, index) => (
                    <div className="fpItem" key={item.id}>
          <div onClick={() => handleImageClick(item.area)}>
            <img src={`http://localhost:8088/images/` + item.image} alt="" className="fpImg" />
          </div>
                        {/* <img src={`http://localhost:8088/images/` + item.image} alt="" className="fpImg" /> */}
                        <span className="fpName">{item.name}</span>
                        <span className="fpCity">{item.area}</span>
                        <div className="fpRating">
                            <button>{item.rating}</button>
                            <span>{item.ratingdesc}</span>
                        </div>
                    </div>

            ))}
        </div>
    )
}

export default TopBranch