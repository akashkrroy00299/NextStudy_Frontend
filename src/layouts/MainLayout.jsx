import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx"
import "./zMainLayout.css"

const MainLayout = () => {

  const [page, setPage] = useState("Dashbord") //Dashboard, Activities, Settings, Profile

  return (
    <div className='main-layout'>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-layout-outlet">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout