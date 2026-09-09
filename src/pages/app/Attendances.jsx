import React, { useRef, useState } from 'react'
import HourTable from "../../components/HourTable.jsx"
import TodayClasses from "../../components/TodayClasses.jsx"
import SubjectsData from '../../components/SubjectsData.jsx'
import AttendanceGrid from '../../components/AttendanceGrid.jsx'
import "./zAttendances.css"

const Attendances = () => {

  const [refkey, setRefkey] = useState(0)
  const trigerRef = () => {
    setRefkey(e => e + 1)
  }

  return (
    <div className='attendances-layout'>
      <div className="calender-layout">
        <HourTable trigerRef={trigerRef} />
      </div>
      <div className="analythis">
        <TodayClasses refkey={refkey} />
        <SubjectsData />
        <AttendanceGrid />
      </div>
    </div>
  )
}

export default Attendances