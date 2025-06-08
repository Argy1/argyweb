import axios from 'axios'

// Axios interceptor instance
const AxiosInstance = axios.create({
  baseURL: process.env.BASE_URL
})

export default AxiosInstance