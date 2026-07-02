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

export default API;
