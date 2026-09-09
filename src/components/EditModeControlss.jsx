import React from 'react'

const EditModeControlss = ({ isEditing, isSaving, onEnter, onCancel, onSave, disabled }) => {

  if (!isEditing) {
    return (
      <button className="mode-btn mode-btn-edit" onClick={onEnter} disabled={disabled}>Edit</button>
    )
  }

  return (
    <div className="edit-mode-actions">
      <button className="mode-btn mode-btn-cancel" onClick={onCancel} disabled={disabled || isSaving}>Cancel</button>
      <button className="mode-btn mode-btn-save" onClick={onSave} disabled={disabled || isSaving}>
        {isSaving ? "Saving" : "Save"}
      </button>
    </div>
  )

}

export default EditModeControlss