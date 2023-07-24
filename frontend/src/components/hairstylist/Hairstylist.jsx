import "./hairstylist.css"
import React from 'react'


function Hairstylist({data}) {

  return (
    <div>
    {data.map((hairstylist) => (

      <div className="searchItem" key={hairstylist.id}>
        <img src={`http://localhost:8088/images/` + hairstylist.image} alt="" className="siImg" />
        <div className="siDesc">
          <h1 className="siTitle">{hairstylist.name}</h1>
          <span className="siArea">{hairstylist.area}</span>
          <span className="desc">Experience: {hairstylist.hdesc}</span>
        </div>
      </div>
    ))}
  </div>
  )
}

export default Hairstylist