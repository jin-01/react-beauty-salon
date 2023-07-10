import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home/Home'
import BookingList from './components/bookingList/BookingList'
import List from './List/List'
import HairstylistList from './hairstylistList/HairstylistList'
import Hairstylist from './components/hairstylist/Hairstylist'






function App() {
 

  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/booking' element={<BookingList />}></Route>
      <Route path='/bookingslot' element={<List />}></Route>
      <Route path='/hairstylistlist' element={<HairstylistList />}></Route>
      <Route path='/hairstylist' element={<Hairstylist />}></Route>


    </Routes>
    </BrowserRouter>
  )
}

export default App
