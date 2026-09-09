import { createContext, useState, useEffect, useCallback  } from "react";
import { dummyNotifications } from "../../../../DUMMY_DATA.js"
import { useGroupedNotifications } from "../hook/useFlatNToGrop.js"

export const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fatchNotifications = async () => {
            setLoading(true)
            setError(null)

            try {
                setNotifications(dummyNotifications)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        fatchNotifications()
    }, [])

    const { all, seen, unseen, reload } = useGroupedNotifications(notifications)

    const markAsRead = useCallback((id) => {
        setNotifications((prev) => 
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
    }, [])

    const markAllASRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }, [])

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const value = {
        notifications,
        setNotifications,
        loading,
        error,
        grouped: { all, seen, unseen },
        reload,
        markAsRead,
        markAllASRead,
        unreadCount,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}