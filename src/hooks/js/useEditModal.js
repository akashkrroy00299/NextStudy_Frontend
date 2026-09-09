import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { clamp, formatTime24, parseTime24 } from '../../utils/js/timeHelpers.js'

export const useEditModal = ({ setClasses, startHoure, slotsLength, snapMinutes, subjects, setSubjects }) => {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(null)
  const [startText, setStartText] = useState("")
  const [endText, setEndText] = useState("")

  const openEditModal = (cls) => {
    setEditingId(cls._id)
    setDraft({ ...cls, notify: cls.notify ?? false })
    setStartText(formatTime24(cls.start))
    setEndText(formatTime24(cls.end))
  }

  const closeEditModal = () => {
    setEditingId(null)
    setDraft(null)
  }

  const commitStartTime = () => {
    const parsed = parseTime24(startText)
    const gridMin = startHoure * 60
    const maxStart = draft.end - snapMinutes

    if (parsed === null) {
      setStartText(formatTime24(draft.start))
      return
    }

    const snapped = Math.round(parsed / snapMinutes) * snapMinutes
    const clamped = clamp(snapped, gridMin, maxStart)
    setDraft({ ...draft, start: clamped })
    setStartText(formatTime24(clamped))
  }

  const commitEndTime = () => {
    const parsed = parseTime24(endText)
    const gridMax = (startHoure + slotsLength) * 60
    const minEnd = draft.start + snapMinutes

    if (parsed === null) {
      setEndText(formatTime24(draft.end))
      return
    }

    const snapped = Math.round(parsed / snapMinutes) * snapMinutes
    const clamped = clamp(snapped, minEnd, gridMax)
    setDraft({ ...draft, end: clamped })
    setEndText(formatTime24(clamped))
  }

  const saveEdit = () => {

    const existingSubject = subjects.find(
      (s) => s.title.toLowerCase() === draft.title.toLowerCase()
    )

    let updatedDraft = draft
    if (existingSubject) {
      updatedDraft = { ...draft, subjectId: existingSubject.subjectId }
    } else {
      const newSubjectId = uuidv4()
      const newSubject = { subjectId: newSubjectId, title: draft.title }
      updatedDraft = { ...draft, subjectId: newSubjectId }
      setSubjects((prev) => [...prev, newSubject])
    }

    setClasses((prev) =>
      prev.map((c) => (c._id === updatedDraft._id ? updatedDraft : c)))

    closeEditModal()
  }

  const deleteEdit = () => {
    setClasses((prev) => prev.filter((c) => c._id !== draft._id))
    closeEditModal()
  }

  return {
    editingId, draft, setDraft, startText, setStartText, endText, setEndText,
    openEditModal, closeEditModal, commitStartTime, commitEndTime,
    saveEdit, deleteEdit,
  }
}