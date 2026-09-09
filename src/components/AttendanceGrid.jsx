import React, { useEffect, useState, useRef } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import "./zAttendanceGrid.css"
import { getMonthlyGrid } from "../config/attendance.api.js"


// * RAW DATA
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]
const WEEKS = ["1st week", "2nd week", "3rd week", "4th week", "5th week"]
const COLOR_SCHEMES = [
  { id: "default", name: "Default", attend: "#f0f1f5", miss: "#B1B2B5", holiday: "#e0ffc2" },
  { id: "ocean", name: "Ocean", attend: "#0ea5e9", miss: "#f97316", holiday: "#1e293b" },
  { id: "sunset", name: "Sunset", attend: "#f59e0b", miss: "#dc2626", holiday: "#7c2d12" },
  { id: "mono", name: "Mono", attend: "#525252", miss: "#a3a3a3", holiday: "#171717" },
]

const AttendanceGrid = () => {

  // * STATES
  const [layout, setLayout] = useState(true) // * 30 / 07
  const today = Temporal.Now.plainDateISO()
  const [month, setMonth] = useState(today.month - 1)
  const [year, setYear] = useState(today.year)
  const [week, setWeek] = useState(0) // * 0, 1, 2, 3, 4
  const [scheme, setScheme] = useState(COLOR_SCHEMES[0])
  const [colorSchemaArray, _] = useState(COLOR_SCHEMES)
  const [schemDropDown, setDD] = useState(false)

  const [gridData, setGridData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  // * DROP DOWN OUTSIDE CLICK LOGIC
  const dropdownRef = useRef(null)
  useEffect(() => {
    if (!schemDropDown) return

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDD(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [schemDropDown])

  // * CALL API
  useEffect(() => {
    let cancelled = false

    const loadGrid = async () => {
      try {
        setIsLoading(true)
        setIsError(false)

        const res = await getMonthlyGrid(month, year)

        if (cancelled) return

        console.log(res.data)
        setGridData(res.data)

      } catch (error) {
        console.log(error)

        if (!cancelled) {
          setIsError(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadGrid()

    return () => {
      cancelled = true
    }
  }, [month, year])

  // * CHANGE THEME FUNCTION
  const hendaleChangeThereClick = () => {
    setDD(e => !e)
  }


  // * HTML
  return (
    <div
      className='warapeer-section-04'
      style={{
        "--attend-clr": scheme.attend,
        "--miss-clr": scheme.miss,
        "--holiday-clr": scheme.holiday,
      }}
    >
      <div className="top-section">
        <div className="month">{`${MONTHS[month]}-${year}`}</div>
        <div className="attendance-grid__options">
          {!layout && (
            <div className='week-change'>{WEEKS[week]}</div>
          )
          }
          <div className="schema">
            <div className="clr"><div className="clr-cell color-01"></div><div className="text">attend</div></div>
            <div className="clr"><div className="clr-cell color-02"></div><div className="text">missed</div></div>
            <div className="clr"><div className="clr-cell color-03"></div><div className="text">holiday</div></div>
          </div>

          <div className="month-changer" ref={dropdownRef}>
            <button className="mode-btn mode-btn-edit" onClick={hendaleChangeThereClick}>{scheme.name}</button>

            {schemDropDown && (
              <div className='chema-drop-down'>
                <div className='line'><div></div></div>
                {colorSchemaArray.map((s) => (
                  <div
                    key={s.id}
                    className='schema2'
                    onClick={() => {
                      setScheme(s)
                      setDD(false)
                    }}
                  >
                    <div className="title text">{s.name}</div>
                    <div className="colors">
                      <div className="clr-cell" style={{ backgroundColor: s.attend }}></div>
                      <div className="clr-cell" style={{ backgroundColor: s.miss }}></div>
                      <div className="clr-cell" style={{ backgroundColor: s.holiday }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="month-changer">
            <button className="mode-btn mode-btn-edit" disabled>{MONTHS[month]}</button>
          </div>
        </div>
      </div>

      <div className="grid-layout">
        {isLoading && <p>Loading...</p>}
        {!isLoading && isError && <p>Failed to load.</p>}

        {!isLoading && !isError && gridData && gridData.subjects.length === 0 && (
          <div className='nodata'>No Data Available Yet</div>
        )}

        {!isLoading && !isError && gridData && gridData.subjects.length !== 0 && (
          <div
            className="grid-container"
            style={{ gridTemplateColumns: `8rem repeat(${gridData.days.length}, 1fr)` }}
          >

            {/* GRID - HEADER */}
            <div className="grid-corner">Subject</div>
            {gridData.days.map((day) => (
              <div key={day} className="grid-day-header">{day}</div>
            ))}

            {/* GRID - BODY */}
            {gridData.subjects.map((subject) => (
              <React.Fragment key={subject.subjectId}>
                <div className="grid-subject-name">{subject.title}</div>
                {subject.cells.map((cell) => (
                  <div
                    key={cell.date}
                    className="grid-cell"
                  >
                    <div className={` grid-box grid-cell-${cell.status}`}></div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceGrid