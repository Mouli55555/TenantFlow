import axios from "axios"
import { logout } from "../auth/auth"
import { toast } from "react-toastify"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      toast.error("Session expired. Please login again.")
      logout()
    }

    if (status === 403) {
      toast.error("You are not authorized to perform this action")
    }

    return Promise.reject(error)
  }
)

export default api
