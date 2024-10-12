/// <reference types="vite/client" />
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    // Ensure the config object and its headers exist
    config.headers = config.headers || {}

    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Access-Control-Allow-Methods'] =
      'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    config.headers['Access-Control-Allow-Credentials'] = 'true'
    if (config.method === 'options') {
      config.headers['Access-Control-Request-Method'] =
        config.method.toUpperCase()
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 0) {
      console.error('CORS error:', error)
      // You can add custom error handling here
    }
    return Promise.reject(error)
  },
)

// Debugging interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request:', config)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

export default apiClient
