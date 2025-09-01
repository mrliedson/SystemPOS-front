import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'  // seu back-end local
})

export default api
