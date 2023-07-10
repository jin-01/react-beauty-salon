import Featured from "../components/featured/Featured"
import FeaturedProperties from "../components/featuredProperties/FeaturedProperties"
import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import MailList from "../components/mailList/MailList"
import Navbar from "../components/navbar/Navbar"
import PropertyList from "../components/propertyList/PropertyList"
import "./home.css"
import React, { useEffect } from 'react'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'

function Home() {

  return (
    <div>
      <Navbar/>
      <Header/>
      <div className="homeContainer">
        <Featured/>
        <h1 className="homeTitle"> Browse by properties type</h1>
        <PropertyList/>
        <h1 className="homeTitle"> Home guests love</h1>
        <FeaturedProperties/>
        <MailList/>
        <Footer/>
      </div>
    </div>
  )
}

export default Home