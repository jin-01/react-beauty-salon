
import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import MailList from "../components/mailList/MailList"
import Navbar from "../components/navbar/Navbar"
import "./home.css"
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ImageSlider from "../components/slider/ImageSlider"
import HomeFunction from "../homefunction/HomeFunction"
import TopHairstylist from "../tophairstylist/TopHairstylist"
import TopBranch from "../topbranch/TopBranch"
import AboutUs from "../aboutUs/AboutUs"
import { Element } from 'react-scroll';
import HomeBanner from "../components/homebanner/HomeBanner"


function Home() {

  const [slides, setSlides] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8088/getslideshow')
      .then(res => {
        if (res.data.Status === "Success") {
          setSlides(res.data.Result);
        } else {
          alert("Error fetching slideshow data");
        }
      })
      .catch(err => {
        console.log("Error fetching slideshow data:", err);
        alert("Error fetching slideshow data");
      });
  }, []);

  return (
    <div>
      <Navbar />
      <Header />
      <ImageSlider slides={slides} />
      <div className="homeContainer">
        <HomeBanner />
        <HomeFunction />
        <h1 className="homeTitle"> Top Hairstylist</h1>
        <TopHairstylist />
        <h1 className="homeTitle"> Most Popular Salon</h1>
        <TopBranch />
        <Element name="about-us" className="homeTitle"> About Us</Element>
        <AboutUs />
        {/* <MailList /> */}
        <Footer />

      </div>
    </div>
  )
}

export default Home