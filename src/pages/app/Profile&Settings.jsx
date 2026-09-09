import React, { useState } from 'react'
import ProfileNavbar from '../../components/ProfileNavbar'
import { Outlet } from 'react-router-dom'
import { updateSettings } from '../../config/settingsApi'
import './zProfile.css'

const ProfileAndSettings = () => {

  const [changes, setChanges] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const updateChanges = (section, data) => {
    setChanges((prev) => ({
      ...prev,
      [section] : {
        ...prev[section],
        ...data,
      }
    }))
  }

  const saveChanges = async () => {
    if (Object.keys(changes).length === 0 || saving) return

    setSaving(true)
    setSaveError('')
    try {
      await updateSettings(changes)
      setChanges({})
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Could not save your changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='wrapper_profile_and_setting_layout'>
      <div className="topbar_profile">
        <p>Account & Settings</p>
        <button onClick={saveChanges} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saveError && <p role="alert">{saveError}</p>}
      </div>
      <div className="content_row_profile">
        <div className="sidebar_ineer_prodile">
          <ProfileNavbar />
        </div>
        <div className="outlet_ineer_profile">
          <Outlet context={{ updateChanges }} />
        </div>
      </div>
    </div>
  )
}

export default ProfileAndSettings