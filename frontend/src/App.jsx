import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Home from './home/Home'
import BookingList from './components/bookingList/BookingList'
import List from './List/List'
import HairstylistList from './hairstylistList/HairstylistList'
import BranchList from './branchlist/BranchList'
import MyBooking from './mybooking/MyBooking'
import Profile from './profile/Profile'
import BookingHistory from './bookinghistory/BookingHistory'
import Loyalty from './loyaltyprogram/loyalty'
import Payment from './payment/Payment'
import AddReview from './AddReview'
import ShopMap from './map/ShopMap'
import HairService from './hairservice/HairService'
import Register from './Register'
import AboutUs from './aboutUs/AboutUs'










function App() {
 

  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/about' element={<AboutUs />}></Route>
      <Route path='/booking' element={<BookingList />}></Route>
      <Route path='/bookingslot' element={<List />}></Route>
      <Route path='/hairstylistlist' element={<HairstylistList />}></Route>
      <Route path='/branchlist' element={<BranchList />}></Route>
      <Route path='/mybooking' element={<MyBooking />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/bookinghistory' element={<BookingHistory />}></Route>
      <Route path='/loyalty' element={<Loyalty />}></Route>
      <Route path='/payment/:id' element={<Payment />}></Route>
      <Route path='/addreview' element={<AddReview />}></Route>
      <Route path='/shopmap' element={<ShopMap />}></Route>
      <Route path='/hairservice' element={<HairService />}></Route>
      <Route path='/register' element={<Register />}></Route>
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
