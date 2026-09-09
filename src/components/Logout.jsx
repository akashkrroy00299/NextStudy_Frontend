import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser, logoutAllDevices } from '../config/auth.api.js'
import { useUser } from '../context/UserContext'
import './zLogout.css'

const Logout = () => {
  const navigate = useNavigate()
  const { setUser } = useUser()

  const [loadingType, setLoadingType] = useState(null)
  const [confirmAll, setConfirmAll] = useState(false)

  const handleLogout = async () => {
    setLoadingType('device')
    try {
      await logoutUser()
      setUser?.(null)
      navigate('/auth/login')
    } catch (err) {
      console.error('logout failed:', err)
    } finally {
      setLoadingType(null)
    }
  }

  const handleLogoutAll = async () => {
    if (!confirmAll) {
      setConfirmAll(true)
      return
    }
    setLoadingType('all')
    try {
      await logoutAllDevices()
      setUser?.(null)
      navigate('/auth/login')
    } catch (err) {
      console.error('logout all failed:', err)
    } finally {
      setLoadingType(null)
      setConfirmAll(false)
    }
  }

  return (
    <div className="logout_panel">
      <h3>Log out</h3>
      <p className="logout_lede">Sign out of NexStudy on this device, or everywhere at once.</p>

      <div className="logout_row">
        <div className="logout_info">
          <span className="logout_title">This device</span>
          <span className="logout_sub">End your session here only.</span>
        </div>
        <button
          className="logout_btn"
          onClick={handleLogout}
          disabled={loadingType !== null}
        >
          {loadingType === 'device' ? 'Logging out…' : 'Log out'}
        </button>
      </div>

      <div className="logout_row">
        <div className="logout_info">
          <span className="logout_title">Everywhere</span>
          <span className="logout_sub">End all sessions on every device, including this one.</span>
        </div>
        <button
          className={`logout_btn logout_btn_danger ${confirmAll ? 'logout_btn_confirm' : ''}`}
          onClick={handleLogoutAll}
          disabled={loadingType !== null}
          onBlur={() => setConfirmAll(false)}
        >
          {loadingType === 'all'
            ? 'Logging out…'
            : confirmAll
              ? 'Click again to confirm'
              : 'Log out everywhere'}
        </button>
      </div>
    </div>
  )
}

export default Logout