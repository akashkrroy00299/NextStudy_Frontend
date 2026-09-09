import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useOutletContext } from 'react-router-dom'
import './zNotifications.css'

const reminderOptions = [
  { key: 'attendanceReminder', title: 'Attendance reminder', desc: 'A heads-up before class periods your attendance is tracked in.' },
  { key: 'examReminder', title: 'Exam reminder', desc: 'Alerts as exam dates from your subjects approach.' },
  { key: 'todoReminder', title: 'Todos reminder', desc: 'Nudges for pending to-dos with a due date coming up.' },
  { key: 'assignmentReminder', title: 'Assignment reminder', desc: 'Alerts as assignment deadlines approach.' },
  { key: 'weeklySummary', title: 'Weekly summary email', desc: 'A Sunday-evening recap of attendance and pending work.' },
]

const defaultReminderState = reminderOptions.reduce((acc, item) => {
  acc[item.key] = false
  return acc
}, {})

const Notifications = () => {

  const { updateChanges } = useOutletContext()
  const { settings } = useUser()

  const [reminders, setReminders] = useState(defaultReminderState)

  useEffect(() => {
    if (settings) {
      setReminders((prev) => {
        const updated = { ...prev }
        reminderOptions.forEach((el) => {
          if (el.key in settings) {
            updated[el.key] = settings[el.key]
          }
        })
        return updated
      })
    }
  }, [settings])

  const toggleReminder = (key) => {
    setReminders((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      updateChanges('notifications', { [key]: updated[key] })
      return updated
    })
  }

  return (
    <div className="notifications_panel">
      <h3>Notifications</h3>
      <p className="notification_lable">Choose what NexStudy nudges you about, and how.</p>

      {reminderOptions.map((el) => (
        <div className="reminder_row" key={el.key}>
          <div className="reminder_text">
            <div className="title">{el.title}</div>
            <div className="desc">{el.desc}</div>
          </div>
          <div
            className={`toggle_btn ${reminders[el.key] ? 'on' : ''}`}
            onClick={() => toggleReminder(el.key)}
          />
        </div>
      ))}
    </div>
  )
}

export default Notifications