import api from "./api";

export const updateProfile = async (userData) => {
    await api.patch("/user/update-profile", userData)
}