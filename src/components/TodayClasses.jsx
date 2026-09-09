import React, { useEffect, useState } from 'react'
import "./zTodayClasses.css"
import "./zSkeleton.css"
import { getWeekDays, WEEK_DAY_NAMES, normalizeDayIndex } from '../utils/js/weekHelpers.js'
import { formatTime } from "../utils/js/timeHelpers.js"
import { getTodayClasses, updateAttendance } from "../config/attendance.api.js"


const TodayClasses = ({refkey}) => {

  // * STATES
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)


  // * CALLING FATCH CLASSES API
  useEffect(() => {
    let cancelled = false

    const loadTodayClasses = async () => {
      try {
        setIsLoading(true)
        setIsError(false)
        const res = await getTodayClasses()

        if (cancelled) return
        setClasses(res.data.data)
      } catch (error) {
        console.log(error)
        if (!cancelled) setIsError(true)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadTodayClasses()

    return () => { cancelled = true }
  }, [refkey])

  // * CALLING UPDATE ATTENDANCE API
  const handleToggleAttend = async (cls) => {
    const nextAttended = !cls.attended

    setClasses((prev) =>
      prev.map((c) =>
        c.subjectId === cls.subjectId ? { ...c, attended: nextAttended } : c
      )
    )
    setUpdatingId(cls.subjectId)

    try {
      await updateAttendance(cls.subjectId, nextAttended)
    } catch (error) {
      console.log(error)
      setClasses((prev) =>
        prev.map((c) =>
          c.subjectId === cls.subjectId ? { ...c, attended: !nextAttended } : c
        )
      )

    } finally {
      setUpdatingId(null)
    }
  }


  // * UTILES
  const totalClass = classes.length
  function getAttended(classes) {
    if (!classes || classes.length === 0) return 0;
    let count = 0;
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].attended) {
        count += 1;
      }
    }
    return count;
  }

  const attended = getAttended(classes);

  return (
    <div className={`today-classes-body ${isLoading || isError && "min-width"}`}>
      <div className='top-bar'>
        <div className="top-left">{`${attended}/${totalClass}`}</div>
        <div className="all-attend">
          <button className="mode-btn mode-btn-edit" disabled={attended === totalClass || isLoading || isError || classes.length === 0}>All attended</button>
        </div>
      </div>

      {isLoading && (
        <div className="body">
          {Array.from({ length: 4 }).map((_, i) => (
                      <div className="today-class skeleton-today-class" key={`skel-${i}`}>
              <div>
                <div className="skeleton-block skeleton-shimmer" style={{ width: '5rem', height: '0.9rem', marginBottom: '0.35rem' }} />
                <div className="skeleton-block skeleton-shimmer" style={{ width: '3.5rem', height: '0.65rem' }} />
              </div>
              <div className="skeleton-block skeleton-shimmer" style={{ width: '3.5rem', height: '1.5rem' }} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <p className='error-text'>Couldn't load today's classes.</p>
      )}

      {!isLoading && !isError && classes.length === 0 && (
        <p className='no-class'>No classes today.</p>
      )}

      {!isLoading && !isError && classes.length > 0 && (<div className='body'>
        {classes.map((cls) => {
          const startTime = formatTime(cls.start)
          const endTime = formatTime(cls.end)
          const weekDay = WEEK_DAY_NAMES[cls.day]

          return (
                    <div className='today-class' key={cls._id} style={{ "--event-color": cls.color }}>
              <div>
                <div className='class-title'>{cls.title}</div>
                <div className="class-footer">{`${startTime}-${endTime}`}</div>
              </div>

              <div>
                <div className="btn">
                  <button
                    className={cls.attended ? "attended" : ""}
                    disabled={updatingId === cls.subjectId}
                    onClick={() => handleToggleAttend(cls)}
                  >
                    {cls.attended ? "Attended" : "Mark"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>)}
    </div>
  )
}

export default TodayClasses