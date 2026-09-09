import React, { useState } from 'react'
import { ListX2 } from 'reicon-react'

const COLOR_OPTIONS = ["#014bba", "#e0ffc2", "#dd0426", "#f8f3f0"]

const EditClassModal = ({
  draft, setDraft, onClose,
  startText, setStartText, endText, setEndText,
  commitStartTime, commitEndTime,
  saveEdit, deleteEdit, subjects, setSubjects,
}) => {
  if (!draft) return null
  const subjectOptions = Array.isArray(subjects) ? subjects : []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h4>Edit class</h4>
        <button className='cencle-btn' onClick={onClose}>
          <ListX2 size={24} />
        </button>

        <input
          className="modal-title-input"
          type="text"
          value={draft.title}
          autoFocus
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        {subjectOptions.length > 0 && (
          <div className="title-suggestions">
            {subjectOptions.map((s) => (
              <button
                key={s.id ?? s.subjectId ?? s.title}
                type="button"
                className="title-suggestion"
                onClick={() => {
                  setDraft({ ...draft, title: s.title, subjectId: s.id ?? s.subjectId })
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
        )}

        <div className="modal-row">
          <span className="modal-label">Color</span>
          <div className="color-swatches">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch ${draft.color === c ? "swatch-selected" : ""}`}
                style={{ "--swatch-color": c }}
                onClick={() => setDraft({ ...draft, color: c })}
              />
            ))}
          </div>
        </div>

        <label className='notify-row' htmlFor="notify-toggle">
          <span className="modal-label">Notify</span>
          <span className="toggle">
            <input
              id="notify-toggle"
              type="checkbox"
              checked={draft.notify}
              onChange={(e) => setDraft({ ...draft, notify: e.target.checked })}
            />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
          </span>
        </label>

        <div className="modal-row time-row">
          <input
            className="time-input"
            type="text"
            value={startText}
            onChange={(e) => setStartText(e.target.value)}
            onBlur={commitStartTime}
          />
          <span className="time-sep">–</span>
          <input
            className="time-input"
            type="text"
            value={endText}
            onChange={(e) => setEndText(e.target.value)}
            onBlur={commitEndTime}
          />
        </div>

        <div className="modal-actions">
          <button onClick={deleteEdit}>Delete</button>
          <button onClick={saveEdit}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default EditClassModal