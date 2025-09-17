import { createContext, useState, useEffect, useContext } from "react";

import { getAuthConfig } from '../config/authConfig'; // token authentication for api calls
import api from '../api';

const CitiesContext = createContext();

export const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const config = await getAuthConfig();
        const response = await api.get("/misc/cities", config);
        setCities(response.data);
      } catch (err) {
        setError("Failed to load cities.");
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, loading, error }}>
      {children}
    </CitiesContext.Provider>
  );
};

export const useCities = () => useContext(CitiesContext);