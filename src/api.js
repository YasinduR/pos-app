import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BASE_URL, // Use the environment variable
});

export default api;