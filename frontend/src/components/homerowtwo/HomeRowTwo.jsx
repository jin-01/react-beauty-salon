import "./homerowtwo.css"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function HomeRowTwo() {
    const [data, setData] = useState([])

    useEffect(() => {
      axios.get('http://localhost:8088/gethometwo')
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
        <div className="pList">
            {data.map((item, index) => (
                <div className="pListItem">
                    <img src={`http://localhost:8088/images/` + item.image} alt="" className="pListImg" />
                    <div className="pListTitles">
                        <h1>{item.name}</h1>
                        <h2>{item.area}</h2>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default HomeRowTwo