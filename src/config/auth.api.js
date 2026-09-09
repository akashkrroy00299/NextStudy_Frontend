import api from "../config/api.js"
import { clearAccessToken } from "./tokenStore"

export const logoutUser = async () => {
    const { data } = api.post("/auth/logout")
    clearAccessToken()
    return data;
}

export const logoutAllDevices = async () => {
  const { data } = await api.post("/auth/logout-from-anywhere")
  clearAccessToken()
  return data
}