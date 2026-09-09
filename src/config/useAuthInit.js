// useAuthInit.js
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import api from "./api"
import { getAccessToken, setAccessToken, clearAccessToken, subscribeToAuthChanges } from "./tokenStore"

export const useAuthInit = () => {
    const location = useLocation()
    const [authChecked, setAuthChecked] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Skip refresh-token on auth pages to save rate limit slots
    useEffect(() => {
        const isAuthRoute = location.pathname.startsWith("/auth")
        
        if (isAuthRoute) {
            setAuthChecked(true)
            return
        }

        if (getAccessToken()) {
            setIsAuthenticated(true)
            setAuthChecked(true)
            return
        }

        api.post("/auth/refresh-token")
            .then(({ data }) => {
                setAccessToken(data.token)
                setIsAuthenticated(true)
            })
            .catch(() => {
                clearAccessToken()
                setIsAuthenticated(false)
            })
            .finally(() => {
                setAuthChecked(true)
            })
    }, [location.pathname])

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((token) => {
            setIsAuthenticated(!!token)
        })
        return unsubscribe
    }, [])

    return { authChecked, isAuthenticated }
}