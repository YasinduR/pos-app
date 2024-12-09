import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;
console.log("Using base URL:", baseURL);

const api = axios.create({
  baseURL: baseURL, // Use the environment variable
});

export default api;