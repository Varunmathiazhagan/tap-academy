import axios from 'axios'

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://tap-academy.onrender.com/api'
  }
  return 'http://localhost:5000/api'
}

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient
