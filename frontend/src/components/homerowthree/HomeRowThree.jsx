import "./homerowthree.css"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function HomeRowThree() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8088/gethomethree')
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
        <div className="fp">
            {data.map((item, index) => (
                <div className="fpItem">
                    <img src={`http://localhost:8088/images/` + item.image} alt="" className="fpImg" />
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

export default HomeRowThree