import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})
api.defaults.withCredentials = true;

export default api