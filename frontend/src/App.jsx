import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Login from './Login'
import AddAdmin from './AddAdmin'
import Admin from './Admin'
import EditAdmin from './EditAdmin'
import Hairstylist from './Hairstylist'
import AddHairstylist from './AddHairstylist'
import EditHairstylist from './EditHairstylist'
import Home from './Home/Home'
import BookingList from './components/bookingList/BookingList'
import List from './List/List'




function App() {
 

  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Dashboard/>}>
      <Route path='/admin' element={<Admin />}></Route>
      <Route path='/create' element={<AddAdmin />}></Route>
      <Route path='/hairstylist' element={<Hairstylist />}></Route>
      <Route path='/createHairstylist' element={<AddHairstylist />}></Route>
      <Route path='/editadmin/:id' element={<EditAdmin />}></Route>
      <Route path='/edithairstylist/:id' element={<EditHairstylist />}></Route>
      </Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/booking' element={<BookingList />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/hotels' element={<List />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
