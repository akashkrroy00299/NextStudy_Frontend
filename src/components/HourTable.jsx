import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from "uuid"
import { getClasses, getSubjects } from '../config/attendance.api.js'
import { getWeekDays, WEEK_DAY_NAMES, normalizeDayIndex } from '../utils/js/weekHelpers.js'
import { useGridMeasure } from '../hooks/js/userGridMeasure.js'
import { useEditTimetableMode } from '../hooks/js/useEditTimetableMode.js'
import { useEditModal } from '../hooks/js/useEditModal.js'
import { useUser } from '../context/UserContext.jsx'
import "./zHourTable.css"
import "./zSkeleton.css"

import EditModeControlss from './EditModeControlss.jsx'
import ClassBlock from './ClassBlock.jsx'
import EditClassModal from './EditClassModal.jsx'


// * HEARD CODED DATA
const startHoure = 7
const slots = Array.from({ length: 12 }, (_, i) => startHoure + i)
const weekNames = WEEK_DAY_NAMES
const COLOR_OPTIONS = ["#014bba", "#e0ffc2", "#dd0426", "#f8f3f0"]

// * SECTION(01) START
const HourTable = ({trigerRef}) => {

  // * MAIN STATES
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const { settings } = useUser() 

  // * CALLING APIs
  useEffect(() => {
    let cancelled = false

    const loadTimetable = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)

        const [classesRes, subjectsRes] = await Promise.all([
          getClasses(),
          getSubjects(),
        ])

        if (cancelled) return

        setClasses(classesRes.data.classes)
        setSubjects(subjectsRes.data.subjectsData.subjects)
      } catch (error) {
        if (!cancelled) setLoadError(error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadTimetable()

    return () => { cancelled = true }
  }, [])

  // * CALLING FOR HOOK FUNCTIONS
  const { weekDays, today } = getWeekDays(weekNames)
  const { tableRef, grid } = useGridMeasure([isLoading])
  const { isEditing, isSaving, enterEditMode, cancelEditMode, saveEditMode } =
    useEditTimetableMode({ classes, setClasses, subjects, setSubjects, trigerRef })

  const {
    draft, setDraft, startText, setStartText, endText, setEndText,
    openEditModal, closeEditModal, commitStartTime, commitEndTime,
    saveEdit, deleteEdit,
  } = useEditModal({ setClasses, startHoure, slotsLength: slots.length, snapMinutes: 15, subjects, setSubjects })

  const isModalOpen = Boolean(draft)

  // * CRATING NEW CLASS
  const handleSlotClick = (day, slot) => {
    if (!isEditing) return

    const newClass = {
      _id: `temp-${Date.now()}`,
      subjectId: uuidv4(),
      day: day.dayIndex,
      start: slot * 60,
      end: slot * 60 + 60,
      title: "New class",
      color: COLOR_OPTIONS[0],
      notify: settings.attendanceReminders || false,
      isValid: true,
    }
    
    setClasses((prev) => [...prev, newClass])
  }

  // * IF API GOT ERROR
  if (isLoading) return <div className='hour-table-wrapper loading'>
    <div className="loading navbar">
      <div className="loading-today"></div>
      <div className="loading-btns">
        <div className="btn-1"></div>
        <div className="btn-2"></div>
      </div>
    </div>
    <div className="loeading-body"></div>
  </div>

  return (
    <div className='hour-table-wrapper'>
      <div className="upper-body">
        <div className="today">
          <p className='date'>{today.day}/<span>{today.month}</span></p>
          <p className='day-name'>{weekNames[today.dayOfWeek - 1]}</p>
        </div>

        <EditModeControlss
          isEditing={isEditing}
          isSaving={isSaving}
          onEnter={enterEditMode}
          onCancel={cancelEditMode}
          onSave={saveEditMode}
          disabled={isLoading || Boolean(loadError)}
        />
      </div>

      <div className="hour-table" ref={tableRef}>
        <div className="empty-cell"></div>

        {slots.map((slot) => (
          <div className="hour-cell" key={slot}>
            {slot > 12 ? slot - 12 : slot}
          </div>
        ))}

        {weekDays.map((day) => (
          <div className="day-row" style={{ display: 'contents' }} key={day.isoDate}>
            <div className="day-cell">
              <span>{day.label}</span>
              <span>{day.date}/{day.month}</span>
            </div>
            {slots.map((slot) => (
              <div
                className="slot-cell"
                key={`${day.isoDate}-${slot}`}
                onClick={() => handleSlotClick(day, slot)}
              />
            ))}
          </div>
        ))}

        {loadError && (
          <div className="error-overlay">
            <p className="error-text">Couldn't load data</p>
          </div>
        )}

        <div className="event-layer">

          { grid.cellWidth > 0 && classes.map((cls) => {
            const dayIndex = normalizeDayIndex(cls.day)
            const left = grid.labelWidth + ((cls.start - startHoure * 60) / 60) * grid.cellWidth
            const top = grid.headerHeight + dayIndex * grid.cellHeight
            const width = ((cls.end - cls.start) / 60) * grid.cellWidth

            return (
              <ClassBlock
                key={cls._id}
                cls={cls}
                left={left}
                top={top}
                width={width}
                height={grid.cellHeight}
                tableRef={tableRef}
                grid={grid}
                setClasses={setClasses}
                startHoure={startHoure}
                weekNames={weekNames}
                isEditing={isEditing}
                isSaving={isSaving}
                isModalOpen={isModalOpen}
                openEditModal={openEditModal}
              />
            )
          })}
        </div>
      </div>

      <EditClassModal
        draft={draft}
        setDraft={setDraft}
        onClose={closeEditModal}
        startText={startText}
        setStartText={setStartText}
        endText={endText}
        setEndText={setEndText}
        commitStartTime={commitStartTime}
        commitEndTime={commitEndTime}
        saveEdit={saveEdit}
        deleteEdit={deleteEdit}
        subjects={subjects}
        setSubjects={setSubjects}
      />
    </div>
  )
}

export default HourTable