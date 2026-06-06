import axios from 'axios'
import { getToken } from '../context/AuthContext'

const api = axios.create({
  baseURL: '/api'
})

// Interceptor: automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api 