import { HashRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect} from 'react'

import Layout from './layouts/layout/layout'
import Home from './Pages/home'
import Login from './Pages/login'
import MyBuildings from './Pages/MyBuildings'
import BuildingDetails from './Pages/BuildingDetails'
import Customer from './Pages/customer'
import Admin from './Pages/Admin'
import Employee from './Pages/Employee'
import Register from './Pages/Register'

import './App.css'

const intTab = 'home'

function App() {
  const [tab, setTab] = useState('');

  useEffect(() => {
    setTab(intTab)
  }, []);

  return (
   <div>
      <HashRouter>
        <Routes>
          <Route element={<Layout tab={tab} setTab={setTab} />}>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route path='/customer' element={<MyBuildings />} />
          <Route path='/building/:id' element={<BuildingDetails />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/employee' element={<Employee />} />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
