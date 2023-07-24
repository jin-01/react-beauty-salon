import axios from 'axios';
import './branchlist.css'
import Navbar from '../components/navbar/Navbar';
import Header from '../components/header/Header';
import Branch from '../branch/Branch';
import React, { useEffect, useState } from 'react'


function BranchList() {
    const [data, setData] = useState([]);
    const [searchArea, setSearchArea] = useState("");
    const [areaList, setAreaList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {
        axios
            .get('http://localhost:8088/getbranchlist')
            .then((res) => {
                if (res.data.Status === "Success") {
                    setData(res.data.Result);
                } else {
                    alert("Error");
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleSearch = () => {
        const filteredBranch = data.filter(
            (branch) => branch.area === searchArea
        );
        setFilteredData(filteredBranch);
    };

    useEffect(() => {
        axios
            .get('http://localhost:8088/getbranchareas')
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
                        <Branch data={filteredData.length > 0 ? filteredData : data} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BranchList