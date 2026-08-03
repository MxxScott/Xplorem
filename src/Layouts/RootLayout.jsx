import React from 'react'
import Navbar from '../components/layout/Navbar'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default RootLayout
