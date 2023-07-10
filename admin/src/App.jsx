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
import AddHomeRowOne from './AddHomeRowOne'
import HomeRowOne from './HomeRowOne'
import ManageBooking from './ManageBooking'
import AddBooking from './AddBooking'
import AddBranch from './AddBranch'
import ManageBranch from './ManageBranch'
import ManageServices from './ManageServices'
import AddService from './AddService'








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
      <Route path='/homeone' element={<HomeRowOne />}></Route>
      <Route path='/addhomeone' element={<AddHomeRowOne />}></Route>
      <Route path='/addbooking' element={<AddBooking />}></Route>
      <Route path='/booking' element={<ManageBooking />}></Route>
      <Route path='/addbranch' element={<AddBranch />}></Route>
      <Route path='/getbranch' element={<ManageBranch />}></Route>
      <Route path='/addservices' element={<AddService />}></Route>
      <Route path='/getservices' element={<ManageServices />}></Route>
      </Route>
      <Route path='/adminlogin' element={<Login />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
