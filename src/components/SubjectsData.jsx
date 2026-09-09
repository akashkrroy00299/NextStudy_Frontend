import React, { useState } from 'react'
import "./zSubjetcsData.css"

const COLOR_OPTIONS = ["#014bba", "#e0ffc2", "#dd0426", "#f8f3f0"]
const ATTENDANCE_COLORS = {
  red: "#ef4444",
  yellow: "#eab308",
  green: "#22c55e",
  blue: "#0ea5e9",
}

const getAttendanceColor = (percent) => {
  if (percent <= 45) return ATTENDANCE_COLORS.red
  if (percent <= 75) return ATTENDANCE_COLORS.yellow
  if (percent <= 90) return ATTENDANCE_COLORS.green
  return ATTENDANCE_COLORS.blue
}


const RAW_DATA = [
  { title: "Math", subjectId: 1, totalClass: 230, attendedClass: 155, },
  { title: "Physics", subjectId: 2, totalClass: 180, attendedClass: 142, },
  { title: "Chemistry", subjectId: 3, totalClass: 200, attendedClass: 98, },
  { title: "English", subjectId: 4, totalClass: 150, attendedClass: 130 },
  { title: "Computer Science", subjectId: 5, totalClass: 210, attendedClass: 190 },
  { title: "Data Structures", subjectId: 6, totalClass: 165, attendedClass: 70 },
]

const SubjectsData = () => {

  const [subjects, setSubjects] = useState(RAW_DATA) //! API call

  return (
    <div className='subject-dat-body'>
      <div className="section-heading">Subjects</div>
      <div className='body-subjets'>
        {
          subjects.map((sub) => {
            const parsentage = Math.round((sub.attendedClass / sub.totalClass) * 100)

            return (
              <div key={sub.subjectId} className='subjets-bar'>
                <div className="info">
                  <div className="title">{sub.title}</div>
                  <div className="numbers">
                    <span className="percent-label" style={{ backgroundColor: getAttendanceColor(parsentage) }}>{parsentage}%</span>
                    <span>{sub.attendedClass}/{sub.totalClass}</span>
                  </div>
                </div>

                <div className="bar-row">
                  <ProgressBar
                    percent={parsentage}
                    color={getAttendanceColor(parsentage)}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SubjectsData

const ProgressBar = ({ percent, color = "#014bba" }) => {
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  )
}