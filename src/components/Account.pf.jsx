import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useOutletContext } from 'react-router-dom'
import Avtar from './Avtar'
import './zAccount.css'

// TODO: need to make timezone a dropdown

const Account = () => {

  const { updateChanges } = useOutletContext()
  const { user, userLoading } = useUser()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    username: '',
    email: '',
    timezone: 'Asia/Kolkata (GMT+5:30)'
  })

  useEffect(() => {
    if (!userLoading && user) {
      setForm((prev) => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }))
    }
  }, [userLoading, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    updateChanges('account', { [name]: value })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    //* call api
    e.target.value = ''
  }

  return (
    <div className="account_panel">
      <h3>Account</h3>
      <p className="account_lede">The basics attached to your NexStudy profile.</p>

      <div className='profule_image'>
        <button
          type="button"
          className="avatar_upload_btn"
          onClick={handleAvatarClick}
          aria-label="Change profile picture"
        >
          <Avtar username={user?.username} imgUrl={user?.profileImg?.url} size={80} />
          <span className="avatar_upload_overlay">Edit</span>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          hidden
        />
      </div>

      <div className="field">
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          disabled
          onChange={handleChange}
        />
      </div>

      <div className="field">
        <label>Time-zone</label>
        <input
          type="text"
          name="timezone"
          placeholder="Time-zone"
          value={form.timezone}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Account