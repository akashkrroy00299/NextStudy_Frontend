import React from 'react'
import { Outlet } from "react-router-dom";
import "../../layouts/zMainLayout.css"

const Activities = () => {
  return (
    <div className='outlet-higth'>
      <Outlet />
    </div>
  )
}

export default Activities