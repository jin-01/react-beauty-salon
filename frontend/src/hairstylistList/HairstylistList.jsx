import React, { useEffect, useState } from 'react'
import "./hairstylistlist.css"
import Navbar from '../components/navbar/Navbar'
import Header from '../components/header/Header'
import Hairstylist from '../components/hairstylist/Hairstylist'
import axios from 'axios'

function HairstylistList() {

    const [data, setData] = useState([]);
    const [searchArea, setSearchArea] = useState("");
    const [areaList, setAreaList] = useState([]);


    const handleSearch = () => {
        axios
            .get(`http://localhost:8088/gethairstylistlist?area=${searchArea}`)
            .then((res) => {
                if (res.data.Status === "Success") {
                    setData(res.data.Result);
                } else {
                    alert("Error");
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        axios
          .get('http://localhost:8088/gethairstylistareas')
          .then((res) => {
            if (res.data.Status === "Success") {
              setAreaList(res.data.Result);
            } else {
              alert("Error");
            }
          })
          .catch((err) => console.log(err));
      }, []);
      


    return (
        <div>
            <Navbar />
            <Header type="list" />
            <div className="listContainer">
                <div className="listWrapper">
                    <div className="listSearch">
                        <h1 className="lsTitle">Search</h1>
                        <div className="lsItem">
                            <select
                                value={searchArea}
                                onChange={(e) => setSearchArea(e.target.value)}
                            >
                                <option value="">Select an area</option>
                                {areaList.map((area) => (
                                    <option value={area} key={area}>
                                        {area}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <button onClick={handleSearch}>Search</button>

                    </div>
                    <div className="listResult">
                        <Hairstylist data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HairstylistList;
