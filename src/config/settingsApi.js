import api from "./api";

export const updateSettings = (updates) =>
  api.patch("/user/update-profile", updates);

export const getUserSettings = () =>
  api.get("/user/me");

export const updatePassword = ({ password, newPassword }) =>
  api.post("/user/update-password", { password, newPassword });

export const getSessions = () =>
  api.get("/user/sesstions");

export const logoutFromAllSessions = () =>
  api.post("/auth/logout-from-anywhere");
