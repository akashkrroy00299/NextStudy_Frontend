// hooks/js/useEditTimetableMode.js
import { useState } from "react"
import { saveTimetable } from "../../config/attendance.api.js"

export const useEditTimetableMode = ({ classes, setClasses, subjects, setSubjects, trigerRef }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSnapshot, setSavedSnapshot] = useState(null)

  const enterEditMode = () => {
    setSavedSnapshot(
      classes.map((cls) => ({ ...cls }))
    )
    setIsEditing(true)
  }

  const cancelEditMode = () => {
    if (savedSnapshot) setClasses(savedSnapshot)
    setSavedSnapshot(null)
    setIsEditing(false)
  }

  const saveEditMode = async () => {
    setIsSaving(true)
    try {
      const res = await saveTimetable(classes)
      
      if (res && res.data && res.data.classesData) {
        setClasses(res.data.classesData)
        setSubjects(res.data.subjectData?.subjects || [])
        setSavedSnapshot(null)
        setIsEditing(false)
        trigerRef()
      } else {
        console.error("Invalid response format:", res)
      }
    } catch (error) {
      console.error("Failed to save classes:", error)
      alert("Failed to save. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return { isEditing, isSaving, enterEditMode, cancelEditMode, saveEditMode }
}