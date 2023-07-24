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
import AddBranch from './AddBranch'
import ManageBranch from './ManageBranch'
import ManageServices from './ManageServices'
import AddService from './AddService'
import ManagePayment from './ManagePayment'
import UpdatePayment from './UpdatePayment'
import ManageVoucher from './ManageVoucher'
import AddVoucher from './AddVoucher'
import EditVoucher from './EditVoucher'
import MTopHairstylist from './MTopHairstylist'
import AddTopHairstylist from './AddTopHairstylist'
import MTopBranch from './MTopBranch'
import AddTopBranch from './AddTopBranch'
import MUserBooking from './MUserBooking'
import ManageSlideShow from './ManageSlideShow'
import AddSlideShow from './AddSlideShow'
import EditBranch from './EditBranch'
import EditServices from './EditServices'
import AddBookingSlot from './AddBookingSlot'
import ManageBookingSlot from './ManageBookingSlot'
import EditBookingSlot from './EditBookingSlot'
import MUserReview from './MUserReview'
import MUserVoucher from './MUserVoucher'
import AddHomeBanner from './AddHomeBanner'
import ManageHomeBanner from './ManageHomeBanner'
import EditUser from './EditUser'
import ManageUSer from './ManageUSer'










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
      <Route path='/editbranch/:id' element={<EditBranch />}></Route>
      <Route path='/editservices/:id' element={<EditServices />}></Route>
      <Route path='/editbookingslot/:id' element={<EditBookingSlot />}></Route>
      <Route path='/homebanner' element={<ManageHomeBanner />}></Route>
      <Route path='/addhomebanner' element={<AddHomeBanner />}></Route>
      <Route path='/addbookingslot' element={<AddBookingSlot />}></Route>
      <Route path='/bookingslot' element={<ManageBookingSlot />}></Route>
      <Route path='/addbranch' element={<AddBranch />}></Route>
      <Route path='/getbranch' element={<ManageBranch />}></Route>
      <Route path='/addservices' element={<AddService />}></Route>
      <Route path='/getservices' element={<ManageServices />}></Route>
      <Route path='/payment' element={<ManagePayment />}></Route>
      <Route path='/updatepayment/:id' element={<UpdatePayment />}></Route>
      <Route path='/voucher' element={<ManageVoucher />}></Route>
      <Route path='/addvoucher' element={<AddVoucher />}></Route>
      <Route path='/editvoucher/:id' element={<EditVoucher />}></Route>
      <Route path='/tophairstylist' element={<MTopHairstylist />}></Route>
      <Route path='/addtophairstylist' element={<AddTopHairstylist />}></Route>
      <Route path='/topbranch' element={<MTopBranch />}></Route>
      <Route path='/addtopbranch' element={<AddTopBranch />}></Route>
      <Route path='/userbooking' element={<MUserBooking />}></Route>
      <Route path='/slideshow' element={<ManageSlideShow />}></Route>
      <Route path='/addslideshow' element={<AddSlideShow />}></Route>
      <Route path='/userreview' element={<MUserReview />}></Route>
      <Route path='/uservoucher' element={<MUserVoucher />}></Route>
      <Route path='/user' element={<ManageUSer />}></Route>
      <Route path='/edituser/:id' element={<EditUser />}></Route>
      </Route>
      <Route path='/adminlogin' element={<Login />}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
