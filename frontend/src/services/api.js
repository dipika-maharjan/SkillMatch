// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Resume endpoints
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return API.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getResumeAnalysis = (jobId) => {
  return API.get("/resume/analysis", {
    params: jobId ? { jobId } : {},
  });
};

export const getResume = () => {
  return API.get("/resume");
};

export const deleteResume = () => {
  return API.delete("/resume");
};

// Auth / profile / settings endpoints
export const getProfile = () => API.get("/auth/profile");

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return API.post("/auth/upload-avatar", formData);
};

export const updateProfile = (payload) => {
  // Remove avatarUrl from payload if it's base64 (it should be uploaded separately)
  const cleanPayload = { ...payload };
  if (cleanPayload.avatarUrl && cleanPayload.avatarUrl.startsWith("data:")) {
    delete cleanPayload.avatarUrl;
  }
  return API.put("/auth/profile", cleanPayload);
};

export const getSettings = () => API.get("/auth/settings");

export const updateSettings = (payload) => API.put("/auth/settings", payload);

export const changePassword = (payload) =>
  API.put("/auth/change-password", payload);

export const logout = () => API.post("/auth/logout");

// Notification endpoints
export const getNotifications = () => API.get("/notifications");

export const getUnreadNotificationCount = () =>
  API.get("/notifications/unread-count");

export const createNotification = (payload) =>
  API.post("/notifications", payload);

export const markNotificationRead = (notificationId) =>
  API.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = () =>
  API.patch("/notifications/read-all");

export const deleteNotification = (notificationId) =>
  API.delete(`/notifications/${notificationId}`);

export default API;
